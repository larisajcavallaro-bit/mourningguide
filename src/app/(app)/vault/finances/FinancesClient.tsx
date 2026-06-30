'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export type FinancialAccount = {
  id: string;
  category: string;
  institutionName: string;
  accountType: string | null;
  lastFour: string | null;
  whoToCall: string | null;
  purposeNotes: string | null;
  paperworkLocation: string | null;
  notes: string | null;
};

const CATEGORIES: { value: string; label: string; icon: string }[] = [
  { value: 'bank', label: 'Bank account', icon: '🏦' },
  { value: 'credit_card', label: 'Credit card', icon: '💳' },
  { value: 'insurance', label: 'Insurance policy', icon: '🛡️' },
  { value: 'investment', label: 'Investment / retirement', icon: '📈' },
  { value: 'property', label: 'Real estate', icon: '🏠' },
  { value: 'vehicle', label: 'Vehicle', icon: '🚗' },
  { value: 'digital', label: 'Digital assets', icon: '💻' },
  { value: 'government', label: 'Government & benefits', icon: '🏛️' },
  { value: 'funeral', label: 'Funeral & final wishes', icon: '🕊️' },
  { value: 'other', label: 'Other', icon: '📁' },
];

const BLANK = {
  category: '', institutionName: '', accountType: '', lastFour: '',
  whoToCall: '', purposeNotes: '', paperworkLocation: '', notes: '',
};

export default function FinancesClient({ initial }: { initial: FinancialAccount[] }) {
  const router = useRouter();
  const [items, setItems] = useState<FinancialAccount[]>(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FinancialAccount | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setForm({ ...BLANK });
    setSaveError('');
    setShowForm(true);
  }

  function openEdit(item: FinancialAccount) {
    setEditing(item);
    setForm({
      category: item.category,
      institutionName: item.institutionName,
      accountType: item.accountType ?? '',
      lastFour: item.lastFour ?? '',
      whoToCall: item.whoToCall ?? '',
      purposeNotes: item.purposeNotes ?? '',
      paperworkLocation: item.paperworkLocation ?? '',
      notes: item.notes ?? '',
    });
    setShowForm(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = editing ? `/api/vault/finances/${editing.id}` : '/api/vault/finances';
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
    if (!confirm('Remove this account?')) return;
    setDeleting(id);
    await fetch(`/api/vault/finances/${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(x => x.id !== id));
    setDeleting(null);
  }

  // Group by category
  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.value),
  })).filter(g => g.items.length > 0);

  return (
    <>
      {/* Add button */}
      <button onClick={openAdd} style={addBtnStyle}>+ Add account</button>

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--mg-light)', marginTop: 48 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🏦</div>
          <p style={{ fontSize: '0.9rem' }}>No accounts yet.</p>
          <p style={{ fontSize: '0.84rem' }}>Add a bank account, insurance policy, or any financial asset your family will need to know about.</p>
        </div>
      )}

      {/* Grouped list */}
      {grouped.map(group => (
        <div key={group.value} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: '1rem' }}>{group.icon}</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--mg-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {group.label}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.items.map(item => (
              <div key={item.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--mg-dark)', fontSize: '0.95rem' }}>
                      {item.institutionName}
                      {item.lastFour && <span style={{ color: 'var(--mg-light)', fontWeight: 400 }}> ···{item.lastFour}</span>}
                    </div>
                    {item.accountType && <div style={{ fontSize: '0.82rem', color: 'var(--mg-mid)', marginTop: 2 }}>{item.accountType}</div>}
                    {item.whoToCall && <div style={{ fontSize: '0.82rem', color: 'var(--mg-light)', marginTop: 4 }}>Call: {item.whoToCall}</div>}
                    {item.purposeNotes && <div style={{ fontSize: '0.82rem', color: 'var(--mg-light)', marginTop: 2 }}>{item.purposeNotes}</div>}
                    {item.paperworkLocation && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--mg-light)', marginTop: 4, fontStyle: 'italic' }}>
                        📁 {item.paperworkLocation}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginLeft: 12 }}>
                    <button onClick={() => openEdit(item)} style={iconBtnStyle}>Edit</button>
                    <button onClick={() => remove(item.id)} disabled={deleting === item.id} style={{ ...iconBtnStyle, color: '#c0392b' }}>
                      {deleting === item.id ? '…' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Slide-up form overlay */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(47,36,31,0.45)', zIndex: 50,
          display: 'flex', alignItems: 'flex-end',
        }} onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <form onSubmit={save} style={{
            background: '#fff', borderRadius: '18px 18px 0 0', padding: '28px 22px 40px',
            width: '100%', maxWidth: 520, margin: '0 auto',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '1.15rem', color: 'var(--mg-dark)' }}>
                {editing ? 'Edit account' : 'Add account'}
              </h2>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--mg-light)', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <label style={labelStyle}>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required style={inputStyle}>
              <option value="">Select a category…</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
            </select>

            <label style={labelStyle}>Institution / company name</label>
            <input value={form.institutionName} onChange={e => setForm(f => ({ ...f, institutionName: e.target.value }))}
              placeholder="e.g. Chase Bank, State Farm" required style={inputStyle} />

            <label style={labelStyle}>Account type <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
            <input value={form.accountType} onChange={e => setForm(f => ({ ...f, accountType: e.target.value }))}
              placeholder="e.g. Checking, Term life, Roth IRA" style={inputStyle} />

            <label style={labelStyle}>Last 4 digits <span style={{ color: 'var(--mg-light)' }}>(optional — never the full number)</span></label>
            <input value={form.lastFour} onChange={e => setForm(f => ({ ...f, lastFour: e.target.value }))}
              placeholder="e.g. 4821" maxLength={4} style={inputStyle} />

            <label style={labelStyle}>Who to call <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
            <input value={form.whoToCall} onChange={e => setForm(f => ({ ...f, whoToCall: e.target.value }))}
              placeholder="e.g. 1-800-432-1000, ask for claims" style={inputStyle} />

            <label style={labelStyle}>Purpose / notes for family <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
            <textarea value={form.purposeNotes} onChange={e => setForm(f => ({ ...f, purposeNotes: e.target.value }))}
              placeholder="e.g. This is our main household account. Rent is auto-paid from here."
              rows={3} style={{ ...inputStyle, resize: 'vertical' }} />

            <label style={labelStyle}>Where to find paperwork <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
            <input value={form.paperworkLocation} onChange={e => setForm(f => ({ ...f, paperworkLocation: e.target.value }))}
              placeholder="e.g. Green folder in filing cabinet, top drawer" style={inputStyle} />

            {saveError && (
              <p style={{ color: '#c0392b', fontSize: '0.84rem', marginBottom: 10 }}>{saveError}</p>
            )}
            <button type="submit" disabled={saving} style={submitStyle}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add account'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const addBtnStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '13px',
  borderRadius: 10, background: 'var(--mg-accent)', color: '#fff',
  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
  marginBottom: 24,
};
const cardStyle: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--mg-border)',
  borderRadius: 12, padding: '14px 16px',
};
const iconBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', color: 'var(--mg-accent)',
  fontSize: '0.82rem', cursor: 'pointer', padding: 0, fontWeight: 500,
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', color: 'var(--mg-mid)',
  fontWeight: 500, marginBottom: 6,
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
  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', border: 'none',
  marginTop: 8,
};
