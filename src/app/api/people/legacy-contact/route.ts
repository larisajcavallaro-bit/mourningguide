import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { legacyContacts } from '@/db/schema/people';
import { eq } from 'drizzle-orm';
import { sendLegacyContactInvitation } from '@/lib/emails';

async function getAccountId(userId: string) {
  const rows = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.clerkUserId, userId)).limit(1);
  return rows[0]?.id ?? null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const rows = await db.select().from(legacyContacts)
    .where(eq(legacyContacts.accountId, accountId)).limit(1);
  return NextResponse.json({ item: rows[0] ?? null });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const accountId = await getAccountId(userId);
  if (!accountId) return NextResponse.json({ error: 'No account' }, { status: 400 });

  const body = await req.json();
  const { name, email, phone } = body;
  if (!name?.trim()) return NextResponse.json({ error: 'name required' }, { status: 400 });

  // Upsert: delete existing then insert
  await db.delete(legacyContacts).where(eq(legacyContacts.accountId, accountId));
  const [row] = await db.insert(legacyContacts).values({
    accountId, name: name.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
  }).returning();

  // Send invitation email to the legacy contact if they have an email
  if (row.email) {
    const user = await currentUser();
    const ownerName = user?.firstName
      ? `${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`
      : 'Someone';
    sendLegacyContactInvitation({
      to: row.email,
      contactName: row.name,
      ownerName,
    }).catch(() => {});
  }

  return NextResponse.json({ item: row });
}
