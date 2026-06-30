'use client';

import { useState } from 'react';

export type Letter = {
  id: string;
  recipientName: string;
  recipientEmail: string | null;
  body: string;
  releaseTiming: string | null;
  createdAt: string;
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
    await fetch(`/api/vault/letters/${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(x => x.id !== id));
    setDeleting(null);
  }

  return (
    <>
      <button onClick={openAdd} style={addBtnStyle}>+ Write a letter</button>

      {items.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--mg-light)', marginTop: 48 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>✉️</div>
          <p style={{ fontSize: '0.9rem' }}>No letters yet.</p>
          <p style={{ fontSize: '0.84rem', lineHeight: 1.5 }}>
            Write messages to the people you love — to be delivered after you're gone. To your partner, your kids, a best friend.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(item => (
          <div key={item.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--mg-dark)', fontSize: '0.95rem' }}>
                  To: {item.recipientName}
                </div>
                {item.recipientEmail && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--mg-light)', marginTop: 2 }}>{item.recipientEmail}</div>
                )}
                <div style={{ fontSize: '0.82rem', color: 'var(--mg-mid)', marginTop: 6, lineHeight: 1.5 }}>
                  {item.body.length > 140 ? item.body.slice(0, 140) + '…' : item.body}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--mg-light)', marginTop: 8 }}>
                  {item.releaseTiming === 'immediate' ? '🔓 Released immediately' : '⏳ Delayed release'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 12, flexShrink: 0 }}>
                <button onClick={() => setPreview(item)} style={iconBtnStyle}>Read</button>
                <button onClick={() => openEdit(item)} style={iconBtnStyle}>Edit</button>
                <button onClick={() => remove(item.id)} disabled={deleting === item.id}
                  style={{ ...iconBtnStyle, color: '#c0392b' }}>
                  {deleting === item.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write/Edit form */}
      {showForm && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <form onSubmit={save} style={sheetStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={sheetHeadStyle}>{editing ? 'Edit letter' : 'Write a letter'}</h2>
              <button type="button" onClick={() => setShowForm(false)} style={closeBtn}>✕</button>
            </div>

            <label style={labelStyle}>To</label>
            <input value={form.recipientName}
              onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
              placeholder="Recipient's name" required style={inputStyle} />

            <label style={labelStyle}>Email <span style={{ color: 'var(--mg-light)' }}>(optional — for delivery)</span></label>
            <input value={form.recipientEmail}
              onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))}
              placeholder="their@email.com" type="email" style={inputStyle} />

            <label style={labelStyle}>Your letter</label>
            <textarea value={form.body}
              onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              placeholder="Dear…" required rows={10}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Georgia, serif', lineHeight: 1.7 }} />

            <label style={labelStyle}>Release timing</label>
            <select value={form.releaseTiming}
              onChange={e => setForm(f => ({ ...f, releaseTiming: e.target.value }))}
              style={inputStyle}>
              <option value="immediate">Immediately upon activation</option>
              <option value="delayed">30 days after activation</option>
            </select>

            {saveError && (
              <p style={{ color: '#c0392b', fontSize: '0.84rem', marginBottom: 10 }}>{saveError}</p>
            )}
            <button type="submit" disabled={saving} style={submitStyle}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Save letter'}
            </button>
          </form>
        </div>
      )}

      {/* Read preview */}
      {preview && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setPreview(null); }}>
          <div style={{ ...sheetStyle, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--mg-light)', marginBottom: 4 }}>Letter to</div>
                <h2 style={sheetHeadStyle}>{preview.recipientName}</h2>
              </div>
              <button onClick={() => setPreview(null)} style={closeBtn}>✕</button>
            </div>
            <div style={{
              fontFamily: 'Georgia, serif', color: 'var(--mg-dark)',
              lineHeight: 1.8, fontSize: '1rem', whiteSpace: 'pre-wrap',
            }}>
              {preview.body}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const addBtnStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '13px',
  borderRadius: 10, background: 'var(--mg-accent)', color: '#fff',
  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', border: 'none', marginBottom: 24,
};
const cardStyle: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--mg-border)', borderRadius: 12, padding: '16px',
};
const iconBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--mg-accent)',
  fontSize: '0.82rem', cursor: 'pointer', padding: 0, fontWeight: 500,
};
const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(47,36,31,0.45)', zIndex: 50,
  display: 'flex', alignItems: 'flex-end',
};
const sheetStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '18px 18px 0 0', padding: '28px 22px 40px',
  width: '100%', maxWidth: 520, margin: '0 auto',
};
const sheetHeadStyle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.15rem', color: 'var(--mg-dark)',
};
const closeBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--mg-light)', fontSize: '1.2rem', cursor: 'pointer',
};
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
  display: 'block', width: '100%', padding: '13px',
  borderRadius: 10, background: 'var(--mg-accent)', color: '#fff',
  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', border: 'none', marginTop: 8,
};
