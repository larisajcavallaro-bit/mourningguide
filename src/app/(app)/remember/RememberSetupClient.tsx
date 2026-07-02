'use client';

import { upload } from '@vercel/blob/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SETUPS, type Field, type SetupConfig } from './rememberSetups';

type RememberItem = {
  id: string;
  values: Record<string, string>;
};

export default function RememberSetupClient({ setupKey }: { setupKey: string }) {
  const setup = SETUPS[setupKey] ?? SETUPS.photos;
  const [values, setValues] = useState<Record<string, string>>({});
  const [items, setItems] = useState<RememberItem[]>([]);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [loading, setLoading] = useState(true);

  function update(id: string, value: string) {
    setValues(v => ({ ...v, [id]: value }));
  }

  useEffect(() => {
    let active = true;
    fetch(`/api/remember/entries?kind=${encodeURIComponent(setup.slug)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ items }) => {
        if (active) setItems(items ?? []);
      })
      .catch(() => {
        if (active) setSaveError('Could not load saved entries. Please refresh and try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [setup.slug]);

  async function save() {
    const required = setup.fields.find(f => 'required' in f && f.required && !values[f.id]?.trim());
    if (required) return;
    setSaving(true);
    setSaveError('');

    let storageKey = '';
    let fileName = '';
    const fileField = setup.fields.find((field): field is Extract<Field, { type: 'file' }> => field.type === 'file');
    const file = fileField ? files[fileField.id] : null;

    try {
      if (file) {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/remember/upload',
        });
        storageKey = blob.url;
        fileName = file.name;
      }

      const payload = buildPayload(setup.slug, values, storageKey, fileName);
      const res = await fetch('/api/remember/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('save failed');
      const { item } = await res.json();
      setItems(prev => [item, ...prev]);
      setValues({});
      setFiles({});
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaveError('Could not save this entry. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/remember/entries/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      setSaveError('Could not remove this entry. Please try again.');
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
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
        {loading && <p className="portal-muted">Loading saved entries...</p>}
        {saveError && <p className="field-error">{saveError}</p>}
        {setup.fields.map(field => (
          <SetupField
            key={field.id}
            field={field}
            value={values[field.id] ?? ''}
            onChange={value => update(field.id, value)}
            onFileSelect={(file) => {
              if (field.type === 'file') {
                setFiles(prev => ({ ...prev, [field.id]: file }));
                update(field.id, file?.name ?? '');
              }
            }}
          />
        ))}
        <button type="button" className="save-btn" onClick={save} disabled={saving}>{saving ? 'Saving...' : setup.saveLabel}</button>
        <button type="button" className="add-another-btn" onClick={() => setValues({})}>+ {setup.addAnotherLabel}</button>
      </div>

      {items.length > 0 && (
        <div className="designed-saved-section remember-saved">
          <h3>{setup.savedTitle}</h3>
          {items.map((item) => {
            const summary = setup.summary(item.values);
            return (
              <div key={item.id} className="saved-pill">
                <div className="pill-icon"><SetupIcon name={setup.icon} small /></div>
                <div className="pill-main">
                  <div className="pill-name">{summary.title}</div>
                  <div className="pill-meta">{summary.meta}</div>
                </div>
                <div className="pill-actions">
                  <button type="button" onClick={() => remove(item.id)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function buildPayload(kind: string, values: Record<string, string>, storageKey: string, fileName: string) {
  return {
    kind,
    storageKey: storageKey || undefined,
    fileName: fileName || undefined,
    title: values.caption || values.title || values.name || (kind === 'obituary' ? 'Obituary / eulogy notes' : ''),
    recipient: values.recipient || values.reader || '',
    deliveryTarget: kind === 'photos' ? 'portal' : values.recipient ? 'private' : 'both',
    body: values.memory || values.notes || values.body || '',
    values,
  };
}

function SetupField({
  field,
  value,
  onChange,
  onFileSelect,
}: {
  field: Field;
  value: string;
  onChange: (value: string) => void;
  onFileSelect: (file: File | null) => void;
}) {
  if (field.type === 'file') {
    return (
      <div className="field">
        <label>{field.label}</label>
        <div className="photo-upload-area remember-upload">
          <input type="file" accept={field.accept} onChange={e => onFileSelect(e.target.files?.[0] ?? null)} />
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
