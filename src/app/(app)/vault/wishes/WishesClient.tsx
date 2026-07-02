'use client';

import Link from 'next/link';
import { useState } from 'react';

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

type InitialServiceDetails = { [K in keyof ServiceDetails]?: ServiceDetails[K] | null } | null;

function initialForm(initial: InitialServiceDetails): ServiceDetails {
  if (!initial) return BLANK;
  return {
    type: initial.type ?? '',
    date: initial.date ?? '',
    time: initial.time ?? '',
    venue: initial.venue ?? '',
    address: initial.address ?? '',
    parking: initial.parking ?? '',
    dresscode: initial.dresscode ?? '',
    officiant: initial.officiant ?? '',
    reception: initial.reception ?? false,
    receptionVenue: initial.receptionVenue ?? '',
    receptionAddress: initial.receptionAddress ?? '',
    receptionTime: initial.receptionTime ?? '',
    livestreamUrl: initial.livestreamUrl ?? '',
    notes: initial.notes ?? '',
  };
}

export default function WishesClient({ initial }: { initial: InitialServiceDetails }) {
  const [form, setForm] = useState<ServiceDetails>(() => initialForm(initial));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

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

  return (
    <div className="planning-detail">
      <Link href="/vault" className="back-link">
        <span aria-hidden>←</span> Back to all planning areas
      </Link>

      <div className="area-header">
        <div className="area-header-icon">{wishesIcon()}</div>
        <div>
          <h1 className="area-header-title">Funeral &amp; final wishes</h1>
          <p className="area-header-desc">Your preferences for your funeral, burial, or memorial service.</p>
        </div>
      </div>

      <section className="planning-detail-grid">
        <form onSubmit={save} className="planning-detail-form">
          <h2>Add a funeral preference or arrangement</h2>
          <div className="field">
            <label>Funeral home or preference type</label>
            <input value={form.venue} onChange={f('venue')} placeholder="e.g. Rose Hill Funeral Home, or 'Burial preference'..." />
          </div>

          <div className="field">
            <label>What type of arrangement?</label>
            <select value={form.type} onChange={f('type')}>
              <option value="">Select...</option>
              {['Burial preference','Cremation preference','Funeral home','Pre-paid funeral plan','Cemetery / burial site','Religious or cultural wishes','Memorial service wishes','Other'].map(o =>
                <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Where can you find more details?</label>
            <input value={form.address} onChange={f('address')} placeholder="e.g. Pre-paid plan documents in filing cabinet" />
            <p className="field-hint">Tell your family where to look, not just what you prefer.</p>
          </div>

          <div className="field">
            <label>Service date <span className="opt">(optional)</span></label>
            <input value={form.date} onChange={f('date')} placeholder="e.g. Saturday afternoon" />
          </div>
          <div className="field">
            <label>Service time <span className="opt">(optional)</span></label>
            <input value={form.time} onChange={f('time')} placeholder="e.g. 2:00 PM" />
          </div>
          <div className="field">
            <label>Parking notes <span className="opt">(optional)</span></label>
            <input value={form.parking} onChange={f('parking')} placeholder="Parking notes" />
          </div>
          <div className="field">
            <label>Dress code <span className="opt">(optional)</span></label>
            <input value={form.dresscode} onChange={f('dresscode')} placeholder="e.g. Casual, Bright colors, All black" />
          </div>
          <div className="field">
            <label>Officiant <span className="opt">(optional)</span></label>
            <input value={form.officiant} onChange={f('officiant')} placeholder="e.g. Father James, My cousin Maria" />
          </div>

          <div className="field">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontWeight: 500 }}>
              <input type="checkbox" checked={form.reception} style={{ width: 'auto' }}
                onChange={e => setForm(p => ({ ...p, reception: e.target.checked }))} />
              Include a reception
            </label>
          </div>
          {form.reception && (
            <>
              <div className="field"><label>Reception venue</label><input value={form.receptionVenue} onChange={f('receptionVenue')} placeholder="Reception venue" /></div>
              <div className="field"><label>Reception address</label><input value={form.receptionAddress} onChange={f('receptionAddress')} placeholder="Address" /></div>
              <div className="field"><label>Reception time</label><input value={form.receptionTime} onChange={f('receptionTime')} placeholder="Time" /></div>
            </>
          )}

          <div className="field">
            <label>Livestream URL <span className="opt">(optional)</span></label>
            <input value={form.livestreamUrl} onChange={f('livestreamUrl')} placeholder="e.g. YouTube link for remote attendees" />
          </div>

          <div className="field">
            <label>Additional notes for your family <span className="opt">(optional)</span></label>
            <textarea value={form.notes} onChange={f('notes')} rows={4}
              placeholder="Anything else you'd like them to know - music, readings, flowers, charity donations in lieu of flowers..." />
          </div>

          {saveError && <p className="field-error">{saveError}</p>}
          <button type="submit" disabled={saving} className="save-btn">
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save wishes'}
          </button>
        </form>

        <aside className="saved-section designed-saved-section">
          <h3>Saved to your plan</h3>
          <div className="saved-pill">
            <div className="pill-icon">{wishesMiniIcon()}</div>
            <div className="pill-main">
              <div className="pill-name">{form.type || 'Funeral & final wishes'}</div>
              <div className="pill-meta">{form.venue || 'Add your wishes and arrangements here.'}</div>
              {(form.notes || form.date || form.time) && (
                <p>{[form.date, form.time, form.notes].filter(Boolean).join(' - ')}</p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <Link href="/vault" className="back-to-plan">← Back to all planning areas</Link>
    </div>
  );
}

function wishesIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function wishesMiniIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
