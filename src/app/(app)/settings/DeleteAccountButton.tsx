'use client';

import { useState } from 'react';

export default function DeleteAccountButton() {
  const [state, setState] = useState<'idle' | 'confirming' | 'sending' | 'done' | 'error'>('idle');

  async function request() {
    setState('sending');
    const res = await fetch('/api/account/delete-request', { method: 'POST' });
    setState(res.ok ? 'done' : 'error');
  }

  if (state === 'done') {
    return (
      <p style={{ fontSize: '0.82rem', color: 'var(--mg-mid)', lineHeight: 1.6, marginTop: 4 }}>
        Your deletion request has been received. We&apos;ll process it within 48 hours and have emailed you a confirmation.
        Changed your mind? Just reply to that email.
      </p>
    );
  }

  if (state === 'confirming') {
    return (
      <div style={{ marginTop: 4 }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--mg-mid)', lineHeight: 1.6, marginBottom: 12 }}>
          This will request permanent deletion of your account and everything in it — vault, letters, wishes, and contacts.
          It cannot be undone once processed. Are you sure?
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={request} style={confirmBtn}>Yes, request deletion</button>
          <button onClick={() => setState('idle')} style={cancelBtn}>Keep my account</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 4 }}>
      <button onClick={() => setState('confirming')} disabled={state === 'sending'} style={dangerBtn}>
        {state === 'sending' ? 'Sending…' : 'Request account deletion'}
      </button>
      {state === 'error' && (
        <p style={{ fontSize: '0.8rem', color: '#c0392b', marginTop: 8 }}>
          Something went wrong. Please email support@mourninguide.com.
        </p>
      )}
    </div>
  );
}

const dangerBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: '#c0392b',
  fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', padding: 0,
};
const confirmBtn: React.CSSProperties = {
  background: '#c0392b', border: 'none', color: '#fff', borderRadius: 8,
  fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', padding: '9px 16px',
};
const cancelBtn: React.CSSProperties = {
  background: '#fff', border: '1.5px solid var(--mg-border-strong)', color: 'var(--mg-mid)',
  borderRadius: 8, fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer', padding: '9px 16px',
};
