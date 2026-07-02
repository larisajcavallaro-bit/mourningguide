'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SETUPS, type Field, type SetupConfig } from './rememberSetups';

export default function RememberSetupClient({ setupKey }: { setupKey: string }) {
  const setup = SETUPS[setupKey] ?? SETUPS.photos;
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
