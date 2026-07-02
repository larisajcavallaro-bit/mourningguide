'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

export type Letter = {
  id: string;
  recipientName: string;
  recipientEmail: string | null;
  subject: string | null;
  body: string;
  releaseTiming: string | null;
  scheduledReleaseAt: Date | string | null;
  createdAt: Date | string;
};

type LetterForm = {
  recipientName: string;
  recipientEmail: string;
  subject: string;
  body: string;
  releaseTiming: 'immediate' | 'date';
  scheduledReleaseAt: string;
};

const BLANK: LetterForm = {
  recipientName: '',
  recipientEmail: '',
  subject: '',
  body: '',
  releaseTiming: 'immediate',
  scheduledReleaseAt: '',
};

export default function LettersClient({ initial }: { initial: Letter[] }) {
  const [items, setItems] = useState<Letter[]>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LetterForm>(BLANK);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [items],
  );

  function setValue<K extends keyof LetterForm>(key: K, value: LetterForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    setEditingId(null);
    setForm(BLANK);
    setSaveError('');
  }

  function editItem(item: Letter) {
    setEditingId(item.id);
    setSaveError('');
    setForm({
      recipientName: item.recipientName,
      recipientEmail: item.recipientEmail ?? '',
      subject: item.subject ?? '',
      body: item.body,
      releaseTiming: item.releaseTiming === 'date' ? 'date' : 'immediate',
      scheduledReleaseAt: item.scheduledReleaseAt ? formatDateInput(item.scheduledReleaseAt) : '',
    });
  }

  async function saveLetter() {
    if (!form.recipientName.trim() || !form.body.trim()) {
      setSaveError('Recipient name and letter body are required.');
      return;
    }
    if (form.releaseTiming === 'date' && !form.scheduledReleaseAt) {
      setSaveError('Choose a delivery date.');
      return;
    }

    setSaving(true);
    setSaveError('');

    const payload = {
      recipientName: form.recipientName,
      recipientEmail: form.recipientEmail,
      subject: form.subject,
      body: form.body,
      releaseTiming: form.releaseTiming,
      scheduledReleaseAt: form.releaseTiming === 'date' ? form.scheduledReleaseAt : null,
    };

    const url = editingId ? `/api/vault/letters/${editingId}` : '/api/vault/letters';
    const method = editingId ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSaveError(data.error ?? 'Something went wrong. Please try again.');
      setSaving(false);
      return;
    }

    const { item } = await res.json();
    setItems((prev) => editingId
      ? prev.map((entry) => (entry.id === item.id ? item : entry))
      : [item, ...prev]);
    resetForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2800);
    setSaving(false);
  }

  async function removeEntry(id: string) {
    if (!confirm('Delete this letter? This cannot be undone.')) return;
    setDeleting(id);
    const res = await fetch(`/api/vault/letters/${id}`, { method: 'DELETE' });
    if (res.ok) setItems((prev) => prev.filter((entry) => entry.id !== id));
    else setSaveError('Could not delete this letter. Please try again.');
    setDeleting(null);
  }

  return (
    <div className="designed-subpage">
      <Link href="/remember" className="back-link">Back to Remember</Link>

      <div className="portal-page-header">
        <div className="portal-page-header-icon">{letterIcon()}</div>
        <div>
          <h1>Letters to loved ones</h1>
          <p>Write now - your letter will be delivered privately after you pass, or on a date you choose. Recipients only need a link, no account required.</p>
        </div>
      </div>

      <div className="portal-pad">
        {saved && <div className="save-flash show">Letter saved.</div>}
        {saveError && <p className="field-error">{saveError}</p>}

        <div className="field">
          <label>To (recipient&apos;s name)</label>
          <input
            type="text"
            value={form.recipientName}
            onChange={(e) => setValue('recipientName', e.target.value)}
            placeholder="e.g. Maria, Mum, My dear friend James"
          />
        </div>

        <div className="field">
          <label>Recipient&apos;s email address</label>
          <input
            type="email"
            value={form.recipientEmail}
            onChange={(e) => setValue('recipientEmail', e.target.value)}
            placeholder="e.g. maria@example.com"
          />
          <p className="field-hint">This is where the letter will be sent. They won&apos;t receive anything until the delivery time you choose below.</p>
        </div>

        <div className="field">
          <label>Subject <span className="opt">(optional)</span></label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setValue('subject', e.target.value)}
            placeholder="e.g. For you, my darling / A letter from Mum"
          />
        </div>

        <div className="field">
          <label>Your letter</label>
          <textarea
            value={form.body}
            onChange={(e) => setValue('body', e.target.value)}
            placeholder={'Dear Maria,\n\nThere is so much I have wanted to say…'}
            rows={10}
            style={{ fontFamily: 'var(--serif)', lineHeight: 1.7 }}
          />
        </div>

        <hr className="divider" />

        <div className="field">
          <label>When should this be delivered?</label>
          <div className="delivery-options">
            <label className={`delivery-option ${form.releaseTiming === 'immediate' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="releaseTiming"
                checked={form.releaseTiming === 'immediate'}
                onChange={() => setValue('releaseTiming', 'immediate')}
                style={{ display: 'none' }}
              />
              <span className="delivery-radio" />
              <div>
                <div className="delivery-label">When I pass</div>
                <div className="delivery-sub">Sent automatically after your account is verified as deceased by your legacy contact.</div>
              </div>
            </label>

            <label className={`delivery-option ${form.releaseTiming === 'date' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="releaseTiming"
                checked={form.releaseTiming === 'date'}
                onChange={() => setValue('releaseTiming', 'date')}
                style={{ display: 'none' }}
              />
              <span className="delivery-radio" />
              <div style={{ flex: 1 }}>
                <div className="delivery-label">On a specific date</div>
                <div className="delivery-sub">Pick a date - useful for birthdays, anniversaries, or milestones.</div>
                {form.releaseTiming === 'date' && (
                  <input
                    type="date"
                    value={form.scheduledReleaseAt}
                    onChange={(e) => setValue('scheduledReleaseAt', e.target.value)}
                    style={{ marginTop: 10 }}
                  />
                )}
              </div>
            </label>
          </div>
        </div>

        <button type="button" className="save-btn" onClick={saveLetter} disabled={saving}>
          {saving ? 'Saving...' : editingId ? 'Save letter' : 'Save letter'}
        </button>
        <button type="button" className="add-another-btn" onClick={resetForm}>
          + Write another letter
        </button>
      </div>

      {sortedItems.length > 0 && (
        <div className="designed-saved-section remember-saved">
          <h3>Saved letters</h3>
          {sortedItems.map((item) => (
            <div key={item.id} className="saved-pill">
              <div className="pill-icon"><SetupLetterCheck /></div>
              <div className="pill-main">
                <div className="pill-name">{item.subject?.trim() || `To ${item.recipientName}`}</div>
                <div className="pill-meta">
                  {item.releaseTiming === 'date' && item.scheduledReleaseAt
                    ? `Delivers ${formatSavedDate(item.scheduledReleaseAt)}`
                    : 'Delivered when I pass'}
                  {item.recipientEmail ? ` · ${item.recipientEmail}` : ''}
                </div>
              </div>
              <div className="pill-actions">
                <button type="button" onClick={() => editItem(item)}>Edit</button>
                <button type="button" onClick={() => removeEntry(item.id)} disabled={deleting === item.id}>
                  {deleting === item.id ? '...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDateInput(value: Date | string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

function formatSavedDate(value: Date | string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'on the chosen date';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function letterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

function SetupLetterCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
