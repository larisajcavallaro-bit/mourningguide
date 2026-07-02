'use client';

import Link from 'next/link';
import { useState } from 'react';

type Field =
  | { type: 'text' | 'email' | 'date'; id: string; label: string; placeholder?: string; hint?: string; required?: boolean }
  | { type: 'textarea'; id: string; label: string; placeholder?: string; hint?: string; required?: boolean; rows?: number }
  | { type: 'select'; id: string; label: string; placeholder?: string; options: string[]; required?: boolean }
  | { type: 'file'; id: string; label: string; accept: string; title: string; sub: string; hint?: string };

type SetupConfig = {
  slug: string;
  title: string;
  sub: string;
  icon: 'photo' | 'file' | 'music' | 'speaker' | 'voice';
  saveLabel: string;
  addAnotherLabel: string;
  savedTitle: string;
  fields: Field[];
  summary: (values: Record<string, string>) => { title: string; meta: string };
};

export const SETUPS: Record<string, SetupConfig> = {
  photos: {
    slug: 'photos',
    title: 'Photos & memories',
    sub: 'Upload photos with captions. These will be shown on your memorial portal and shared with loved ones after you pass.',
    icon: 'photo',
    saveLabel: 'Save photo',
    addAnotherLabel: 'Add another photo',
    savedTitle: 'Saved photos',
    fields: [
      { type: 'file', id: 'file', label: 'Photo', accept: 'image/*', title: 'Tap to choose a photo', sub: 'JPG, PNG, HEIC — up to 20 MB' },
      { type: 'text', id: 'caption', label: 'Caption or title', placeholder: 'e.g. Our last family Christmas, 2023', required: true },
      { type: 'textarea', id: 'memory', label: 'Memory or story (optional)', placeholder: 'Share the story behind this photo — who is in it, where it was taken, why it matters to you.' },
    ],
    summary: v => ({ title: v.caption || v.file || 'Photo', meta: v.file || 'Photo' }),
  },
  'voice-video': {
    slug: 'voice-video',
    title: 'Voice & video messages',
    sub: 'Upload a voice or video recording. Deliver it to named recipients after you pass, or mark it for your memorial portal.',
    icon: 'voice',
    saveLabel: 'Save message',
    addAnotherLabel: 'Add another message',
    savedTitle: 'Saved messages',
    fields: [
      { type: 'file', id: 'file', label: 'Recording', accept: 'audio/*,video/*', title: 'Tap to upload audio or video', sub: 'MP3, M4A, MP4, MOV — up to 500 MB', hint: 'You can record a voice memo on your phone and upload it here.' },
      { type: 'text', id: 'title', label: 'Title or label', placeholder: 'e.g. A message for Maria on her wedding day', required: true },
      { type: 'select', id: 'type', label: 'Type', placeholder: 'Select...', options: ['Voice message', 'Video message'] },
      { type: 'text', id: 'recipient', label: 'Who is this for? (optional)', placeholder: 'e.g. Maria, my grandchildren, everyone' },
      { type: 'textarea', id: 'notes', label: 'Notes', placeholder: 'e.g. Play this at the end of the service / Send to Maria privately when the time feels right.' },
    ],
    summary: v => ({ title: v.title || v.file || 'Recording', meta: [v.type, v.recipient ? `For ${v.recipient}` : ''].filter(Boolean).join(' · ') || 'Saved recording' }),
  },
  music: {
    slug: 'music',
    title: 'Music for your service',
    sub: 'Choose songs for your funeral or memorial. Add notes for whoever is organizing — when each should play, and why it matters.',
    icon: 'music',
    saveLabel: 'Add song',
    addAnotherLabel: 'Add another song',
    savedTitle: 'Your playlist',
    fields: [
      { type: 'text', id: 'title', label: 'Song title', placeholder: 'e.g. Ave Maria, What a Wonderful World, Hallelujah', required: true },
      { type: 'text', id: 'artist', label: 'Artist or composer', placeholder: 'e.g. Louis Armstrong, Leonard Cohen' },
      { type: 'select', id: 'when', label: 'When should it play?', placeholder: 'Select a moment...', options: ['As guests arrive', 'During the processional', 'During the service', 'During a reflection or silent moment', 'During the recessional', 'At the graveside', 'At the reception / wake', 'No specific moment — just include it'] },
      { type: 'textarea', id: 'notes', label: 'Notes for the organizer (optional)', placeholder: 'e.g. This was our wedding song. Please have it played quietly as people arrive.' },
    ],
    summary: v => ({ title: v.artist ? `${v.title} — ${v.artist}` : v.title, meta: v.when || 'No moment specified' }),
  },
  speakers: {
    slug: 'speakers',
    title: 'Speakers & readings',
    sub: "Choose who you'd like to speak at your service — and leave them notes. Add as many people as you'd like.",
    icon: 'speaker',
    saveLabel: 'Add speaker',
    addAnotherLabel: 'Add another speaker',
    savedTitle: 'Your speakers',
    fields: [
      { type: 'text', id: 'name', label: 'Name', placeholder: "e.g. My daughter Maria, Father O'Brien", required: true },
      { type: 'select', id: 'role', label: 'Role', placeholder: 'Select a role...', options: ['Eulogy', 'Reading', 'Poem', 'Prayer', 'Song / performance', 'Tribute or story', 'Officiant', 'Other'] },
      { type: 'textarea', id: 'notes', label: 'Notes for them (optional)', placeholder: "e.g. I'd love her to read the poem. Please keep it light — share the funny stories, not just the kind ones." },
    ],
    summary: v => ({ title: v.name, meta: v.role || 'No role selected' }),
  },
  obituary: {
    slug: 'obituary',
    title: 'Obituary & eulogy',
    sub: 'Write it yourself, or leave key details for someone else to write from. Either way, your words and memories are preserved here.',
    icon: 'file',
    saveLabel: 'Save',
    addAnotherLabel: 'Clear form',
    savedTitle: 'Saved notes',
    fields: [
      { type: 'textarea', id: 'body', label: 'Your obituary or eulogy', rows: 9, placeholder: "Write in your own voice. There's no right or wrong way — even a few sentences is meaningful.", required: true },
      { type: 'text', id: 'reader', label: 'Who should read or deliver this? (optional)', placeholder: 'e.g. My daughter Maria, or the officiant' },
      { type: 'text', id: 'writer', label: 'Who should write this if not you? (optional)', placeholder: 'e.g. My son Patrick — he knows my story best' },
    ],
    summary: v => ({ title: v.reader ? `For ${v.reader}` : 'Obituary / eulogy notes', meta: v.writer ? `Writer: ${v.writer}` : 'Saved in your words' }),
  },
};

