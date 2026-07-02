'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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
type PlanFor = 'self' | 'other';
type ConsentPath = 'can_text' | 'cannot_text';

const PROXY_RELATIONSHIPS = [
  'Child',
  'Spouse / Partner',
  'Sibling',
  'Grandchild',
  'Friend',
  'Professional caregiver',
  'Other family member',
];

const PAGE_BG = 'radial-gradient(circle at 72% 8%,rgba(203,183,162,0.18),transparent 28%),linear-gradient(180deg,#fffaf4,#f5eadf)';
const serif = "var(--serif)";

function Logo({ mb = 48 }: { mb?: number }) {
  return (
    <Link href="/" aria-label="Mourning Guide home"
      style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: mb }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mg-icon.svg" alt="" style={{ height: 44, width: 'auto' }} />
      <span style={{ fontFamily: serif, fontSize: '1.05rem', fontWeight: 500, color: '#2C1C0E', letterSpacing: '-0.02em' }}>Mourning Guide</span>
    </Link>
  );
}

const cardStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 10, padding: '32px 36px',
  border: '2px solid rgba(142,95,70,0.2)', borderRadius: 26,
  background: 'linear-gradient(145deg,rgba(255,255,255,0.7),rgba(255,250,244,0.92))',
  boxShadow: '0 16px 36px rgba(67,46,33,0.09)', textDecoration: 'none',
  cursor: 'pointer', textAlign: 'left', transition: 'border-color 160ms, transform 160ms',
};
const iconWrap: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 52, height: 52, flexShrink: 0, border: '1px solid rgba(183,101,69,0.3)',
  borderRadius: '50%', background: 'linear-gradient(180deg,rgba(255,250,244,0.92),rgba(244,232,219,0.9))', color: '#b76545',
};
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 8, fontSize: '0.88rem', color: '#594b43' };
const inputStyle: React.CSSProperties = {
  width: '100%', minHeight: 48, padding: '12px 14px', border: '1px solid rgba(145,104,82,0.24)',
  borderRadius: 12, background: 'rgba(255,255,255,0.82)', font: 'inherit', fontSize: '0.96rem', boxSizing: 'border-box',
};
const primaryBtn: React.CSSProperties = {
  width: '100%', minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: 'none', borderRadius: 14, cursor: 'pointer',
  background: 'linear-gradient(180deg,#d88963,#c57b57)', color: '#fff',
  fontFamily: serif, fontSize: '1.02rem', fontWeight: 500, boxShadow: '0 12px 26px rgba(197,123,87,0.28)',
};
const hint: React.CSSProperties = { margin: '6px 0 0', fontSize: '0.82rem', color: '#7a5341' };
const infoBox: React.CSSProperties = {
  padding: '16px 18px', borderRadius: 14, marginBottom: 20,
  border: '1px solid rgba(145,104,82,0.2)', background: 'rgba(255,255,255,0.65)',
  fontSize: '0.9rem', color: '#594b43', lineHeight: 1.65,
};
const choiceCard = (selected: boolean): React.CSSProperties => ({
  display: 'block', width: '100%', textAlign: 'left', padding: '18px 20px', marginBottom: 12,
  border: selected ? '2px solid rgba(197,123,87,0.55)' : '2px solid rgba(142,95,70,0.2)',
  borderRadius: 16, background: selected ? 'rgba(197,123,87,0.08)' : 'rgba(255,255,255,0.55)',
  cursor: 'pointer', font: 'inherit',
});

function OnboardingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPath = searchParams.get('path');
  const createNew = searchParams.get('new') === '1';
  const initialPath: Path | null = queryPath === 'planning' || queryPath === 'grief' ? queryPath : null;
  const [step, setStep] = useState<'path' | 'details'>(initialPath ? 'details' : 'path');
  const [path, setPath] = useState<Path | null>(initialPath);
  const [planFor, setPlanFor] = useState<PlanFor>('self');
  const [proxyRelationship, setProxyRelationship] = useState('');
  const [consentPath, setConsentPath] = useState<ConsentPath>('cannot_text');
  const [familyAttestation, setFamilyAttestation] = useState(false);
  const [subjectPhone, setSubjectPhone] = useState('');
  const [name, setName] = useState('');
  const [usState, setUsState] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function choosePath(p: Path) { setPath(p); setStep('details'); }

  useEffect(() => {
    if (createNew) return;
    fetch('/api/account/list')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.memberships?.length) router.replace('/dashboard');
      })
      .catch(() => {});
  }, [createNew, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!path) return;
    setLoading(true);
    setError('');
    const body = path === 'planning'
      ? {
          path,
          subjectName: name,
          usState,
          planFor,
          createNew: createNew || undefined,
          ...(planFor === 'other' ? {
            proxyRelationship,
            consentPath,
            familyAttestation: consentPath === 'cannot_text' ? familyAttestation : true,
            subjectPhone: consentPath === 'can_text' ? subjectPhone : undefined,
          } : {}),
        }
      : { path, subjectName: name, relationship, createNew: createNew || undefined };
    const res = await fetch('/api/onboarding', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Something went wrong. Please try again.');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  }

  // ── Path fork ──────────────────────────────────────────────────────────────
  if (step === 'path') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: PAGE_BG }}>
        <Logo />
        <div style={{ width: 'min(100%,680px)' }}>
          <h1 style={{ fontFamily: serif, fontSize: 'clamp(2.2rem,4vw,3rem)', fontWeight: 500, lineHeight: 1.1, textAlign: 'center', margin: '0 0 10px', color: '#2f241f' }}>
            Where are you right now?
          </h1>
          <p style={{ textAlign: 'center', color: '#594b43', fontSize: '1rem', lineHeight: 1.65, margin: '0 0 20px' }}>
            Choose the situation that fits you. These are <strong>different kinds of accounts</strong> — not upgrades of each other.
          </p>
          <div style={{ ...infoBox, marginBottom: 28 }}>
            <strong style={{ color: '#2f241f' }}>Not sure?</strong> Planning ahead = documenting before a death ($89/year after a free trial). Grief path = help right after someone died (always free, no card).
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            <button onClick={() => choosePath('planning')} style={cardStyle}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(197,123,87,0.55)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(142,95,70,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={iconWrap}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 13 12 13 22"/></svg>
                </span>
                <div>
                  <h2 style={{ fontFamily: serif, fontSize: '1.7rem', fontWeight: 500, margin: '0 0 4px', color: '#2f241f' }}>I&apos;m planning ahead for my family</h2>
                  <p style={{ color: '#594b43', fontSize: '0.94rem', lineHeight: 1.55, margin: 0 }}>I want to document my accounts, wishes, and letters — so my family has a map, not a mystery.</p>
                </div>
              </div>
              <p style={{ color: '#7a5341', fontSize: '0.82rem', margin: '0 0 0 68px', lineHeight: 1.55 }}>
                14-day free trial · No credit card · $89/year after if you subscribe to Guide Plan
              </p>
              <ul style={{ margin: '8px 0 0 68px', padding: '0 0 0 16px', color: '#594b43', fontSize: '0.84rem', lineHeight: 1.6 }}>
                <li>For yourself, or for a parent you help manage</li>
                <li>Vault, letters, legacy contacts, family portal</li>
              </ul>
            </button>

            <button onClick={() => choosePath('grief')} style={cardStyle}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(197,123,87,0.55)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(142,95,70,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={iconWrap}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </span>
                <div>
                  <h2 style={{ fontFamily: serif, fontSize: '1.7rem', fontWeight: 500, margin: '0 0 4px', color: '#2f241f' }}>Someone I love just died</h2>
                  <p style={{ color: '#594b43', fontSize: '0.94rem', lineHeight: 1.55, margin: 0 }}>I need to know what to do right now. One step at a time — only what can&apos;t wait.</p>
                </div>
              </div>
              <p style={{ color: '#7a5341', fontSize: '0.82rem', margin: '0 0 0 68px', lineHeight: 1.55 }}>
                Always free · No credit card · No time limit · Not a paid upgrade
              </p>
              <ul style={{ margin: '8px 0 0 68px', padding: '0 0 0 16px', color: '#594b43', fontSize: '0.84rem', lineHeight: 1.6 }}>
                <li>Step-by-step tasks when someone just died</li>
                <li>Separate from planning ahead — choose this only if you need help now</li>
              </ul>
            </button>
          </div>
          <p style={{ textAlign: 'center', color: '#7a5341', fontSize: '0.88rem', margin: '28px 0 0' }}>
            Already have an account? <Link href="/sign-in" style={{ color: '#c86d49', textDecoration: 'underline', textUnderlineOffset: 3 }}>Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── Details (planning / grief) ───────────────────────────────────────────────
  const planning = path === 'planning';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', background: PAGE_BG }}>
      <Logo mb={40} />
      <div style={{ width: 'min(100%,520px)' }}>
        <button type="button" onClick={() => setStep('path')}
          style={{ background: 'none', border: 'none', color: '#7a5341', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 18, padding: 0 }}>← Back</button>

        <p style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c86d49', margin: '0 0 12px' }}>
          {planning ? 'Planning path' : 'Grief path'}
        </p>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 500, lineHeight: 1.02, letterSpacing: '-0.02em', margin: '0 0 12px', color: '#2f241f' }}>
          {planning
            ? (createNew ? 'Add another plan' : 'Give your family a map, not a mystery.')
            : "We're here with you."}
        </h1>
        <p style={{ fontSize: '1rem', color: '#594b43', lineHeight: 1.7, margin: '0 0 20px' }}>
          {planning
            ? (createNew
              ? 'Set up a separate plan — for yourself or a parent. You can switch between plans anytime from the Viewing menu at the top of the app.'
              : 'The first 14 days are full access — no credit card. Build at your own pace. Nothing is urgent.')
            : 'You chose the grief path — free support after a loss. This is not a subscription and not related to Guide Plan pricing.'}
        </p>

        {planning && (
          <div style={infoBox}>
            <strong style={{ color: '#2f241f' }}>You are signing up for planning ahead.</strong> Guide Plan ($89/year) is optional after your trial. It is <em>not</em> the grief path and not an upgrade to grief support.
          </div>
        )}

        {!planning && (
          <div style={{ ...infoBox, borderColor: 'rgba(46,107,66,0.25)', background: 'rgba(46,107,66,0.06)' }}>
            <strong style={{ color: '#2e6b42' }}>Grief path = always free.</strong> No billing, no trial, no Guide Plan. If you meant to plan ahead for yourself or a parent, go back and choose planning instead.
          </div>
        )}

        <form onSubmit={submit}
          style={{ padding: 32, border: '1px solid rgba(142,95,70,0.2)', borderRadius: 26, background: 'linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,250,244,0.94))', boxShadow: '0 20px 46px rgba(67,46,33,0.1)' }}>
          {planning && (
            <div style={{ marginBottom: 22 }}>
              <label style={{ ...labelStyle, marginBottom: 12 }}>Who is this plan for?</label>

              <button type="button" onClick={() => setPlanFor('self')} style={choiceCard(planFor === 'self')}>
                <strong style={{ display: 'block', fontFamily: serif, fontSize: '1.05rem', color: '#2f241f', marginBottom: 6 }}>Myself</strong>
                <span style={{ fontSize: '0.88rem', color: '#594b43', lineHeight: 1.55 }}>
                  I am documenting my own accounts, wishes, and letters. I will be the owner and may subscribe to Guide Plan after the free trial.
                </span>
              </button>

              <button type="button" onClick={() => setPlanFor('other')} style={choiceCard(planFor === 'other')}>
                <strong style={{ display: 'block', fontFamily: serif, fontSize: '1.05rem', color: '#2f241f', marginBottom: 6 }}>A parent or loved one</strong>
                <span style={{ fontSize: '0.88rem', color: '#594b43', lineHeight: 1.55 }}>
                  I am building this plan for someone else (for example, Mom or Dad). They do not need their own login. I handle setup and billing. I can invite a sibling to help later.
                </span>
              </button>
            </div>
          )}

          {planning && planFor === 'other' && (
            <>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Your relationship to them</label>
                <select
                  value={proxyRelationship}
                  onChange={e => setProxyRelationship(e.target.value)}
                  required
                  style={inputStyle}
                >
                  <option value="">Select…</option>
                  {PROXY_RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Can they confirm by text message?</label>
                <div style={{ display: 'grid', gap: 10 }}>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: '0.9rem', color: '#594b43', lineHeight: 1.55 }}>
                    <input
                      type="radio"
                      name="consentPath"
                      checked={consentPath === 'cannot_text'}
                      onChange={() => setConsentPath('cannot_text')}
                      style={{ marginTop: 4 }}
                    />
                    <span>
                      <strong style={{ color: '#2f241f' }}>No — they can&apos;t use text</strong>
                      <br />
                      Common if they don&apos;t have a mobile phone, have dementia, or aren&apos;t comfortable with texts. You can start building right away.
                    </span>
                  </label>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: '0.9rem', color: '#594b43', lineHeight: 1.55 }}>
                    <input
                      type="radio"
                      name="consentPath"
                      checked={consentPath === 'can_text'}
                      onChange={() => setConsentPath('can_text')}
                      style={{ marginTop: 4 }}
                    />
                    <span>
                      <strong style={{ color: '#2f241f' }}>Yes — we can text them later</strong>
                      <br />
                      Optional. You can build the plan now; we&apos;ll send a confirmation text when that&apos;s available.
                    </span>
                  </label>
                </div>
              </div>

              {consentPath === 'cannot_text' && (
                <div style={{ marginBottom: 18, padding: '14px 16px', borderRadius: 12, border: '1px solid rgba(145,104,82,0.2)', background: 'rgba(255,255,255,0.6)' }}>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', fontSize: '0.88rem', color: '#594b43', lineHeight: 1.6 }}>
                    <input
                      type="checkbox"
                      checked={familyAttestation}
                      onChange={e => setFamilyAttestation(e.target.checked)}
                      required
                      style={{ marginTop: 4, flexShrink: 0 }}
                    />
                    <span>
                      I confirm that I have this person&apos;s permission to set up Mourning Guide on their behalf, or I am an authorized family member helping organize their affairs.
                    </span>
                  </label>
                </div>
              )}

              {consentPath === 'can_text' && (
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Their mobile number <span style={{ color: '#9a7a6a', fontWeight: 400 }}>(optional)</span></label>
                  <input
                    value={subjectPhone}
                    onChange={e => setSubjectPhone(e.target.value)}
                    type="tel"
                    placeholder="(555) 000-0000"
                    style={inputStyle}
                  />
                  <p style={hint}>We&apos;ll only use this for a one-time confirmation text, if and when they&apos;re ready. You can start building the plan now.</p>
                </div>
              )}
            </>
          )}

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>
              {planning
                ? (planFor === 'other' ? "Your loved one's full name" : 'Your full name')
                : "Your loved one's name"}
            </label>
            <input value={name} onChange={e => setName(e.target.value)} required
              placeholder={planning ? (planFor === 'other' ? 'e.g. Margaret Chen' : 'e.g. James Miller') : 'e.g. Robert Miller'} style={inputStyle} />
          </div>

          {planning ? (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>
                {planFor === 'other' ? "Their US state of residence" : 'US state of residence'}
              </label>
              <select value={usState} onChange={e => setUsState(e.target.value)} required style={inputStyle}>
                <option value="">Select your state…</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <p style={hint}>Used to tailor estate laws and document guidance to your state.</p>
            </div>
          ) : (
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Your relationship to them</label>
              <select value={relationship} onChange={e => setRelationship(e.target.value)} required style={inputStyle}>
                <option value="">Select…</option>
                {['Spouse / Partner','Parent','Child','Sibling','Grandparent','Friend','Other'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          )}

          {error && <p style={{ color: '#b0402e', fontSize: '0.85rem', margin: '0 0 12px' }}>{error}</p>}

          {planning && name.trim() && (
            <div style={{ ...infoBox, marginBottom: 18, borderColor: 'rgba(197,123,87,0.28)' }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c86d49' }}>You are creating</p>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#2f241f', lineHeight: 1.55 }}>
                {planFor === 'other'
                  ? <>A <strong>planning plan for {name.trim()}</strong>, managed by you. 14-day free trial, then $89/year if you subscribe.</>
                  : <>A <strong>planning plan for yourself</strong> ({name.trim()}). 14-day free trial, then $89/year if you subscribe.</>}
              </p>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...primaryBtn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Setting up…' : planning ? 'Start my free trial →' : "Get started — it's free →"}
          </button>
          {planning && (
            <p style={{ ...hint, textAlign: 'center', marginTop: 12 }}>14-day free trial · No credit card · Guide Plan is $89/year after, if you choose to subscribe</p>
          )}
          {!planning && (
            <p style={{ ...hint, textAlign: 'center', marginTop: 12 }}>Grief path · Always free · No Guide Plan subscription</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingForm />
    </Suspense>
  );
}
