'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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

export default function WishesClient() {
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

  if (loading) return <p style={{ color: '#9a7a6a', fontSize: '0.9rem' }}>Loading...</p>;
  if (loadError) return <p className="field-error">Couldn&apos;t load your wishes. Please refresh and try again.</p>;

  return (
    <div className="designed-subpage">
      <Link href="/vault" className="back-link">Back to Personal</Link>
      <div className="portal-page-header">
        <div className="portal-page-header-icon">{wishesIcon()}</div>
        <div>
          <h1>Final wishes</h1>
          <p>Leave instructions for your service so your family does not have to guess. Only fill in what you know.</p>
        </div>
      </div>

      <form onSubmit={save} className="portal-pad">
        <div className="field">
          <label>Service type</label>
          <select value={form.type} onChange={f('type')}>
            <option value="">Not decided yet</option>
            {['Burial','Cremation','Green burial','Aquamation','Donation to science','No service'].map(o =>
              <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label>Service date</label>
            <input value={form.date} onChange={f('date')} placeholder="e.g. Saturday afternoon" />
          </div>
          <div className="field">
            <label>Service time</label>
            <input value={form.time} onChange={f('time')} placeholder="e.g. 2:00 PM" />
          </div>
        </div>

        <div className="field">
          <label>Venue</label>
          <input value={form.venue} onChange={f('venue')} placeholder="e.g. St. Mary's Church, Riverside Funeral Home" />
        </div>
        <div className="field">
          <label>Address <span className="opt">(optional)</span></label>
          <input value={form.address} onChange={f('address')} placeholder="Address" />
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
