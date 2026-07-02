'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

const PAGE_BG = 'radial-gradient(circle at 72% 8%,rgba(203,183,162,0.18),transparent 28%),linear-gradient(180deg,#fffaf4,#f5eadf)';
const serif = 'var(--serif)';

export default function InviteAcceptClient({
  token,
  inviteeName,
  inviteeEmail,
  subjectName,
}: {
  token: string;
  inviteeName: string;
  inviteeEmail: string;
  subjectName: string;
}) {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const first = subjectName.split(' ')[0];
  const signInUrl = `/sign-in?redirect_url=${encodeURIComponent(`/invite/${token}`)}`;
  const signUpUrl = `/sign-up?redirect_url=${encodeURIComponent(`/invite/${token}`)}`;

  async function accept() {
    setLoading(true);
    setError('');
    const res = await fetch(`/api/invite/${token}/accept`, { method: 'POST' });
    if (res.ok) {
      router.push('/dashboard');
      return;
    }
    const data = await res.json().catch(() => ({}));
    setError(data.error ?? 'Could not accept invitation.');
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', background: PAGE_BG }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 40 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mg-icon.svg" alt="" style={{ height: 44 }} />
        <span style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 500, color: '#2C1C0E' }}>Mourning Guide</span>
      </Link>

      <div style={{ width: 'min(100%,520px)', padding: 32, border: '1px solid rgba(142,95,70,0.2)', borderRadius: 26, background: 'linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,250,244,0.94))', boxShadow: '0 20px 46px rgba(67,46,33,0.1)' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c86d49', margin: '0 0 12px' }}>
          Family invitation
        </p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(1.8rem,4vw,2.4rem)', fontWeight: 500, lineHeight: 1.1, margin: '0 0 16px', color: '#2f241f' }}>
          Help manage {first}&apos;s plan
        </h1>
        <p style={{ fontSize: '1rem', color: '#594b43', lineHeight: 1.7, margin: '0 0 20px' }}>
          Hi {inviteeName.split(' ')[0]} — you&apos;ve been invited to help build and update <strong>{subjectName}</strong>&apos;s Mourning Guide. You&apos;ll only see this shared family plan, not anyone else&apos;s personal plans.
        </p>
        <p style={{ fontSize: '0.88rem', color: '#7a5341', lineHeight: 1.6, margin: '0 0 24px' }}>
          Accept with <strong>{inviteeEmail}</strong>
        </p>

        {!isSignedIn ? (
          <div style={{ display: 'grid', gap: 12 }}>
            <Link href={signUpUrl} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 52, borderRadius: 14, background: 'linear-gradient(180deg,#d88963,#c57b57)', color: '#fff', fontFamily: serif, fontSize: '1.02rem', fontWeight: 500, textDecoration: 'none' }}>
              Create account to accept
            </Link>
            <Link href={signInUrl} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 48, color: '#c57b57', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}>
              Already have an account? Sign in
            </Link>
          </div>
        ) : (
          <>
            {error && <p style={{ color: '#b0402e', fontSize: '0.85rem', margin: '0 0 12px' }}>{error}</p>}
            <button
              type="button"
              onClick={accept}
              disabled={loading}
              style={{
                width: '100%', minHeight: 52, border: 'none', borderRadius: 14, cursor: 'pointer',
                background: 'linear-gradient(180deg,#d88963,#c57b57)', color: '#fff',
                fontFamily: serif, fontSize: '1.02rem', fontWeight: 500,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Accepting…' : 'Accept invitation →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
