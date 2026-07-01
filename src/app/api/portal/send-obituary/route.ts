import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { obituary } from '@/db/schema/vault';
import { legacyContacts } from '@/db/schema/people';
import { eq } from 'drizzle-orm';
import { sendFuneralHomeObituary } from '@/lib/emails';

async function getAccountId(userId: string) {
  const rows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const body = await req.json();
  const { funeralHomeEmail } = body;
  if (!funeralHomeEmail?.trim()) {
    return NextResponse.json({ error: 'funeralHomeEmail required' }, { status: 400 });
  }

  const [obitRows, legacyRows, user] = await Promise.all([
    db.select().from(obituary).where(eq(obituary.accountId, accountId)).limit(1),
    db.select({ name: legacyContacts.name, email: legacyContacts.email })
      .from(legacyContacts).where(eq(legacyContacts.accountId, accountId))
      .orderBy(legacyContacts.createdAt).limit(1),
    currentUser(),
  ]);
  const obit = obitRows[0];
  const legacy = legacyRows[0] ?? null;

  if (!obit || !obit.name) {
    return NextResponse.json({ error: 'No obituary found. Please save your portal first.' }, { status: 400 });
  }

  const senderName = user?.firstName
    ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
    : obit.name;

  await sendFuneralHomeObituary({
    to: funeralHomeEmail.trim(),
    senderName,
    deceasedName: obit.name,
    born: obit.born ?? null,
    died: obit.died ?? null,
    city: obit.city ?? null,
    survived: obit.survived ?? null,
    predeceased: obit.predeceased ?? null,
    body: obit.body ?? null,
    legacyContactName: legacy?.name ?? null,
    legacyContactEmail: legacy?.email ?? null,
  });

  return NextResponse.json({ success: true });
}
