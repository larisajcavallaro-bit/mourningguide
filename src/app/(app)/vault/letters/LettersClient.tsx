'use client';

import Link from 'next/link';
import { useState } from 'react';

export type Letter = {
  id: string;
  recipientName: string;
  recipientEmail: string | null;
  body: string;
  releaseTiming: string | null;
  createdAt: Date | string;
};

const BLANK = { recipientName: '', recipientEmail: '', body: '', releaseTiming: 'immediate' };

export default function LettersClient({ initial }: { initial: Letter[] }) {
  const [items, setItems] = useState<Letter[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Letter | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [preview, setPreview] = useState<Letter | null>(null);

  function openAdd() {
    setEditing(null);
    setForm({ ...BLANK });
    setSaveError('');
    setShowForm(true);
  }

  function openEdit(item: Letter) {
    setEditing(item);
    setSaveError('');
    setForm({
      recipientName: item.recipientName,
      recipientEmail: item.recipientEmail ?? '',
      body: item.body,
      releaseTiming: item.releaseTiming ?? 'immediate',
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/vault/letters/${editing.id}` : '/api/vault/letters';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    });
    if (res.ok) {
      const { item } = await res.json();
      setItems(prev => editing
        ? prev.map(x => x.id === item.id ? item : x)
        : [...prev, item]);
      setShowForm(false);
    } else {
      setSaveError('Something went wrong. Please try again.');
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm('Delete this letter? This cannot be undone.')) return;
    setDeleting(id);
    const res = await fetch(`/api/vault/letters/${id}`, { method: 'DELETE' });
    if (res.ok) setItems(prev => prev.filter(x => x.id !== id));
    else alert('Could not delete this letter. Please try again.');
    setDeleting(null);
  }

  return (
    <>
      <div className="designed-subpage">
        <Link href="/remember" className="back-link">Back to Remember</Link>
        <div className="portal-page-header">
          <div className="portal-page-header-icon">{letterIcon()}</div>
          <div>
            <h1>Letters to loved ones</h1>
            <p>Write now — each letter will be delivered privately after you pass. Recipients only need a link, no account required.</p>
          </div>
        </div>

        <div className="portal-pad">
          <button onClick={openAdd} className="add-btn">+ Write a letter</button>

          {items.length === 0 && (
            <div className="empty-state compact">
              <div className="emoji">+</div>
              <p>No letters yet. Write messages to the people you love — to be delivered after you&apos;re gone.</p>
            </div>
          )}

          {items.map(item => (
            <div key={item.id} className="entry-card">
              <div className="entry-card-row">
                <div style={{ flex: 1 }}>
                  <div className="entry-title">To: {item.recipientName}</div>
                  {item.recipientEmail ? (
                    <div className="entry-meta">{item.recipientEmail}</div>
                  ) : (
                    <div className="warn-note" style={{ marginTop: 6 }}>
                      No email — this letter can&apos;t be delivered automatically. Add one so we can send it.
                    </div>
                  )}
                  <div className="entry-sub">{item.body.length > 140 ? item.body.slice(0, 140) + '...' : item.body}</div>
                  <div className="entry-meta" style={{ marginTop: 6 }}>
                    {item.releaseTiming === 'immediate' ? 'Released immediately' : 'Delayed release'}
                  </div>
                </div>
                <div className="entry-actions" style={{ flexDirection: 'column', gap: 6 }}>
                  <button onClick={() => setPreview(item)} className="entry-link-btn">Read</button>
                  <button onClick={() => openEdit(item)} className="entry-link-btn">Edit</button>
                  <button onClick={() => remove(item.id)} disabled={deleting === item.id} className="entry-link-btn danger">
                    {deleting === item.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="sheet-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <form onSubmit={save} className="sheet">
            <div className="sheet-head">
              <h2 className="sheet-title">{editing ? 'Edit letter' : 'Write a letter'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="sheet-close">✕</button>
            </div>

            <div className="field">
              <label>To</label>
              <input value={form.recipientName}
                onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                placeholder="Recipient's name" required />
            </div>

            <div className="field">
              <label>Email <span className="opt">(optional — for delivery)</span></label>
              <input value={form.recipientEmail}
                onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))}
                placeholder="their@email.com" type="email" />
            </div>

            <div className="field">
              <label>Your letter</label>
              <textarea value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Dear…" required rows={10}
                style={{ fontFamily: 'var(--serif)', lineHeight: 1.7 }} />
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label>Release timing</label>
              <div className="delivery-options">
                <label className={`delivery-option ${form.releaseTiming === 'immediate' ? 'selected' : ''}`}>
                  <input type="radio" name="releaseTiming" checked={form.releaseTiming === 'immediate'}
                    onChange={() => setForm(f => ({ ...f, releaseTiming: 'immediate' }))} style={{ display: 'none' }} />
                  <span className="delivery-radio" />
                  <div>
                    <div className="delivery-label">Immediately upon activation</div>
                    <div className="delivery-sub">Delivered as soon as your guide is activated.</div>
                  </div>
                </label>
                <label className={`delivery-option ${form.releaseTiming === 'delayed' ? 'selected' : ''}`}>
                  <input type="radio" name="releaseTiming" checked={form.releaseTiming === 'delayed'}
                    onChange={() => setForm(f => ({ ...f, releaseTiming: 'delayed' }))} style={{ display: 'none' }} />
                  <span className="delivery-radio" />
                  <div>
                    <div className="delivery-label">30 days after activation</div>
                    <div className="delivery-sub">Held back so the recipient isn&apos;t overwhelmed right away.</div>
                  </div>
                </label>
              </div>
            </div>

            {saveError && <p className="field-error" style={{ marginTop: 16 }}>{saveError}</p>}
            <button type="submit" disabled={saving} className="save-btn">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Save letter'}
            </button>
          </form>
        </div>
      )}

      {preview && (
        <div className="sheet-overlay" onClick={e => { if (e.target === e.currentTarget) setPreview(null); }}>
          <div className="sheet" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="sheet-head">
              <div>
                <div style={{ fontSize: '0.78rem', color: '#9a7a6a', marginBottom: 4 }}>Letter to</div>
                <h2 className="sheet-title">{preview.recipientName}</h2>
              </div>
              <button onClick={() => setPreview(null)} className="sheet-close">✕</button>
            </div>
            <div style={{ fontFamily: 'var(--serif)', color: '#2f241f', lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
              {preview.body}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function letterIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
