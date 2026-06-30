'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

type Path = 'planning' | 'grief';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<'path' | 'details'>('path');
  const [path, setPath] = useState<Path | null>(null);
  const [name, setName] = useState('');
  const [usState, setUsState] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function choosePath(p: Path) {
    setPath(p);
    setStep('details');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!path) return;
    setLoading(true);
    setError('');

    const body = path === 'planning'
      ? { path, subjectName: name, usState }
      : { path, subjectName: name, relationship };

    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    // Always go straight to dashboard — trial starts now, payment prompted when it expires
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--mg-bg)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '1.6rem',
            color: 'var(--mg-dark)',
            fontWeight: 600,
          }}>Mourning Guide</h1>
          <p style={{ color: 'var(--mg-light)', fontSize: '0.9rem', marginTop: 4 }}>
            The kindest thing you can do for the people you love.
          </p>
        </div>

        {step === 'path' && (
          <div>
            <h2 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: '1.4rem',
              color: 'var(--mg-dark)',
              marginBottom: 8,
              textAlign: 'center',
            }}>What brings you here today?</h2>
            <p style={{ color: 'var(--mg-light)', textAlign: 'center', marginBottom: 28, fontSize: '0.9rem' }}>
              You can always switch later.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <button onClick={() => choosePath('planning')} style={cardStyle}>
                <span style={cardTitle}>I want to plan ahead</span>
                <span style={cardSub}>Organize your finances, wishes, and letters so your family never has to guess.</span>
              </button>
              <button onClick={() => choosePath('grief')} style={cardStyle}>
                <span style={cardTitle}>I'm supporting a loss</span>
                <span style={cardSub}>Get organized after losing someone — tasks, people, and next steps in one place.</span>
              </button>
            </div>
          </div>
        )}

        {step === 'details' && path === 'planning' && (
          <form onSubmit={submit}>
            <button type="button" onClick={() => setStep('path')} style={backStyle}>← Back</button>
            <h2 style={headingStyle}>Let's get started</h2>
            <p style={{ color: 'var(--mg-light)', marginBottom: 24, fontSize: '0.9rem' }}>
              We'll build your guide around you.
            </p>
            <label style={labelStyle}>Your full name</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Margaret Chen"
              required style={inputStyle}
            />
            <label style={labelStyle}>State of residence</label>
            <select
              value={usState} onChange={e => setUsState(e.target.value)}
              required style={inputStyle}
            >
              <option value="">Select a state…</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <p style={{ color: 'var(--mg-light)', fontSize: '0.8rem', marginTop: 6, marginBottom: 20 }}>
              Used to tailor estate laws and document guidance to your state.
            </p>
            {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}
            <button type="submit" disabled={loading} style={submitStyle}>
              {loading ? 'Setting up your guide…' : 'Start my free trial →'}
            </button>
            <p style={{ color: 'var(--mg-light)', fontSize: '0.78rem', textAlign: 'center', marginTop: 10 }}>
              14-day free trial · No card required · $89/year after
            </p>
          </form>
        )}

        {step === 'details' && path === 'grief' && (
          <form onSubmit={submit}>
            <button type="button" onClick={() => setStep('path')} style={backStyle}>← Back</button>
            <h2 style={headingStyle}>We're here with you</h2>
            <p style={{ color: 'var(--mg-light)', marginBottom: 24, fontSize: '0.9rem' }}>
              Tell us a little about who you lost.
            </p>
            <label style={labelStyle}>Their name</label>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Robert Miller"
              required style={inputStyle}
            />
            <label style={labelStyle}>Your relationship to them</label>
            <select
              value={relationship} onChange={e => setRelationship(e.target.value)}
              required style={inputStyle}
            >
              <option value="">Select…</option>
              {['Spouse / Partner','Parent','Child','Sibling','Grandparent','Friend','Other'].map(r =>
                <option key={r} value={r}>{r}</option>
              )}
            </select>
            {error && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: 12 }}>{error}</p>}
            <button type="submit" disabled={loading} style={submitStyle}>
              {loading ? 'Setting up…' : 'Get started — it\'s free →'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
  padding: '20px 22px', borderRadius: 14, border: '1.5px solid var(--mg-border)',
  background: '#fff', cursor: 'pointer', textAlign: 'left',
  transition: 'border-color 0.15s',
};
const cardTitle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: '1.05rem', color: 'var(--mg-dark)', marginBottom: 5, fontWeight: 600,
};
const cardSub: React.CSSProperties = { fontSize: '0.85rem', color: 'var(--mg-light)', lineHeight: 1.5 };
const headingStyle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: '1.4rem', color: 'var(--mg-dark)', marginBottom: 8,
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', color: 'var(--mg-mid)',
  fontWeight: 500, marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '11px 14px',
  borderRadius: 9, border: '1.5px solid var(--mg-border-strong)',
  background: '#fff', fontSize: '0.95rem', color: 'var(--mg-dark)',
  marginBottom: 18, outline: 'none', appearance: 'none' as const,
};
const submitStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '13px',
  borderRadius: 10, background: 'var(--mg-accent)', color: '#fff',
  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
};
const backStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--mg-light)',
  fontSize: '0.85rem', cursor: 'pointer', marginBottom: 18, padding: 0,
};
