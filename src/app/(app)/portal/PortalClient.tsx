'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';

type Obituary = {
  name: string;
  born: string;
  died: string;
  city: string;
  survived: string;
  predeceased: string;
  body: string;
};

type Photo = { id: string; storageKey: string; caption: string | null };

const BLANK: Obituary = {
  name: '',
  born: '',
  died: '',
  city: '',
  survived: '',
  predeceased: '',
  body: '',
};

const WARM = [
  ['#8a5c3e', 'linear-gradient(160deg,#a67356,#7a4d31)'],
  ['#c57b57', 'linear-gradient(160deg,#df8259,#b06640)'],
  ['#b87333', 'linear-gradient(160deg,#d4894a,#9a5e22)'],
  ['#c4956a', 'linear-gradient(160deg,#d9a87e,#b07d52)'],
  ['#8b6355', 'linear-gradient(160deg,#a07468,#6e4c40)'],
  ['#c49a8a', 'linear-gradient(160deg,#d4afa0,#b08070)'],
  ['#9f4d49', 'linear-gradient(160deg,#b85f5a,#7f3835)'],
  ['#6f4e37', 'linear-gradient(160deg,#8a6246,#503525)'],
];

const COOL = [
  ['#6b7c6e', 'linear-gradient(160deg,#81947f,#4a5c4d)'],
  ['#506f86', 'linear-gradient(160deg,#6f8da4,#36556b)'],
  ['#6f7f91', 'linear-gradient(160deg,#8797aa,#536375)'],
  ['#6d8290', 'linear-gradient(160deg,#86a0ad,#526a78)'],
  ['#7b8f84', 'linear-gradient(160deg,#94a99d,#607467)'],
  ['#5f7566', 'linear-gradient(160deg,#78917f,#435a4b)'],
  ['#75889d', 'linear-gradient(160deg,#8fa2b5,#5b6f84)'],
  ['#6b7785', 'linear-gradient(160deg,#84909e,#525e6b)'],
];

const DARK = [
  ['#2f241f', 'linear-gradient(160deg,#4a3930,#1f1714)'],
  ['#24352d', 'linear-gradient(160deg,#3b5548,#17241e)'],
  ['#263746', 'linear-gradient(160deg,#3c5366,#192631)'],
  ['#3d2f39', 'linear-gradient(160deg,#584453,#2a2027)'],
];

const LIGHT = [
  ['#e7d8ca', 'linear-gradient(160deg,#efe4da,#d8c5b5)'],
  ['#d8ddd2', 'linear-gradient(160deg,#e6ebe0,#c9d0c2)'],
  ['#d6e0e6', 'linear-gradient(160deg,#e5edf2,#c4d1da)'],
  ['#ead9d4', 'linear-gradient(160deg,#f3e6e2,#dbc5bf)'],
];

const PATTERNS = ['Plain', 'Soft light', 'Garden', 'Paper', 'Quiet lines'];
const ACCENTS = ['#c57b57', '#6b7c6e', '#506f86', '#8a5c3e', '#9f4d49', '#2f241f'];

function savedPortalSettings() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem('mg.portal.settings') ?? '{}');
  } catch {
    return {};
  }
}

