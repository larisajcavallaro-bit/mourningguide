'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';

type ServiceDetails = {
  type: string; date: string; time: string; venue: string; address: string;
  parking: string; dresscode: string; officiant: string; reception: boolean;
  receptionVenue: string; receptionAddress: string; receptionTime: string;
  livestreamUrl: string; notes: string;
};

const BLANK: ServiceDetails = {
  type: '', date: '', time: '', venue: '', address: '', parking: '',
  dresscode: '', officiant: '', reception: false,
  receptionVenue: '', receptionAddress: '', receptionTime: '',
  livestreamUrl: '', notes: '',
};

export default function WishesPage() {
  const [form, setForm] = useState<ServiceDetails>(BLANK);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch('/api/vault/wishes')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ item }) => {
        if (item) setForm({
          type: item.type ?? '', date: item.date ?? '', time: item.time ?? '',
          venue: item.venue ?? '', address: item.address ?? '', parking: item.parking ?? '',
          dresscode: item.dresscode ?? '', officiant: item.officiant ?? '',
          reception: item.reception ?? false,
          receptionVenue: item.receptionVenue ?? '', receptionAddress: item.receptionAddress ?? '',
          receptionTime: item.receptionTime ?? '', livestreamUrl: item.livestreamUrl ?? '',
          notes: item.notes ?? '',
        });
        setLoading(false);
      })
      .catch(() => { setLoadError(true); setLoading(false); });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    const res = await fetch('/api/vault/wishes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else { setSaveError('Something went wrong. Please try again.'); }
    setSaving(false);
  }

  function f(key: keyof ServiceDetails) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  if (loading) return (
    <AppShell title="Final wishes" back={{ href: '/dashboard', label: 'Your plan' }}>
      <p style={{ color: 'var(--mg-light)', fontSize: '0.9rem' }}>Loading…</p>
    </AppShell>
  );

  if (loadError) return (
    <AppShell title="Final wishes" back={{ href: '/dashboard', label: 'Your plan' }}>
      <p style={{ color: '#c0392b', fontSize: '0.9rem' }}>Couldn't load your wishes. Please refresh and try again.</p>
    </AppShell>
  );

  return (
    <AppShell title="Final wishes" back={{ href: '/dashboard', label: 'Your plan' }}>
      <p style={{ color: 'var(--mg-light)', fontSize: '0.88rem', marginBottom: 24, lineHeight: 1.5 }}>
        Leave instructions for your service so your family doesn't have to guess. Only fill in what you know.
      </p>
      <form onSubmit={save}>
        <Section label="Service type">
          <select value={form.type} onChange={f('type')} style={inputStyle}>
            <option value="">Not decided yet</option>
            {['Burial','Cremation','Green burial','Aquamation','Donation to science','No service'].map(o =>
              <option key={o} value={o}>{o}</option>)}
          </select>
        </Section>

        <Section label="Service date & time">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input value={form.date} onChange={f('date')} placeholder="e.g. Saturday afternoon" style={inputStyle} />
            <input value={form.time} onChange={f('time')} placeholder="e.g. 2:00 PM" style={inputStyle} />
          </div>
        </Section>

        <Section label="Venue">
          <input value={form.venue} onChange={f('venue')} placeholder="e.g. St. Mary's Church, Riverside Funeral Home" style={inputStyle} />
          <input value={form.address} onChange={f('address')} placeholder="Address" style={inputStyle} />
          <input value={form.parking} onChange={f('parking')} placeholder="Parking notes (optional)" style={inputStyle} />
        </Section>

        <Section label="Dress code">
          <input value={form.dresscode} onChange={f('dresscode')} placeholder="e.g. Casual, Bright colors, All black" style={inputStyle} />
        </Section>

        <Section label="Officiant">
          <input value={form.officiant} onChange={f('officiant')} placeholder="e.g. Father James, My cousin Maria" style={inputStyle} />
        </Section>

        <Section label="Reception">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 12 }}>
            <input type="checkbox" checked={form.reception}
              onChange={e => setForm(p => ({ ...p, reception: e.target.checked }))} />
            <span style={{ fontSize: '0.9rem', color: 'var(--mg-mid)' }}>Include a reception</span>
          </label>
          {form.reception && <>
            <input value={form.receptionVenue} onChange={f('receptionVenue')} placeholder="Reception venue" style={inputStyle} />
            <input value={form.receptionAddress} onChange={f('receptionAddress')} placeholder="Address" style={inputStyle} />
            <input value={form.receptionTime} onChange={f('receptionTime')} placeholder="Time" style={inputStyle} />
          </>}
        </Section>

        <Section label="Livestream URL">
          <input value={form.livestreamUrl} onChange={f('livestreamUrl')} placeholder="e.g. YouTube link for remote attendees" style={inputStyle} />
        </Section>

        <Section label="Additional notes for your family">
          <textarea value={form.notes} onChange={f('notes')} rows={4}
            placeholder="Anything else you'd like them to know — music, readings, flowers, charity donations in lieu of flowers…"
            style={{ ...inputStyle, resize: 'vertical' }} />
        </Section>

        {saveError && <p style={{ color: '#c0392b', fontSize: '0.84rem', marginBottom: 10 }}>{saveError}</p>}
        <button type="submit" disabled={saving} style={submitStyle}>
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save wishes'}
        </button>
      </form>
    </AppShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--mg-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '10px 13px',
  borderRadius: 9, border: '1.5px solid var(--mg-border-strong)',
  background: '#fff', fontSize: '0.92rem', color: 'var(--mg-dark)',
  marginBottom: 10, outline: 'none', boxSizing: 'border-box',
};
const submitStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '13px', marginTop: 8,
  borderRadius: 10, background: 'var(--mg-accent)', color: '#fff',
  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
};
