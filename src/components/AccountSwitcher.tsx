'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Membership = {
  accountId: string;
  label: string;
  sublabel: string;
  path: 'planning' | 'grief';
  planFor: 'self' | 'other';
};

export default function AccountSwitcher({ activeAccountId }: { activeAccountId: string }) {
  const router = useRouter();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [switching, setSwitching] = useState(false);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/account/list');
    if (!res.ok) return;
    const data = await res.json();
    setMemberships(data.memberships ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (memberships.length === 0) return null;

  const active = memberships.find((m) => m.accountId === activeAccountId) ?? memberships[0];

  async function switchTo(accountId: string) {
    if (accountId === activeAccountId || switching) return;
    setSwitching(true);
    const res = await fetch('/api/account/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId }),
    });
    setSwitching(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={switching}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
          background: 'rgba(255,255,255,0.55)',
          border: '1px solid rgba(145,104,82,0.18)',
          borderRadius: 12,
          padding: '8px 12px',
          cursor: 'pointer',
          maxWidth: 200,
        }}
      >
        <span style={{ fontSize: '0.72rem', color: '#9a7a6a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Viewing
        </span>
        <span style={{ fontSize: '0.86rem', color: '#2f241f', fontWeight: 600, lineHeight: 1.2 }}>
          {active?.label ?? 'My plan'}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'default',
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              minWidth: 240,
              background: '#fffaf4',
              border: '1px solid rgba(145,104,82,0.2)',
              borderRadius: 14,
              boxShadow: '0 16px 40px rgba(67,46,33,0.14)',
              zIndex: 50,
              overflow: 'hidden',
            }}
          >
            <p style={{ margin: 0, padding: '12px 14px 8px', fontSize: '0.72rem', fontWeight: 700, color: '#9a7a6a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Switch plan
            </p>
            {memberships.map((m) => (
              <button
                key={m.accountId}
                type="button"
                onClick={() => switchTo(m.accountId)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '12px 14px',
                  border: 'none',
                  borderTop: '1px solid rgba(145,104,82,0.08)',
                  background: m.accountId === activeAccountId ? 'rgba(197,123,87,0.08)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#2f241f' }}>{m.label}</span>
                <span style={{ display: 'block', fontSize: '0.78rem', color: '#9a7a6a', marginTop: 2 }}>{m.sublabel}</span>
              </button>
            ))}
            <a
              href="/onboarding?path=planning&new=1"
              style={{
                display: 'block',
                padding: '12px 14px',
                borderTop: '1px solid rgba(145,104,82,0.12)',
                fontSize: '0.84rem',
                fontWeight: 600,
                color: '#c57b57',
                textDecoration: 'none',
              }}
            >
              + Add another plan
            </a>
          </div>
        </>
      )}
    </div>
  );
}
