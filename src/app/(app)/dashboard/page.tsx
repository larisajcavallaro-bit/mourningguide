import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAccount } from '@/lib/account';
import { db } from '@/db';
import { accountBilling } from '@/db/schema/billing';
import { eq } from 'drizzle-orm';
import { sendTrialExpiryEmail } from '@/lib/emails';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = { title: 'Dashboard — Mourning Guide' };

function icon(path: ReactNode) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
  );
}

const PLANNING_TILES = [
  { href: '/vault', label: 'Add to your plan', sub: '16 areas to fill in', icon: icon(<><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h6M8 17h4"/></>) },
  { href: '/vault/letters', label: 'Write a letter', sub: 'To a loved one', icon: icon(<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>) },
  { href: '/people/successors', label: 'Set up legacy contacts', sub: 'Who gets access', icon: icon(<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>) },
  { href: '/portal', label: 'Customize portal', sub: 'What your family sees', icon: icon(<><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>) },
];

function trialDaysLeft(trialEndsAt: Date | string | null): number | null {
  if (!trialEndsAt) return null;
  const ms = new Date(trialEndsAt).getTime() - Date.now();
  return ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ upgraded?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const [{ upgraded }, account, user] = await Promise.all([
    searchParams,
    getAccount(userId!),
    currentUser(),
  ]);

  if (!account) redirect('/onboarding');

  const { accounts: acct, account_billing: billing, membership } = account;
  const isPlanning = acct.path === 'planning';
  const isCollaborator = membership.role === 'admin';
  const firstName = user?.firstName ?? acct.subjectName?.split(' ')[0] ?? 'there';
  const isPaid = billing?.planTier === 'guide';
  const daysLeft = isPlanning && !isPaid && !isCollaborator ? trialDaysLeft(billing?.trialEndsAt ?? null) : null;
  const trialExpired = daysLeft !== null && daysLeft <= 0;

  // Fire trial expiry email once when trial just expired (owner only)
  if (!isCollaborator && trialExpired && billing && !billing.trialExpiryEmailedAt) {
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (email) {
      sendTrialExpiryEmail({ to: email, firstName }).catch(() => {});
      db.update(accountBilling)
        .set({ trialExpiryEmailedAt: new Date(), updatedAt: new Date() })
        .where(eq(accountBilling.accountId, acct.id))
        .catch(() => {});
    }
  }

  const meta = isCollaborator
    ? 'Shared family plan'
    : isPaid
      ? 'Guide Plan · Active'
      : daysLeft !== null && !trialExpired
        ? `Free trial · ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`
        : undefined;

  return (
    <AppShell active="home" meta={meta}>
      <p className="eyebrow" style={{ marginBottom: 4 }}>Welcome back{isPlanning ? '' : ''}</p>
      <h1 className="page-heading" data-walkthrough="walkthrough-dashboard-heading">
        {isPlanning ? `Your family's guide, ${firstName}` : `Here for you, ${firstName}`}
      </h1>

      <div className="app-install-card">
        <div>
          <strong>Use Mourning Guide like an app on your phone.</strong>
          <p>No app store download and no app fee. Add it to your home screen and it opens like a regular app.</p>
        </div>
        <div className="app-install-steps">
          <div className="app-install-step">
            <span>iPhone</span>
            Tap the three dots, then Share, then Add to Home Screen.
          </div>
          <div className="app-install-step">
            <span>Android</span>
            Tap the three dots, then Add to Home screen.
          </div>
        </div>
      </div>

      {/* Banners */}
      {isCollaborator && (
        <div className="app-banner trial">
          <strong>You&apos;re helping manage this family plan.</strong> Billing is handled by the person who set it up — you won&apos;t be charged.
        </div>
      )}
      {upgraded === '1' && (
        <div className="app-banner success">
          <strong>You&apos;re all set — welcome to Guide Plan.</strong> Your vault and family portal are unlocked for the year.
        </div>
      )}
      {isPlanning && !isCollaborator && !isPaid && daysLeft !== null && !trialExpired && upgraded !== '1' && (
        <div className="app-banner trial">
          <strong>{daysLeft} {daysLeft === 1 ? 'day' : 'days'} left in your free trial.</strong> $89/year after · No card needed today.
        </div>
      )}
      {isPlanning && !isCollaborator && !isPaid && trialExpired && (
        <div className="app-banner warn">
          <strong>Your free trial has ended.</strong> Subscribe to Guide Plan to keep this planning vault active.{' '}
          <a href="/api/checkout" style={{ color: '#a5342a', fontWeight: 700 }}>Subscribe — $89/year →</a>
        </div>
      )}

      {isPlanning ? (
        <>
          {/* Progress */}
          <div className="progress-card">
            <div className="ring-wrap">
              <svg width="64" height="64" viewBox="0 0 52 52">
                <circle className="ring-track" cx="26" cy="26" r="22" />
                <circle className="ring-fill" cx="26" cy="26" r="22" style={{ strokeDashoffset: 138.2 }} />
                <text className="ring-text" x="26" y="27">0%</text>
              </svg>
            </div>
            <div className="progress-text" style={{ flex: 1 }}>
              <h2>Nothing added yet</h2>
              <p>Start anywhere — all 16 areas are optional and none are urgent. Add one thing today and your family already has more than they did yesterday.</p>
              <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: '0%' }} /></div>
            </div>
          </div>

          <div className="start-nudge-card">
            <p className="start-nudge-eyebrow">Where to start</p>
            <p className="start-nudge-copy">Most people add their legacy contacts first — they&apos;re the people who&apos;ll activate your plan when the time comes.</p>
            <Link href="/people/successors" className="start-nudge-link">Add legacy contacts →</Link>
          </div>

          {/* Quick actions */}
          <p className="section-label-lg" data-walkthrough="walkthrough-quick-actions">Quick actions</p>
          <div className="quick-grid">
            {PLANNING_TILES.map(t => {
              const inner = (
                <>
                  <div className="quick-tile-icon">{t.icon}</div>
                  <div className="quick-tile-text"><strong>{t.label}</strong><span>{t.sub}</span></div>
                </>
              );
              return t.href
                ? <Link key={t.label} className="quick-tile" href={t.href}>{inner}</Link>
                : <div key={t.label} className="quick-tile disabled">{inner}</div>;
            })}
          </div>

          {/* Status */}
          <p className="section-label-lg">Status</p>
          <div className="status-card">
            {[
              ['Planning areas', '0 of 16 complete'],
              ['Legacy contacts', 'No one added yet'],
              ['Memorial portal', 'Not published'],
              ['Letters to loved ones', 'None written yet'],
            ].map(([t, d], i) => (
              <div className="status-row" key={i}>
                <div className="status-dot pending" />
                <div className="status-row-text">{t}<div className="status-row-sub">{d}</div></div>
                <span className="status-chip chip-open">not started</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="app-banner trial"><strong>Grief support is always free.</strong> We&apos;re building your guided next steps — here&apos;s what&apos;s coming.</div>
          <p className="section-label-lg">Your guide</p>
          <div className="quick-grid">
            {['Tasks — what to do and when', 'People — who to notify', 'Finances — accounts and bills', 'Memorial portal', 'Remember — photos & stories', 'Shared calendar'].map(label => (
              <div key={label} className="quick-tile disabled">
                <div className="quick-tile-icon">{icon(<circle cx="12" cy="12" r="9" />)}</div>
                <div className="quick-tile-text"><strong>{label.split(' — ')[0]}</strong><span>{label.split(' — ')[1] ?? 'Coming soon'}</span></div>
              </div>
            ))}
          </div>
        </>
      )}

      <p style={{ textAlign: 'center', marginTop: 24 }} data-walkthrough="walkthrough-settings-link">
        <Link href="/settings" style={{ fontSize: '0.8rem', color: '#9a7a6a', textDecoration: 'none' }}>Settings</Link>
      </p>
    </AppShell>
  );
}