export default function PortalClient() {
  const initialSettings = savedPortalSettings();
  const [form, setForm] = useState<Obituary>(BLANK);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [crop, setCrop] = useState<'circle' | 'square'>(initialSettings.crop ?? 'circle');
  const [theme, setTheme] = useState<string[]>(initialSettings.theme ?? COOL[0]);
  const [pattern, setPattern] = useState<string>(initialSettings.pattern ?? PATTERNS[0]);
  const [accent, setAccent] = useState<string>(initialSettings.accent ?? ACCENTS[0]);
  const [published, setPublished] = useState(false);
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('mg.portal.settings', JSON.stringify({ theme, pattern, accent, crop }));
  }, [theme, pattern, accent, crop]);

  useEffect(() => {
    Promise.all([
      fetch('/api/vault/obituary').then(r => r.ok ? r.json() : Promise.reject()),
      fetch('/api/vault/photos').then(r => r.ok ? r.json() : { items: [] }),
      fetch('/api/portal/publish').then(r => r.ok ? r.json() : null),
    ])
      .then(([obit, photoData, publishData]) => {
        if (obit.item) setForm({
          name: obit.item.name ?? '',
          born: obit.item.born ?? '',
          died: obit.item.died ?? '',
          city: obit.item.city ?? '',
          survived: obit.item.survived ?? '',
          predeceased: obit.item.predeceased ?? '',
          body: obit.item.body ?? '',
        });
        setPhotos(photoData.items ?? []);
        if (publishData) {
          setPublished(publishData.published);
          setPortalUrl(publishData.url);
        }
        setLoading(false);
      })
      .catch(() => { setLoadError(true); setLoading(false); });
  }, []);

  async function uploadPortrait(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPhotoError('');
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/vault/photos/upload',
      });
      const res = await fetch('/api/vault/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: blob.url, caption: 'Portal portrait' }),
      });
      if (!res.ok) throw new Error('record failed');
      const { item } = await res.json();
      setPhotos(prev => [item, ...prev]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setPhotoError('That photo could not be uploaded. Please try again.');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function saveDetails(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    setSaveError('');
    const res = await fetch('/api/vault/obituary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setSaveError('Something went wrong. Please try again.');
    }
    setSaving(false);
  }

  async function togglePublish(next: boolean) {
    setPublishing(true);
    setPublishError('');
    const res = await fetch('/api/portal/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publish: next }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setPublished(data.published);
      setPortalUrl(data.url);
    } else {
      setPublishError(data.error ?? 'Please save a name before publishing.');
    }
    setPublishing(false);
  }

  function f(key: keyof Obituary) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  if (loading) return <p style={{ color: '#9a7a6a' }}>Loading...</p>;
  if (loadError) return <p className="field-error">Couldn&apos;t load your portal. Please refresh and try again.</p>;

  const portrait = photos[0]?.storageKey;
  const dates = [form.born || '1945', form.died || '2025'].filter(Boolean).join(' - ');

  return (
    <>
      <h1 className="page-heading">Memorial portal</h1>
      <p className="page-sub">Design what your family and friends will see after you pass. It goes live only when your passing is confirmed.</p>

      <p className="section-label-lg">Preview</p>
      <div className="portal-designer-preview">
        <div className={`portal-preview-header pattern-${PATTERNS.indexOf(pattern)}`} style={{ background: theme[1] }}>
          <div className={`portal-preview-photo ${crop}`}>
            {portrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={portrait} alt="" />
            ) : (
              <span style={{ color: accent }}>Leaf</span>
            )}
          </div>
          <div className="portal-preview-name">{form.name || 'Your name'}</div>
          <div className="portal-preview-dates">{dates}</div>
        </div>
        <div className="portal-preview-body">
          <div className="portal-preview-line" style={{ width: '75%' }} />
          <div className="portal-preview-line" style={{ width: '90%' }} />
          <div className="portal-preview-line" style={{ width: '60%' }} />
        </div>
      </div>

      {saved && <div className="save-flash show">Changes saved.</div>}

      <form onSubmit={saveDetails} className="portal-details-grid">
        <div className="field">
          <label>Name on portal</label>
          <input value={form.name} onChange={f('name')} placeholder="e.g. Margaret Anne Chen" />
        </div>
        <div className="field">
          <label>Dates</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input value={form.born} onChange={f('born')} placeholder="Born" />
            <input value={form.died} onChange={f('died')} placeholder="Died" />
          </div>
        </div>
        <div className="field portal-wide">
          <label>Short tribute <span className="opt">(optional)</span></label>
          <textarea value={form.body} onChange={f('body')} rows={3} placeholder="A few words to appear on the memorial page." />
        </div>
        {saveError && <p className="field-error portal-wide">{saveError}</p>}
        <button type="submit" disabled={saving} className="save-btn portal-wide">{saving ? 'Saving...' : 'Save portal details'}</button>
      </form>

      <p className="section-label-lg">Your photo</p>
      <div className="photo-upload-area" onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" accept="image/*" onChange={uploadPortrait} />
        <div className="upload-icon">+</div>
        <div className="upload-title">{uploading ? 'Uploading...' : portrait ? 'Replace photo' : 'Tap to upload a photo'}</div>
        <div className="upload-sub">Any size or shape. We will fit it into your chosen crop.</div>
      </div>
      {photoError && <p className="field-error">{photoError}</p>}
      <div className="photo-actions">
        <button type="button" className={`photo-action-btn ${crop === 'circle' ? 'active' : ''}`} onClick={() => setCrop('circle')}>Circle crop</button>
        <button type="button" className={`photo-action-btn ${crop === 'square' ? 'active' : ''}`} onClick={() => setCrop('square')}>Square crop</button>
      </div>

      <p className="section-label-lg">Background color</p>
      <Swatches label="Warm & earthy" colors={WARM} active={theme[0]} onPick={setTheme} />
      <Swatches label="Cool & calm" colors={COOL} active={theme[0]} onPick={setTheme} />
      <Swatches label="Dark & deep" colors={DARK} active={theme[0]} onPick={setTheme} />
      <Swatches label="Light & soft" colors={LIGHT} active={theme[0]} onPick={setTheme} />

      <p className="section-label-lg" style={{ marginTop: 28 }}>Page background</p>
      <div className="pattern-grid">
        {PATTERNS.map(p => (
          <button key={p} type="button" className={`pattern-card ${p === pattern ? 'selected' : ''}`} onClick={() => setPattern(p)}>
            <span className={`pattern-card-inner pattern-${PATTERNS.indexOf(p)}`} />
            <span className="pattern-card-label">{p}</span>
          </button>
        ))}
      </div>
      <div className="color-section-label">Accent color</div>
      <div className="color2-grid">
        {ACCENTS.map(c => <button key={c} type="button" aria-label={c} className={`color2-swatch ${c === accent ? 'selected' : ''}`} style={{ background: c }} onClick={() => setAccent(c)} />)}
      </div>

      <p className="section-label-lg" style={{ marginTop: 28 }}>What else you can set up</p>
      <div className="feature-grid">
        <Feature href="/portal/gallery" name="Photo gallery" desc="Upload photos for the gallery. Family can also add photos after your passing." status="You upload these" />
        <Feature href="/portal/guestbook" name="Guestbook" desc="Visitors can leave messages. Choose auto-post or review-first mode." status="You set the rules" />
        <Feature href="/portal/ways-to-help" name="Ways to help" desc="Add a donation link, memorial fund, meal train, or travel coordination link." status="Optional" />
        <Feature href="/portal/service-details" name="Service & gifts" desc="Funeral home details, service info, and memorial keepsakes for visitors to order." status="You fill this in" />
      </div>

      <div className="entry-card" style={{ marginTop: 24 }}>
        <div className="entry-card-row">
          <div>
            <div className="entry-title">Public memorial page</div>
            <div className="entry-sub">Publish when the page is ready. Anyone with the link can view it.</div>
          </div>
          <span className={published ? 'status-chip chip-done' : 'status-chip chip-open'}>{published ? 'Live' : 'Draft'}</span>
        </div>
        {published && portalUrl && (
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <input readOnly value={portalUrl} style={{ flex: 1, padding: '10px 12px', border: '1px solid rgba(145,104,82,0.24)', borderRadius: 9, background: '#fff', fontSize: '0.82rem' }} />
            <button type="button" onClick={() => { navigator.clipboard?.writeText(portalUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); }} className="entry-link-btn">
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
        {publishError && <p className="field-error" style={{ marginTop: 10 }}>{publishError}</p>}
        <button type="button" disabled={publishing} onClick={() => togglePublish(!published)} className={published ? 'secondary-wide-btn' : 'save-btn'} style={{ marginTop: 14 }}>
          {publishing ? 'Saving...' : published ? 'Unpublish memorial page' : 'Publish memorial page'}
        </button>
      </div>
    </>
  );
}

function Swatches({ label, colors, active, onPick }: { label: string; colors: string[][]; active: string; onPick: (c: string[]) => void }) {
  return (
    <>
      <div className="color-section-label">{label}</div>
      <div className="color-grid">
        {colors.map(c => (
          <button key={c[0]} type="button" aria-label={c[0]} className={`color-swatch ${c[0] === active ? 'selected' : ''}`} style={{ background: c[1] }} onClick={() => onPick(c)} />
        ))}
      </div>
    </>
  );
}

function Feature({ href, name, desc, status }: { href: string; name: string; desc: string; status: string }) {
  return (
    <Link className="feature-tile" href={href}>
      <div className="feature-icon">+</div>
      <div className="feature-name">{name}</div>
      <div className="feature-desc">{desc}</div>
      <span className="feature-status">{status}</span>
    </Link>
  );
}
