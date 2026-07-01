'use client';

import { useState } from 'react';

export default function MarketingOptInToggle({ initial }: { initial: boolean }) {
  const [optIn, setOptIn] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function toggle() {
    const next = !optIn;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/account/marketing-opt-in', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketingOptIn: next }),
      });
      if (!res.ok) throw new Error('Save failed');
      setOptIn(next);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // revert on failure
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="list-row" style={{ borderBottom: 'none', paddingBottom: 0, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, paddingRight: 16 }}>
        <span className="list-row-label" style={{ display: 'block', marginBottom: 4 }}>Product updates</span>
        <span style={{ fontSize: '0.8rem', color: '#9a7a6a', lineHeight: 1.5 }}>
          Occasional emails about new features and account improvements. We never sell your email.{' '}
          <a href="/unsubscribe" style={{ color: '#c57b57', fontWeight: 600, textDecoration: 'none' }}>Unsubscribe</a>
        </span>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={saving}
        style={{
          background: optIn ? 'rgba(197,123,87,0.14)' : 'rgba(52,38,31,0.07)',
          border: '1px solid rgba(145,104,82,0.18)',
          borderRadius: 999,
          padding: '6px 12px',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: optIn ? '#c57b57' : '#9a7a6a',
          cursor: saving ? 'wait' : 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {saving ? 'Saving…' : saved ? 'Saved' : optIn ? 'Opted in' : 'Opted out'}
      </button>
    </div>
  );
}
