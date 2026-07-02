import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { accountBilling } from '@/db/schema/billing';
import { accountMemberships } from '@/db/schema/memberships';
import { accountCollaborators } from '@/db/schema/collaborators';
import { getAccount, formatAccountLabel, getUserMemberships } from '@/lib/account';
import { isAdminEmail } from '@/lib/admin';
import AppShell from '@/components/AppShell';
import DeleteAccountButton from './DeleteAccountButton';
import MarketingOptInToggle from './MarketingOptInToggle';
import CollaboratorsClient from './CollaboratorsClient';

export const metadata = { title: 'Settings — Mourning Guide' };

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [account, user, memberships] = await Promise.all([
    getAccount(userId),
    currentUser(),
    getUserMemberships(userId),
  ]);
  if (!account) redirect('/onboarding');

  const { accounts: acct, membership } = account;
  const { label: planLabel, sublabel: planSublabel } = formatAccountLabel(
    acct.path,
    acct.planFor,
    acct.subjectName,
    membership.role,
  );
  const email = user?.emailAddresses?.[0]?.emailAddress ?? '—';
  const showAdmin = isAdminEmail(email);
  const isOwner = membership.role === 'owner';
  const isSharedAdmin = membership.role === 'admin';

  const collaborators = isOwner && acct.planFor === 'other'
    ? await db
        .select({
          id: accountCollaborators.id,
          name: accountCollaborators.name,
          email: accountCollaborators.email,
          status: accountCollaborators.status,
          inviteEmailedAt: accountCollaborators.inviteEmailedAt,
          acceptedAt: accountCollaborators.acceptedAt,
        })
        .from(accountCollaborators)
        .where(eq(accountCollaborators.accountId, acct.id))
        .orderBy(accountCollaborators.createdAt)
    : [];

  const ownedPlans = isOwner
    ? await db
        .select({
          accountId: accounts.id,
          path: accounts.path,
          planFor: accounts.planFor,
          subjectName: accounts.subjectName,
          planTier: accountBilling.planTier,
          trialEndsAt: accountBilling.trialEndsAt,
          stripeCustomerId: accountBilling.stripeCustomerId,
        })
        .from(accountMemberships)
        .innerJoin(accounts, eq(accounts.id, accountMemberships.accountId))
        .leftJoin(accountBilling, eq(accountBilling.accountId, accounts.id))
        .where(
          and(
            eq(accountMemberships.clerkUserId, userId),
            eq(accountMemberships.role, 'owner'),
          ),
        )
        .orderBy(accountMemberships.createdAt)
    : [];

  return (
    <AppShell title="Settings">
      <h1 className="page-heading">Settings</h1>

      {isOwner && (
        <div className="entry-card" style={{ marginBottom: 24, borderColor: 'rgba(197,123,87,0.28)' }}>
          <p className="section-label-lg" style={{ marginTop: 0 }}>Plans on this email</p>
          <p style={{ fontSize: '0.88rem', color: '#594b43', lineHeight: 1.6, margin: '0 0 16px' }}>
            Add a separate plan for a parent or loved one. You&apos;ll switch between plans from the <strong>Viewing</strong> menu at the top of the app.
          </p>
          <a
            href="/onboarding?path=planning&new=1"
            className="save-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 48,
              padding: '0 20px',
              textDecoration: 'none',
              width: 'auto',
            }}
          >
            + Add a plan for a parent or loved one
          </a>
        </div>
      )}

      {isSharedAdmin && (
        <div className="entry-card" style={{ marginBottom: 24, borderColor: 'rgba(46,107,66,0.25)', background: 'rgba(46,107,66,0.06)' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#2e6b42', lineHeight: 1.55 }}>
            You&apos;re helping manage this family plan. You can view and edit the vault, but billing and inviting relatives are handled by the plan owner.
          </p>
        </div>
      )}

      <p className="section-label-lg" style={{ marginTop: 0 }}>This plan</p>
      <div className="entry-card" style={{ marginBottom: 24 }}>
        <Row label="Plan" value={planLabel} />
        <Row label="For" value={planSublabel} />
        <Row label="Name on plan" value={acct.subjectName ?? '—'} />
        <Row label="Sign-in email" value={email} />
        <Row label="State" value={acct.usState ?? '—'} />
        <Row label="Path" value={acct.path === 'planning' ? 'Planning ahead' : 'Supporting a loss'} last={!(acct.planFor === 'other' && isOwner)} />
        {acct.planFor === 'other' && isOwner && (
          <>
            <Row label="Managed by" value={`You (${acct.proxyRelationship ?? 'family member'})`} />
            <Row
              label="Consent"
              value={
                acct.proxyConsentMethod === 'family_attestation'
                  ? 'Family attestation — no text required'
                  : acct.proxyConsentMethod === 'sms_pending'
                    ? 'Text confirmation optional (not required to start)'
                    : '—'
              }
              last
            />
          </>
        )}
        {isOwner && (
          <p style={{ margin: '14px 0 0', fontSize: '0.8rem', color: '#9a7a6a', lineHeight: 1.5 }}>
            Need another plan? Use the <strong>Plans on this email</strong> section above.
          </p>
        )}
        {memberships.length > 1 && (
          <p style={{ margin: '10px 0 0', fontSize: '0.8rem', color: '#9a7a6a', lineHeight: 1.5 }}>
            You have {memberships.length} plans on this email. Use the switcher at the top of the app to change which one you&apos;re viewing.
          </p>
        )}
      </div>

      {isOwner && acct.planFor === 'other' && (
        <div style={{ marginBottom: 24 }}>
          <CollaboratorsClient
            initialItems={collaborators}
            subjectName={acct.subjectName?.trim() || 'your loved one'}
          />
        </div>
      )}

      {isOwner && (
        <>
          <p className="section-label-lg">Billing</p>
          <p style={{ fontSize: '0.84rem', color: '#9a7a6a', margin: '0 0 12px', lineHeight: 1.55 }}>
            Each planning plan you own has its own $89/year subscription. The grief path is always free and separate — subscribing here is only for your planning vault.
          </p>
          <div className="entry-card" style={{ marginBottom: 24 }}>
            {ownedPlans.map((plan, i) => {
              const { label } = formatAccountLabel(plan.path, plan.planFor, plan.subjectName, 'owner');
              const tierLabel =
                plan.planTier === 'guide' ? 'Guide Plan ($89/year)' :
                plan.planTier === 'lapsed' ? 'Lapsed' : 'Free trial';
              const isActive = plan.accountId === acct.id;
              const trialEnded = plan.trialEndsAt && new Date(plan.trialEndsAt).getTime() < Date.now();
              const canSubscribe = plan.path === 'planning' && plan.planTier !== 'guide';
              const isLast = i === ownedPlans.length - 1;

              return (
                <div key={plan.accountId} className="list-row" style={isLast ? { borderBottom: 'none', paddingBottom: 0 } : undefined}>
                  <div>
                    <span className="list-row-label" style={{ display: 'block' }}>{label}{isActive ? ' · viewing now' : ''}</span>
                    <span className="list-row-value" style={{ display: 'block', marginTop: 4 }}>{tierLabel}</span>
                    {plan.path === 'planning' && plan.planTier === 'free' && plan.trialEndsAt && !trialEnded && (
                      <span style={{ display: 'block', fontSize: '0.78rem', color: '#9a7a6a', marginTop: 4 }}>
                        Trial ends {new Date(plan.trialEndsAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                    {canSubscribe && (
                      <a href={`/api/checkout?accountId=${plan.accountId}`} style={{ display: 'inline-block', marginTop: 8, color: '#c57b57', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'none' }}>
                        {trialEnded ? 'Subscribe to Guide Plan — $89/year →' : 'Subscribe early — $89/year →'}
                      </a>
                    )}
                    {plan.stripeCustomerId && (
                      <a href={`/api/billing-portal?accountId=${plan.accountId}`} style={{ display: 'inline-block', marginTop: 8, marginLeft: canSubscribe ? 12 : 0, color: '#594b43', fontSize: '0.84rem', fontWeight: 600, textDecoration: 'none' }}>
                        Manage subscription →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <p className="section-label-lg">Communications</p>
      <div className="entry-card" style={{ marginBottom: 24 }}>
        <MarketingOptInToggle initial={acct.marketingOptIn} />
      </div>

      {showAdmin && (
        <>
          <p className="section-label-lg">Staff</p>
          <div className="entry-card" style={{ marginBottom: 24 }}>
            <a href="/staff" className="list-card" style={{ marginTop: 0 }}>
              <strong>Admin dashboard</strong>
              <p>Customers, metrics, reviews, and marketing email exports.</p>
            </a>
          </div>
        </>
      )}

      <p className="section-label-lg">Account actions</p>
      <div className="entry-card">
        <SignOutButton>
          <button style={{ background: 'none', border: 'none', color: '#c57b57', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
            Sign out
          </button>
        </SignOutButton>
        {isOwner && (
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(145,104,82,0.1)' }}>
            <DeleteAccountButton />
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className="list-row" style={last ? { borderBottom: 'none', paddingBottom: 0 } : undefined}>
      <span className="list-row-label">{label}</span>
      <span className="list-row-value">{value}</span>
    </div>
  );
}
