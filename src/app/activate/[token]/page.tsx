'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

type Status = 'active' | 'activation_pending' | 'activated';
type View = 'loading' | 'ready' | 'pending' | 'confirming' | 'cancelling' | 'cancelled' | 'activated' | 'error' | 'deleting' | 'deleted';

export default function ActivatePage() {
  const { token } = useParams<{ token: string }>();
  const [view, setView] = useState<View>('loading');
  const [contactName, setContactName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [lettersCount, setLettersCount] = useState(0);
  const [lettersWithoutEmail, setLettersWithoutEmail] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);
  const [cancelWindowHours, setCancelWindowHours] = useState(24);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    fetch(`/api/activate/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setErrorMsg(data.error); setView('error'); return; }
        setContactName(data.contactName);
        setSubjectName(data.subjectName);
        setLettersCount(data.lettersCount ?? 0);
        setLettersWithoutEmail(data.lettersWithoutEmail ?? 0);
        setContactsCount(data.contactsCount ?? 0);
        setCancelWindowHours(data.cancelWindowHours ?? 24);
        const status = data.status as Status;
        setView(status === 'activated' ? 'activated' : status === 'activation_pending' ? 'pending' : 'ready');
      })
      .catch(() => { setErrorMsg('Something went wrong. Please try again.'); setView('error'); });
  }, [token]);

  async function beginActivation() {
    setView('confirming');
    const res = await fetch(`/api/activate/${token}`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) { setErrorMsg(data.error ?? 'Something went wrong.'); setView('error'); return; }
    if (data.status === 'activated') { setView('activated'); return; }
    if (data.lettersCount != null) setLettersCount(data.lettersCount);
    if (data.contactsCount != null) setContactsCount(data.contactsCount);
    if (data.cancelWindowHours) setCancelWindowHours(data.cancelWindowHours);
    setView('pending');
  }

  async function cancelActivation() {
    setView('cancelling');
    const res = await fetch(`/api/activate/${token}/cancel`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      setErrorMsg(data.tooLate
        ? 'The cancel window has already closed, so the guide has been activated. Please contact support@mourninguide.com if this was a mistake.'
        : (data.error ?? 'Something went wrong.'));
      setView('error');
      return;
    }
    setView('cancelled');
  }

  async function deleteAccount() {
    setView('deleting');
    const res = await fetch(`/api/activate/${token}/delete`, { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { setErrorMsg(data.error ?? 'Something went wrong.'); setView('error'); return; }
    setView('deleted');
  }

  return (
    <div style={wrap}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/mg-icon.svg" alt="Mourning Guide" width={56} height={56}
            style={{ borderRadius: 10, display: 'block', margin: '0 auto 16px' }} />
        </div>

        <div style={card}>
          <div style={{ height: 3, background: 'linear-gradient(90deg,#c57b57,#d4956f)' }} />
          <div style={{ padding: '40px 36px 44px' }}>

            {view === 'loading' && <p style={muted}>Loading…</p>}

            {view === 'error' && (
              <>
                <h1 style={h1}>Something went wrong</h1>
                <p style={para}>{errorMsg}</p>
                <p style={{ ...small, marginTop: 16 }}>
                  If you believe this is an error, contact{' '}
                  <a href="mailto:support@mourninguide.com" style={link}>support@mourninguide.com</a>.
                </p>
              </>
            )}

            {view === 'activated' && (
              <>
                <h1 style={h1}>This guide has been activated</h1>
                <p style={para}>
                  {subjectName ? `${subjectName}'s` : 'This'} guide is active. Letters have been released and family has been notified.
                </p>
                <p style={{ ...small, marginBottom: 24 }}>
                  Questions? Contact{' '}
                  <a href="mailto:support@mourninguide.com" style={link}>support@mourninguide.com</a>.
                </p>

                <div style={{ borderTop: '1px solid #e8dfd6', paddingTop: 20 }}>
                  {!confirmDelete ? (
                    <button onClick={() => setConfirmDelete(true)}
                      style={{ background: 'none', border: 'none', color: '#b06a52', fontSize: '0.85rem', cursor: 'pointer', padding: 0, fontFamily: 'Georgia, serif', textDecoration: 'underline' }}>
                      Permanently delete {subjectName ? `${subjectName}'s` : 'this'} guide
                    </button>
                  ) : (
                    <div>
                      <p style={{ ...small, marginBottom: 14 }}>
                        This permanently erases everything {subjectName || 'they'} stored — letters, wishes, finances,
                        the memorial page, and any letters not yet delivered. This cannot be undone.
                      </p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button onClick={deleteAccount}
                          style={{ background: '#b0402e', border: 'none', color: '#fff', borderRadius: 10, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: '11px 18px', fontFamily: 'Georgia, serif' }}>
                          Yes, delete permanently
                        </button>
                        <button onClick={() => setConfirmDelete(false)}
                          style={{ ...secondaryBtn, width: 'auto', padding: '11px 18px' }}>
                          Keep it
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {view === 'deleting' && <p style={muted}>Deleting…</p>}

            {view === 'deleted' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🕊️</div>
                  <h1 style={h1}>Everything has been deleted</h1>
                </div>
                <p style={para}>
                  {subjectName ? `${subjectName}'s` : 'The'} guide and all of its contents have been permanently removed.
                  Thank you for the care you gave to this.
                </p>
              </>
            )}

            {view === 'cancelled' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🌿</div>
                  <h1 style={h1}>Activation cancelled</h1>
                </div>
                <p style={para}>
                  Nothing was sent. {subjectName ? `${subjectName}'s` : 'The'} guide remains exactly as it was.
                  You can return to this page any time.
                </p>
              </>
            )}

            {view === 'ready' && (
              <>
                <p style={eyebrow}>Legacy Contact</p>
                <h1 style={h1}>Dear {contactName},</h1>
                <p style={para}>
                  You&apos;ve been named the legacy contact for{' '}
                  <strong style={{ color: '#2f241f' }}>{subjectName || 'your loved one'}</strong>.
                  Activating begins the release of everything they prepared.
                </p>
                <div style={box}>
                  <p style={boxHead}>When you activate, we will reach out to people — after a {cancelWindowHours}-hour wait:</p>
                  <ul style={ul}>
                    <li>Deliver {lettersCount} personal {lettersCount === 1 ? 'letter' : 'letters'}</li>
                    <li>Notify {contactsCount} {contactsCount === 1 ? 'person' : 'people'}, gently and in order</li>
                  </ul>
                  {lettersWithoutEmail > 0 && (
                    <p style={{ margin: '12px 0 0', fontSize: '0.8rem', color: '#a06a52' }}>
                      Note: {lettersWithoutEmail} {lettersWithoutEmail === 1 ? 'letter has' : 'letters have'} no email
                      and can&apos;t be delivered automatically.
                    </p>
                  )}
                </div>
                <p style={{ ...small, marginBottom: 24 }}>
                  The {cancelWindowHours}-hour wait is only about contacting people — it gives you time to cancel if this
                  was a mistake, before any letter or notification is sent. Everything {subjectName || 'your loved one'} prepared
                  is available to you right away. Please only activate when {subjectName ? `${subjectName} has` : 'they have'} passed away.
                </p>
                <button onClick={beginActivation} style={primaryBtn}>
                  Activate {subjectName ? `${subjectName}'s` : 'the'} guide
                </button>
              </>
            )}

            {view === 'confirming' && <p style={muted}>Starting activation…</p>}
            {view === 'cancelling' && <p style={muted}>Cancelling…</p>}

            {view === 'pending' && (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>🕯️</div>
                  <h1 style={h1}>Activation started</h1>
                </div>
                <p style={para}>
                  We won&apos;t contact anyone for <strong style={{ color: '#2f241f' }}>{cancelWindowHours} hours</strong>.
                  No letters or notifications have been sent. When the wait ends, {subjectName ? `${subjectName}'s` : 'the'} letters and
                  notifications will begin going out — gently, in order.
                </p>
                <div style={box}>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#6b5c55', lineHeight: 1.7 }}>
                    This wait only delays reaching out to people — it doesn&apos;t hold anything back from you.
                    We&apos;ve emailed you a copy of this with a cancel link. If {subjectName || 'your loved one'} is
                    still with us, please cancel now — nothing will ever be sent.
                  </p>
                </div>
                <button onClick={cancelActivation} style={secondaryBtn}>
                  Cancel this activation
                </button>
                <p style={{ ...small, marginTop: 16, textAlign: 'center' }}>
                  Need help? <a href="mailto:support@mourninguide.com" style={link}>support@mourninguide.com</a>
                </p>
              </>
            )}

          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.76rem', color: '#b8a89e' }}>
          <a href="https://mourninguide.com" style={{ color: '#b8a89e', textDecoration: 'none' }}>mourninguide.com</a>
          {' · '}
          <a href="mailto:support@mourninguide.com" style={{ color: '#b8a89e', textDecoration: 'none' }}>support@mourninguide.com</a>
        </p>
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  minHeight: '100vh',
  background: 'radial-gradient(circle at 72% 8%,rgba(203,183,162,0.18),transparent 28%),linear-gradient(180deg,#fffaf4,#f5eadf)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
  fontFamily: "var(--serif, 'Iowan Old Style', Georgia, serif)",
};
const card: React.CSSProperties = { background: 'rgba(255,250,244,0.94)', borderRadius: 26, border: '1px solid rgba(142,95,70,0.2)', overflow: 'hidden', boxShadow: '0 20px 46px rgba(67,46,33,0.1)' };
const h1: React.CSSProperties = { fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.5rem', color: '#2f241f', marginBottom: 16, lineHeight: 1.25 };
const para: React.CSSProperties = { color: '#594b43', lineHeight: 1.75, fontSize: '0.97rem', marginBottom: 20, fontFamily: 'var(--sans)' };
const muted: React.CSSProperties = { color: '#9a7a6a', textAlign: 'center', lineHeight: 1.7, fontFamily: 'var(--sans)' };
const small: React.CSSProperties = { color: '#9a7a6a', fontSize: '0.84rem', lineHeight: 1.7, fontFamily: 'var(--sans)' };
const eyebrow: React.CSSProperties = { margin: '0 0 6px', fontSize: '0.75rem', color: '#c86d49', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 800, fontFamily: 'var(--sans)' };
const box: React.CSSProperties = { background: 'rgba(255,255,255,0.75)', borderRadius: 16, border: '1px solid rgba(145,104,82,0.16)', padding: '20px 18px', marginBottom: 24 };
const boxHead: React.CSSProperties = { margin: '0 0 10px', fontWeight: 700, color: '#2f241f', fontSize: '0.92rem', fontFamily: 'var(--sans)' };
const ul: React.CSSProperties = { margin: 0, paddingLeft: 20, color: '#594b43', fontSize: '0.88rem', lineHeight: 2, fontFamily: 'var(--sans)' };
const link: React.CSSProperties = { color: '#c57b57', textDecoration: 'none' };
const primaryBtn: React.CSSProperties = {
  display: 'block', width: '100%', minHeight: 52, padding: '14px', background: 'linear-gradient(180deg,#d88963,#c57b57)', color: '#fff',
  border: 'none', borderRadius: 14, fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
  fontFamily: 'var(--serif)', letterSpacing: '0.01em', boxShadow: '0 12px 26px rgba(197,123,87,0.28)',
};
const secondaryBtn: React.CSSProperties = {
  display: 'block', width: '100%', minHeight: 48, padding: '13px', background: '#fff', color: '#9a7a6a',
  border: '1.5px solid rgba(145,104,82,0.24)', borderRadius: 14, fontSize: '0.95rem', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--serif)',
};
