'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

type Obituary = {
  name: string; born: string; died: string; city: string;
  survived: string; predeceased: string; body: string;
};

const BLANK: Obituary = {
  name: '', born: '', died: '', city: '',
  survived: '', predeceased: '', body: '',
};

export default function PortalPage() {
  const [form, setForm] = useState<Obituary>(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    fetch('/api/vault/obituary').then(r => r.json()).then(({ item }) => {
      if (item) setForm({
        name: item.name ?? '', born: item.born ?? '', died: item.died ?? '',
        city: item.city ?? '', survived: item.survived ?? '',
        predeceased: item.predeceased ?? '', body: item.body ?? '',
      });
      setLoading(false);
    });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/vault/obituary', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  }

  function f(key: keyof Obituary) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  if (loading) return (
    <AppShell title="Your portal" back={{ href: '/dashboard', label: 'Your plan' }}>
      <p style={{ color: 'var(--mg-light)' }}>Loading…</p>
    </AppShell>
  );

  return (
    <AppShell title="Your portal" back={{ href: '/dashboard', label: 'Your plan' }}>
      <p style={{ color: 'var(--mg-light)', fontSize: '0.88rem', marginBottom: 20, lineHeight: 1.5 }}>
        This is what your family sees after activation — a private page to coordinate, remember, and grieve together.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderRadius: 10, overflow: 'hidden', border: '1.5px solid var(--mg-border-strong)' }}>
        {(['edit', 'preview'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600,
            background: tab === t ? 'var(--mg-accent)' : '#fff',
            color: tab === t ? '#fff' : 'var(--mg-mid)',
          }}>
            {t === 'edit' ? 'Edit' : 'Preview'}
          </button>
        ))}
      </div>

      {tab === 'edit' && (
        <form onSubmit={save}>
          <label style={labelStyle}>Full name (as it should appear)</label>
          <input value={form.name} onChange={f('name')} placeholder="e.g. Margaret Anne Chen" style={inputStyle} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Born</label>
              <input value={form.born} onChange={f('born')} placeholder="e.g. March 4, 1942" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Died</label>
              <input value={form.died} onChange={f('died')} placeholder="e.g. June 12, 2025" style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>City / hometown</label>
          <input value={form.city} onChange={f('city')} placeholder="e.g. Portland, Oregon" style={inputStyle} />

          <label style={labelStyle}>Survived by <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
          <input value={form.survived} onChange={f('survived')}
            placeholder="e.g. her husband David, children Emma and James" style={inputStyle} />

          <label style={labelStyle}>Predeceased by <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
          <input value={form.predeceased} onChange={f('predeceased')}
            placeholder="e.g. her parents Robert and Helen" style={inputStyle} />

          <label style={labelStyle}>A few words — your story</label>
          <textarea value={form.body} onChange={f('body')} rows={6}
            placeholder="A brief bio or tribute to appear on the portal…"
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />

          <button type="submit" disabled={saving} style={submitStyle}>
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save portal'}
          </button>
        </form>
      )}

      {tab === 'preview' && (
        <div style={{ background: '#fff', border: '1px solid var(--mg-border)', borderRadius: 14, padding: '28px 22px' }}>
          {form.name ? (
            <>
              <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.6rem', color: 'var(--mg-dark)', marginBottom: 4 }}>
                {form.name}
              </h1>
              {(form.born || form.died) && (
                <p style={{ color: 'var(--mg-light)', fontSize: '0.88rem', marginBottom: 16 }}>
                  {[form.born, form.died].filter(Boolean).join(' – ')}
                  {form.city ? ` · ${form.city}` : ''}
                </p>
              )}
              {form.body && (
                <p style={{ color: 'var(--mg-mid)', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: 16 }}>
                  {form.body}
                </p>
              )}
              {form.survived && (
                <p style={{ color: 'var(--mg-mid)', fontSize: '0.88rem', marginBottom: 6 }}>
                  <strong>Survived by:</strong> {form.survived}
                </p>
              )}
              {form.predeceased && (
                <p style={{ color: 'var(--mg-mid)', fontSize: '0.88rem' }}>
                  <strong>Predeceased by:</strong> {form.predeceased}
                </p>
              )}
            </>
          ) : (
            <p style={{ color: 'var(--mg-light)', textAlign: 'center', padding: '24px 0' }}>
              Fill in the Edit tab to see a preview.
            </p>
          )}
        </div>
      )}
    </AppShell>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', color: 'var(--mg-mid)', fontWeight: 500, marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '10px 13px',
  borderRadius: 9, border: '1.5px solid var(--mg-border-strong)',
  background: '#fff', fontSize: '0.92rem', color: 'var(--mg-dark)',
  marginBottom: 16, outline: 'none', boxSizing: 'border-box',
};
const submitStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '13px', marginTop: 4,
  borderRadius: 10, background: 'var(--mg-accent)', color: '#fff',
  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
};
