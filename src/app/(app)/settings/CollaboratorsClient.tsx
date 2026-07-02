'use client';

import { useState } from 'react';

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active';
  inviteEmailedAt: Date | string | null;
  acceptedAt: Date | string | null;
};

const MAX = 3;
const BLANK = { name: '', email: '' };

export default function CollaboratorsClient({
  initialItems,
  subjectName,
}: {
  initialItems: Collaborator[];
  subjectName: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const first = subjectName.split(' ')[0];
  const atLimit = items.length >= MAX;

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const res = await fetch('/api/account/collaborators', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const { item } = await res.json();
      setItems(prev => [...prev, item]);
      setForm({ ...BLANK });
      setShowForm(false);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? 'Could not send invitation.');
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm('Remove this person\'s access to this plan?')) return;
    setRemovingId(id);
    const res = await fetch(`/api/account/collaborators/${id}`, { method: 'DELETE' });
    if (res.ok) setItems(prev => prev.filter(c => c.id !== id));
    else alert('Could not remove this person.');
    setRemovingId(null);
  }

  async function resend(id: string) {
    setResendingId(id);
    const res = await fetch(`/api/account/collaborators/${id}/resend`, { method: 'POST' });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error ?? 'Could not resend.');
    }
    setResendingId(null);
  }

  return (
    <>
      <p className="section-label-lg">Family who help manage this plan</p>
      <p style={{ fontSize: '0.84rem', color: '#9a7a6a', margin: '0 0 16px', lineHeight: 1.55 }}>
        Invite a sibling or relative to help build {first}&apos;s plan. They&apos;ll only see this plan on their account — not your personal plan or anything else.
      </p>

      {items.length === 0 && (
        <p style={{ fontSize: '0.84rem', color: '#9a7a6a', marginBottom: 12 }}>
          No relatives invited yet.
        </p>
      )}

      {items.map(c => (
        <div key={c.id} className="entry-card">
          <div className="entry-card-row">
            <div>
              <div className="entry-title">{c.name}</div>
              <div className="entry-meta">{c.email}</div>
              <div style={{ fontSize: '0.75rem', color: c.status === 'active' ? '#2e6b42' : '#c57b57', marginTop: 5, fontWeight: 600 }}>
                {c.status === 'active' ? '✓ Helping manage' : 'Invitation pending'}
              </div>
            </div>
            <div className="entry-actions" style={{ flexDirection: 'column', gap: 6 }}>
              {c.status === 'pending' && (
                <button type="button" className="entry-link-btn" disabled={resendingId === c.id} onClick={() => resend(c.id)}>
                  {resendingId === c.id ? '…' : 'Resend'}
                </button>
              )}
              <button type="button" className="entry-link-btn danger" disabled={removingId === c.id} onClick={() => remove(c.id)}>
                {removingId === c.id ? '…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      ))}

      {atLimit ? (
        <p style={{ fontSize: '0.8rem', color: '#9a7a6a' }}>Maximum of {MAX} relatives. Remove one to invite another.</p>
      ) : (
        <button type="button" className="add-btn" onClick={() => { setShowForm(true); setError(''); }}>
          + Add a relative to help
        </button>
      )}

      {showForm && (
        <div className="sheet-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <form onSubmit={invite} className="sheet">
            <div className="sheet-head">
              <h2 className="sheet-title">Invite a relative</h2>
              <button type="button" onClick={() => setShowForm(false)} className="sheet-close">✕</button>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#9a7a6a', marginBottom: 20, lineHeight: 1.5 }}>
              They&apos;ll get an email to accept. Once in, {first}&apos;s plan appears in their account switcher — nothing else.
            </p>
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Sarah Chen" required />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} type="email" placeholder="sibling@email.com" required />
              <p className="field-hint">They must sign in with this exact email to accept.</p>
            </div>
            {error && <p className="field-error">{error}</p>}
            <button type="submit" disabled={saving} className="save-btn">
              {saving ? 'Sending…' : 'Send invitation'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
