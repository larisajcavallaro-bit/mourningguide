import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts, notificationContacts } from '@/db/schema/people';
import { letters, obituary } from '@/db/schema/vault';
import { activations, notificationLogs } from '@/db/schema/activation';
import { eq, and, lte, isNotNull } from 'drizzle-orm';
import { sendLetterDelivery, sendActivationNotification, sendActivationComplete } from '@/lib/emails';
import { delayedLetterReleaseAt, scheduledNotifyAt } from '@/lib/activation';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://mourninguide.com';

// Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. We also allow a
// manual trigger with the same secret for testing.
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get('authorization');
  return header === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  return run(req);
}
export async function POST(req: Request) {
  return run(req);
}

async function run(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const summary = { activationsCompleted: 0, lettersSent: 0, contactsNotified: 0 };

  // ── 1. Complete pending activations whose cancel window has closed ──────────
  const duePending = await db.select().from(activations)
    .where(and(
      eq(activations.status, 'pending'),
      isNotNull(activations.cancelWindowExpiresAt),
      lte(activations.cancelWindowExpiresAt, now),
    ));

  for (const act of duePending) {
    await completeActivation(act.id, act.accountId, act.triggeredByUserId, now);
    summary.activationsCompleted++;
  }

  // ── 2. Send scheduled letters that are now due (delayed release) ────────────
  const dueLetters = await db.select().from(letters)
    .where(and(
      eq(letters.deliveryStatus, 'scheduled'),
      isNotNull(letters.scheduledReleaseAt),
      lte(letters.scheduledReleaseAt, now),
    ));

  for (const l of dueLetters) {
    if (!l.recipientEmail) {
      await db.update(letters).set({ deliveryStatus: 'skipped' }).where(eq(letters.id, l.id));
      continue;
    }
    const acct = await db.select({ subjectName: accounts.subjectName })
      .from(accounts).where(eq(accounts.id, l.accountId)).limit(1);
    const senderName = acct[0]?.subjectName ?? 'Your loved one';
    try {
      await sendLetterDelivery({ to: l.recipientEmail, recipientName: l.recipientName, senderName, letterBody: l.body });
      await db.update(letters).set({ deliveryStatus: 'sent', releasedAt: now }).where(eq(letters.id, l.id));
      summary.lettersSent++;
    } catch {
      await db.update(letters).set({ deliveryStatus: 'failed' }).where(eq(letters.id, l.id));
    }
  }

  // ── 3. Send scheduled notifications that are now due (phased) ───────────────
  const dueContacts = await db.select().from(notificationContacts)
    .where(and(
      eq(notificationContacts.notified, false),
      isNotNull(notificationContacts.scheduledNotifyAt),
      lte(notificationContacts.scheduledNotifyAt, now),
    ));

  for (const c of dueContacts) {
    if (!c.email) continue;
    const acct = await db.select({ subjectName: accounts.subjectName })
      .from(accounts).where(eq(accounts.id, c.accountId)).limit(1);
    const deceasedName = acct[0]?.subjectName ?? 'your loved one';
    try {
      await sendActivationNotification({ to: c.email, contactName: c.name, deceasedName, activatedBy: 'the family' });
      await db.update(notificationContacts)
        .set({ notified: true, notifiedAt: now })
        .where(eq(notificationContacts.id, c.id));
      summary.contactsNotified++;
    } catch { /* retried next run */ }
  }

  return NextResponse.json({ ok: true, ...summary, ranAt: now.toISOString() });
}

async function completeActivation(activationId: string, accountId: string, triggeredByContactId: string, now: Date) {
  const [account] = await db.select().from(accounts).where(eq(accounts.id, accountId)).limit(1);
  if (!account) return;
  const senderName = account.subjectName ?? 'Your loved one';

  // Mark the account and activation as fully active
  await db.update(accounts)
    .set({ activationStatus: 'activated', activatedAt: now, updatedAt: now })
    .where(eq(accounts.id, accountId));
  await db.update(activations)
    .set({ status: 'completed', completedAt: now, activatedAt: now })
    .where(eq(activations.id, activationId));

  // ── Letters ──
  const allLetters = await db.select().from(letters).where(eq(letters.accountId, accountId));
  let lettersSent = 0, lettersScheduled = 0;
  for (const l of allLetters) {
    if (!l.recipientEmail) {
      await db.update(letters).set({ deliveryStatus: 'skipped' }).where(eq(letters.id, l.id));
      continue;
    }
    if (l.releaseTiming === 'delayed') {
      await db.update(letters)
        .set({ deliveryStatus: 'scheduled', scheduledReleaseAt: delayedLetterReleaseAt(now) })
        .where(eq(letters.id, l.id));
      lettersScheduled++;
      continue;
    }
    try {
      await sendLetterDelivery({ to: l.recipientEmail, recipientName: l.recipientName, senderName, letterBody: l.body });
      await db.update(letters).set({ deliveryStatus: 'sent', releasedAt: now }).where(eq(letters.id, l.id));
      await db.insert(notificationLogs).values({ activationId, channel: 'email', type: 'letter', status: 'sent' });
      lettersSent++;
    } catch {
      await db.update(letters).set({ deliveryStatus: 'failed' }).where(eq(letters.id, l.id));
      await db.insert(notificationLogs).values({ activationId, channel: 'email', type: 'letter', status: 'failed' });
    }
  }

  // ── Notification contacts (phased) ──
  const contacts = await db.select().from(notificationContacts).where(eq(notificationContacts.accountId, accountId));
  let contactsNotified = 0, contactsScheduled = 0;
  for (const c of contacts) {
    const when = scheduledNotifyAt(c.notifyPhase, now); // null for 'manual'
    if (when === null) continue; // manual — family notifies by hand
    if (when.getTime() <= now.getTime()) {
      // Due now (phase offset 0)
      if (!c.email) continue;
      try {
        await sendActivationNotification({ to: c.email, contactName: c.name, deceasedName: senderName, activatedBy: 'the family' });
        await db.update(notificationContacts).set({ notified: true, notifiedAt: now, scheduledNotifyAt: when }).where(eq(notificationContacts.id, c.id));
        await db.insert(notificationLogs).values({ activationId, contactId: c.id, channel: 'email', type: 'notification', status: 'sent' });
        contactsNotified++;
      } catch {
        await db.insert(notificationLogs).values({ activationId, contactId: c.id, channel: 'email', type: 'notification', status: 'failed' });
      }
    } else {
      // Schedule for a later cron pass
      await db.update(notificationContacts).set({ scheduledNotifyAt: when }).where(eq(notificationContacts.id, c.id));
      if (c.email) contactsScheduled++;
    }
  }

  // ── Portal URL (only if published) ──
  let portalUrl: string | null = null;
  const [obit] = await db.select().from(obituary).where(eq(obituary.accountId, accountId)).limit(1);
  if (obit?.published && account.portalToken) {
    portalUrl = `${APP_URL}/portal/${account.portalToken}`;
  }

  // ── Confirmation email to the legacy contact ──
  const [contact] = await db.select().from(legacyContacts).where(eq(legacyContacts.id, triggeredByContactId)).limit(1);
  if (contact?.email) {
    sendActivationComplete({
      to: contact.email,
      contactName: contact.name,
      deceasedName: senderName,
      lettersSent, lettersScheduled, contactsNotified, contactsScheduled,
      portalUrl,
    }).catch(() => {});
  }
}
