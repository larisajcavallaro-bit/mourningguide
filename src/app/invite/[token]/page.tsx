import { notFound } from 'next/navigation';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountCollaborators } from '@/db/schema/collaborators';
import { eq } from 'drizzle-orm';
import InviteAcceptClient from './InviteAcceptClient';

export const metadata = { title: 'Accept invitation — Mourning Guide' };

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const rows = await db
    .select({
      inviteeName: accountCollaborators.name,
      inviteeEmail: accountCollaborators.email,
      status: accountCollaborators.status,
      subjectName: accounts.subjectName,
    })
    .from(accountCollaborators)
    .innerJoin(accounts, eq(accounts.id, accountCollaborators.accountId))
    .where(eq(accountCollaborators.inviteToken, token))
    .limit(1);

  const row = rows[0];
  if (!row) notFound();
  if (row.status === 'active') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: '#f5eadf' }}>
        <p style={{ fontFamily: 'var(--serif)', color: '#594b43' }}>This invitation has already been accepted. <a href="/dashboard" style={{ color: '#c57b57' }}>Go to dashboard</a></p>
      </div>
    );
  }

  return (
    <InviteAcceptClient
      token={token}
      inviteeName={row.inviteeName}
      inviteeEmail={row.inviteeEmail}
      subjectName={row.subjectName?.trim() || 'your loved one'}
    />
  );
}
