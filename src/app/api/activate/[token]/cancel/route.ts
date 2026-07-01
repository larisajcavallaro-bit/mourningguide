import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts } from '@/db/schema/people';
import { activations } from '@/db/schema/activation';
import { eq, and } from 'drizzle-orm';

// POST — cancel a pending activation while still inside the cancel window.
// Nothing has been sent yet, so this fully reverses the activation.
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const contactRows = await db.select({ accountId: legacyContacts.accountId })
    .from(legacyContacts)
    .where(eq(legacyContacts.activationToken, token))
    .limit(1);
  if (!contactRows[0]) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  const accountId = contactRows[0].accountId;

  const actRows = await db.select().from(activations)
    .where(and(eq(activations.accountId, accountId), eq(activations.status, 'pending')))
    .limit(1);

  if (!actRows[0]) {
    return NextResponse.json({ error: 'No pending activation to cancel' }, { status: 400 });
  }

  const act = actRows[0];

  // If the window already closed, it's too late — the cron may have processed it
  if (act.cancelWindowExpiresAt && act.cancelWindowExpiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'The cancel window has closed', tooLate: true }, { status: 409 });
  }

  await db.update(activations)
    .set({ status: 'cancelled', cancelledAt: new Date() })
    .where(eq(activations.id, act.id));

  await db.update(accounts)
    .set({ activationStatus: 'active', updatedAt: new Date() })
    .where(eq(accounts.id, accountId));

  return NextResponse.json({ success: true });
}