export default function RememberSetupClient({ setup }: { setup: SetupConfig }) {
  const storageKey = `mg.remember.${setup.slug}`;
  const [values, setValues] = useState<Record<string, string>>({});
  const [items, setItems] = useState<Array<Record<string, string>>>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    } catch {
      return [];
    }
  });
  const [saved, setSaved] = useState(false);

  function update(id: string, value: string) {
    setValues(v => ({ ...v, [id]: value }));
  }

  function persist(next: Array<Record<string, string>>) {
    setItems(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }

  function save() {
    const required = setup.fields.find(f => 'required' in f && f.required && !values[f.id]?.trim());
    if (required) return;
    const next = [...items, values];
    persist(next);
    setValues({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function remove(index: number) {
    persist(items.filter((_, i) => i !== index));
  }

  return (
    <div className="designed-subpage">
      <Link href="/remember" className="back-link">Back to Remember</Link>
      <div className="portal-page-header">
        <div className="portal-page-header-icon"><SetupIcon name={setup.icon} /></div>
        <div>
          <h1>{setup.title}</h1>
          <p>{setup.sub}</p>
        </div>
      </div>

      <div className="portal-pad">
        {saved && <div className="save-flash show">Saved.</div>}
        {setup.fields.map(field => (
          <SetupField key={field.id} field={field} value={values[field.id] ?? ''} onChange={value => update(field.id, value)} />
        ))}
        <button type="button" className="save-btn" onClick={save}>{setup.saveLabel}</button>
        <button type="button" className="add-another-btn" onClick={() => setValues({})}>+ {setup.addAnotherLabel}</button>
      </div>

      {items.length > 0 && (
        <div className="designed-saved-section remember-saved">
          <h3>{setup.savedTitle}</h3>
          {items.map((item, index) => {
            const summary = setup.summary(item);
            return (
              <div key={`${summary.title}-${index}`} className="saved-pill">
                <div className="pill-icon"><SetupIcon name={setup.icon} small /></div>
                <div className="pill-main">
                  <div className="pill-name">{summary.title}</div>
                  <div className="pill-meta">{summary.meta}</div>
                </div>
                <div className="pill-actions">
                  <button type="button" onClick={() => remove(index)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SetupField({ field, value, onChange }: { field: Field; value: string; onChange: (value: string) => void }) {
  if (field.type === 'file') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <div className="photo-upload-area remember-upload">
          <input type="file" accept={field.accept} onChange={e => onChange(e.target.files?.[0]?.name ?? '')} />
          <div className="upload-icon"><SetupIcon name="photo" small /></div>
          <div className="upload-title">{field.title}</div>
          <div className="upload-sub">{field.sub}</div>
          {value && <div className="upload-chosen">Saved file: {value}</div>}
        </div>
        {field.hint && <p className="field-hint">{field.hint}</p>}
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} required={field.required}>
          <option value="">{field.placeholder ?? 'Select...'}</option>
          {field.options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} required={field.required} rows={field.rows ?? 4} />
        {field.hint && <p className="field-hint">{field.hint}</p>}
      </div>
    );
  }

  return (
    <div className="field">
      <label>{field.label}</label>
      <input type={field.type} value={value} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} required={field.required} />
      {field.hint && <p className="field-hint">{field.hint}</p>}
    </div>
  );
}

function SetupIcon({ name, small = false }: { name: SetupConfig['icon'] | 'photo'; small?: boolean }) {
  const size = small ? 16 : 22;
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: '#c57b57', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'music') return <svg {...common}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>;
  if (name === 'speaker') return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  if (name === 'voice') return <svg {...common}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" /></svg>;
  if (name === 'file') return <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h8M8 9h2" /></svg>;
  return <svg {...common}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
}
