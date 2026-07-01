'use client';

import { useState } from 'react';

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

export default function FinancesClient({ initial, initialCategory }: { initial: FinancialAccount[]; initialCategory?: string }) {
  const [items, setItems] = useState<FinancialAccount[]>(initial);
  const [showForm, setShowForm] = useState(Boolean(initialCategory));
  const [editing, setEditing] = useState<FinancialAccount | null>(null);
  const [form, setForm] = useState({ ...BLANK, category: initialCategory ?? '' });
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
    setSaveError('');
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
    const res = await fetch(`/api/vault/finances/${id}`, { method: 'DELETE' });
    if (res.ok) setItems(prev => prev.filter(x => x.id !== id));
    else alert('Could not remove this account. Please try again.');
    setDeleting(null);
  }

  const grouped = CATEGORIES.map(cat => ({
    ...cat,
    items: items.filter(i => i.category === cat.value),
  })).filter(g => g.items.length > 0);

  return (
    <>
      <h1 className="page-heading">Finances</h1>
      <p className="page-sub">Add every account, policy, and asset your family will need to find. You control how much detail to include.</p>

      <button onClick={openAdd} className="add-btn">+ Add account</button>

      {items.length === 0 && (
        <div className="empty-state">
          <div className="emoji">🏦</div>
          <p>No accounts yet. Add a bank account, insurance policy, or any financial asset your family will need to know about.</p>
        </div>
      )}

      {grouped.map(group => (
        <div key={group.value} style={{ marginBottom: 24 }}>
          <p className="section-label"><span>{group.icon}</span> {group.label}</p>
          {group.items.map(item => (
            <div key={item.id} className="entry-card">
              <div className="entry-card-row">
                <div>
                  <div className="entry-title">
                    {item.institutionName}
                    {item.lastFour && <span style={{ color: '#9a7a6a', fontWeight: 400 }}> ···{item.lastFour}</span>}
                  </div>
                  {item.accountType && <div className="entry-sub">{item.accountType}</div>}
                  {item.whoToCall && <div className="entry-meta">Call: {item.whoToCall}</div>}
                  {item.purposeNotes && <div className="entry-meta">{item.purposeNotes}</div>}
                  {item.paperworkLocation && <div className="entry-meta" style={{ fontStyle: 'italic' }}>📁 {item.paperworkLocation}</div>}
                </div>
                <div className="entry-actions">
                  <button onClick={() => openEdit(item)} className="entry-link-btn">Edit</button>
                  <button onClick={() => remove(item.id)} disabled={deleting === item.id} className="entry-link-btn danger">
                    {deleting === item.id ? '…' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {showForm && (
        <div className="sheet-overlay" onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <form onSubmit={save} className="sheet">
            <div className="sheet-head">
              <h2 className="sheet-title">{editing ? 'Edit account' : 'Add account'}</h2>
              <button type="button" onClick={() => setShowForm(false)} className="sheet-close">✕</button>
            </div>

            <div className="field">
              <label>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                <option value="">Select a category…</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Institution / company name</label>
              <input value={form.institutionName} onChange={e => setForm(f => ({ ...f, institutionName: e.target.value }))}
                placeholder="e.g. Chase Bank, State Farm" required />
            </div>

            <div className="field">
              <label>Account type <span className="opt">(optional)</span></label>
              <input value={form.accountType} onChange={e => setForm(f => ({ ...f, accountType: e.target.value }))}
                placeholder="e.g. Checking, Term life, Roth IRA" />
            </div>

            <div className="field">
              <label>Last 4 digits <span className="opt">(optional — never the full number)</span></label>
              <input value={form.lastFour} onChange={e => setForm(f => ({ ...f, lastFour: e.target.value }))}
                placeholder="e.g. 4821" maxLength={4} />
            </div>

            <div className="field">
              <label>Who to call <span className="opt">(optional)</span></label>
              <input value={form.whoToCall} onChange={e => setForm(f => ({ ...f, whoToCall: e.target.value }))}
                placeholder="e.g. 1-800-432-1000, ask for claims" />
            </div>

            <div className="field">
              <label>Purpose / notes for family <span className="opt">(optional)</span></label>
              <textarea value={form.purposeNotes} onChange={e => setForm(f => ({ ...f, purposeNotes: e.target.value }))}
                placeholder="e.g. This is our main household account. Rent is auto-paid from here." rows={3} />
            </div>

            <div className="field">
              <label>Where to find paperwork <span className="opt">(optional)</span></label>
              <input value={form.paperworkLocation} onChange={e => setForm(f => ({ ...f, paperworkLocation: e.target.value }))}
                placeholder="e.g. Green folder in filing cabinet, top drawer" />
            </div>

            <div className="field">
              <label>Additional notes <span className="opt">(optional)</span></label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Anything else your family should know about this account…" rows={2} />
            </div>

            {saveError && <p className="field-error">{saveError}</p>}
            <button type="submit" disabled={saving} className="save-btn">
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add account'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
