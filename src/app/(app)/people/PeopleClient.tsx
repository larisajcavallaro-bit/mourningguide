'use client';

import { useState } from 'react';

export type LegacyContact = {
  id: string; name: string; email: string | null; phone: string | null;
  inviteEmailedAt: Date | string | null;
};
export type NotificationContact = {
  id: string; name: string; email: string | null; phone: string | null;
  relationship: string | null; notifyPhase: string | null;
};

const MAX_LEGACY = 3;

const NOTIFY_PHASES = [
  { value: 'inner_circle', label: 'Inner circle — notify first' },
  { value: 'close_family', label: 'Close family' },
  { value: 'community', label: 'Community / friends' },
  { value: 'financial_only', label: 'Financial contacts only' },
  { value: 'manual', label: 'Notify manually' },
];

const LEGACY_BLANK = { name: '', email: '', phone: '' };
const CONTACT_BLANK = { name: '', email: '', phone: '', relationship: '', notifyPhase: 'manual' };

export default function PeopleClient({
  initialLegacy, initialContacts,
}: { initialLegacy: LegacyContact[]; initialContacts: NotificationContact[] }) {
  const [legacyList, setLegacyList] = useState<LegacyContact[]>(initialLegacy);
  const [showLegacyForm, setShowLegacyForm] = useState(false);
  const [editingLegacy, setEditingLegacy] = useState<LegacyContact | null>(null);
  const [legacyForm, setLegacyForm] = useState({ ...LEGACY_BLANK });
  const [savingLegacy, setSavingLegacy] = useState(false);
  const [legacyError, setLegacyError] = useState('');
  const [deletingLegacy, setDeletingLegacy] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendMsg, setResendMsg] = useState<{ id: string; text: string } | null>(null);

  function openAddLegacy() {
    setEditingLegacy(null);
    setLegacyForm({ ...LEGACY_BLANK });
    setLegacyError('');
    setShowLegacyForm(true);
  }

  function openEditLegacy(c: LegacyContact) {
    setEditingLegacy(c);
    setLegacyForm({ name: c.name, email: c.email ?? '', phone: c.phone ?? '' });
    setLegacyError('');
    setShowLegacyForm(true);
  }

  async function saveLegacy(e: React.FormEvent) {
    e.preventDefault();
    setSavingLegacy(true);
    setLegacyError('');
    const url = editingLegacy ? `/api/people/legacy-contacts/${editingLegacy.id}` : '/api/people/legacy-contacts';
    const method = editingLegacy ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(legacyForm),
    });
    if (res.ok) {
      const { item } = await res.json();
      setLegacyList(prev => editingLegacy
        ? prev.map(c => c.id === item.id ? item : c)
        : [...prev, item]);
      setShowLegacyForm(false);
    } else {
      const d = await res.json().catch(() => ({}));
      setLegacyError(d.error ?? 'Something went wrong. Please try again.');
    }
    setSavingLegacy(false);
  }

  async function removeLegacy(id: string) {
    if (!confirm('Remove this legacy contact?')) return;
    setDeletingLegacy(id);
    const res = await fetch(`/api/people/legacy-contacts/${id}`, { method: 'DELETE' });
    if (res.ok) setLegacyList(prev => prev.filter(c => c.id !== id));
    else alert('Could not remove this contact. Please try again.');
    setDeletingLegacy(null);
  }

  async function resendInvitation(id: string) {
    setResendingId(id);
    setResendMsg(null);
    const res = await fetch(`/api/people/legacy-contacts/${id}/resend`, { method: 'POST' });
    if (res.ok) setResendMsg({ id, text: '✓ Invitation sent' });
    else {
      const d = await res.json().catch(() => ({}));
      setResendMsg({ id, text: d.error ?? 'Could not send. Please try again.' });
    }
    setResendingId(null);
    setTimeout(() => setResendMsg(null), 4000);
  }

  const [contacts, setContacts] = useState<NotificationContact[]>(initialContacts);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState<NotificationContact | null>(null);
  const [contactForm, setContactForm] = useState({ ...CONTACT_BLANK });
  const [savingContact, setSavingContact] = useState(false);
  const [contactError, setContactError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  function openEditContact(c: NotificationContact) {
    setEditingContact(c);
    setContactForm({
      name: c.name, email: c.email ?? '', phone: c.phone ?? '',
      relationship: c.relationship ?? '', notifyPhase: c.notifyPhase ?? 'manual',
    });
    setContactError('');
    setShowContactForm(true);
  }

  async function saveContact(e: React.FormEvent) {
    e.preventDefault();
    setSavingContact(true);
    const url = editingContact ? `/api/people/contacts/${editingContact.id}` : '/api/people/contacts';
    const method = editingContact ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm),
    });
    if (res.ok) {
      const { item } = await res.json();
      setContacts(prev => editingContact
        ? prev.map(c => c.id === item.id ? item : c)
        : [...prev, item]);
      setContactForm({ ...CONTACT_BLANK });
      setEditingContact(null);
      setShowContactForm(false);
      setContactError('');
    } else {
      setContactError('Something went wrong. Please try again.');
    }
    setSavingContact(false);
  }

  async function removeContact(id: string) {
    if (!confirm('Remove this person?')) return;
    setDeleting(id);
    const res = await fetch(`/api/people/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) setContacts(prev => prev.filter(c => c.id !== id));
    else alert('Could not remove this person. Please try again.');
    setDeleting(null);
  }

  const atLimit = legacyList.length >= MAX_LEGACY;

  return (
    <>
      <h1 className="page-heading" data-walkthrough="walkthrough-people-heading">People</h1>
      <p className="page-sub">Choose who activates your guide and who gets notified. Two distinct roles — each with a clear job.</p>

      <p className="section-label-lg">The two roles</p>
      <div className="role-grid">
        <div className="role-card">
          <div className="role-name">Legacy contacts</div>
          <div className="role-desc">Up to 3 people you trust — any one of them can independently activate your guide. We recommend more than one, in case a single contact is unreachable when the time comes.</div>
        </div>
        <div className="role-card">
          <div className="role-name">Notify list</div>
          <div className="role-desc">Friends, family, or colleagues who receive a gentle notification once your guide is activated. No account needed.</div>
        </div>
      </div>

      <p className="section-label-lg">How activation works</p>
      <div className="how-card">
        <div className="how-row">
          <div className="how-num">1</div>
          <div className="how-text"><strong>Any one legacy contact opens their private link</strong><span>When you pass, whichever legacy contact is reachable confirms using their own link. They can see everything you prepared right away.</span></div>
        </div>
        <div className="how-row">
          <div className="how-num">2</div>
          <div className="how-text"><strong>We wait 24 hours before contacting anyone</strong><span>This protects against mistakes. If it was activated in error, they can cancel — nothing will have been sent.</span></div>
        </div>
        <div className="how-row">
          <div className="how-num">3</div>
          <div className="how-text"><strong>Your letters and wishes are released</strong><span>Letters reach their recipients, and your memorial portal can go live.</span></div>
        </div>
        <div className="how-row">
          <div className="how-num">4</div>
          <div className="how-text"><strong>Your notify list is told, gently and in order</strong><span>Everyone you listed receives a caring note — phased so no one is overwhelmed at once.</span></div>
        </div>
      </div>

      {/* Legacy contacts */}
      <p className="section-label-lg">
        Legacy contacts <span style={{ color: '#9a7a6a', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>({legacyList.length} of {MAX_LEGACY})</span>
      </p>

      {legacyList.length === 0 && (
        <p style={{ fontSize: '0.84rem', color: '#9a7a6a', marginBottom: 12 }}>
          No legacy contacts yet. Add at least one person you trust to activate your guide.
        </p>
      )}

      {legacyList.map(legacy => (
        <div key={legacy.id} className="entry-card">
          <div className="entry-card-row">
            <div>
              <div className="entry-title">{legacy.name}</div>
              {legacy.email && <div className="entry-meta">{legacy.email}</div>}
              {legacy.phone && <div className="entry-meta">{legacy.phone}</div>}
            </div>
            <div className="entry-actions" style={{ flexDirection: 'column', gap: 6 }}>
              <button onClick={() => openEditLegacy(legacy)} className="entry-link-btn">Edit</button>
              {legacy.email && (
                <button onClick={() => resendInvitation(legacy.id)} disabled={resendingId === legacy.id} className="entry-link-btn">
                  {resendingId === legacy.id ? '…' : 'Resend invite'}
                </button>
              )}
              <button onClick={() => removeLegacy(legacy.id)} disabled={deletingLegacy === legacy.id} className="entry-link-btn danger">
                {deletingLegacy === legacy.id ? '…' : 'Remove'}
              </button>
            </div>
          </div>
          {!legacy.email && (
            <div className="warn-note">
              No email on file. Add one so we can send {legacy.name.split(' ')[0]} their activation link —
              without it, they can&apos;t activate your guide when the time comes.
            </div>
          )}
          {resendMsg?.id === legacy.id && (
            <div style={{ marginTop: 10, fontSize: '0.8rem', color: resendMsg.text.startsWith('✓') ? '#2e6b42' : '#b0402e' }}>
              {resendMsg.text}
            </div>
          )}
        </div>
      ))}

      {atLimit ? (
        <p style={{ fontSize: '0.8rem', color: '#9a7a6a', marginTop: 4 }}>
          You&apos;ve added the maximum of {MAX_LEGACY} legacy contacts. Remove one to add another.
        </p>
      ) : (
        <button onClick={openAddLegacy} className="add-btn" style={{ marginBottom: 0 }}>
          + Add legacy contact {legacyList.length > 0 ? '(backup)' : ''}
        </button>
      )}

      {/* Notify list */}
      <p className="section-label-lg">People to notify</p>
      <button onClick={() => { setEditingContact(null); setContactForm({ ...CONTACT_BLANK }); setContactError(''); setShowContactForm(true); }}
        className="add-btn" style={{ marginBottom: contacts.length ? 16 : 0 }}>
        + Add person
      </button>

      {contacts.length === 0 && (
        <p style={{ fontSize: '0.84rem', color: '#9a7a6a', marginTop: 4 }}>
          No contacts yet. Add the people your family will need to notify.
        </p>
      )}

      {contacts.map(c => (
        <div key={c.id} className="entry-card">
          <div className="entry-card-row">
            <div>
              <div className="entry-title">{c.name}</div>
              {c.relationship && <div className="entry-sub">{c.relationship}</div>}
              {c.email && <div className="entry-meta">{c.email}</div>}
              {c.phone && <div className="entry-meta">{c.phone}</div>}
              {c.notifyPhase && c.notifyPhase !== 'manual' && (
                <div style={{ fontSize: '0.75rem', color: '#c57b57', marginTop: 5, fontWeight: 600 }}>
                  {NOTIFY_PHASES.find(p => p.value === c.notifyPhase)?.label}
                </div>
              )}
            </div>
            <div className="entry-actions" style={{ flexDirection: 'column', gap: 6 }}>
              <button onClick={() => openEditContact(c)} className="entry-link-btn">Edit</button>
              <button onClick={() => removeContact(c.id)} disabled={deleting === c.id} className="entry-link-btn danger">
                {deleting === c.id ? '…' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Legacy contact form */}
      {showLegacyForm && (
        <div className="sheet-overlay" onClick={e => { if (e.target === e.currentTarget) setShowLegacyForm(false); }}>
          <form onSubmit={saveLegacy} className="sheet">
            <div className="sheet-head">
              <h2 className="sheet-title">{editingLegacy ? 'Edit legacy contact' : 'Add legacy contact'}</h2>
              <button type="button" onClick={() => setShowLegacyForm(false)} className="sheet-close">✕</button>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#9a7a6a', marginBottom: 20, lineHeight: 1.5 }}>
              This person can activate your guide and coordinates your wishes. Choose someone you trust completely — a spouse, adult child, or close friend. Adding more than one gives your family a backup in case someone isn&apos;t reachable.
            </p>
            <div className="field">
              <label>Full name</label>
              <input value={legacyForm.name} onChange={e => setLegacyForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Sarah Chen" required />
            </div>
            <div className="field">
              <label>Email <span style={{ color: '#c57b57' }}>(needed to activate your guide)</span></label>
              <input value={legacyForm.email} onChange={e => setLegacyForm(f => ({ ...f, email: e.target.value }))}
                type="email" placeholder="sarah@email.com" />
              <p className="field-hint">We email this person their own private activation link. Without an email address, they won&apos;t be able to activate your guide.</p>
            </div>
            <div className="field">
              <label>Phone <span className="opt">(optional)</span></label>
              <input value={legacyForm.phone} onChange={e => setLegacyForm(f => ({ ...f, phone: e.target.value }))}
                type="tel" placeholder="(555) 000-0000" />
            </div>
            {legacyError && <p className="field-error">{legacyError}</p>}
            <button type="submit" disabled={savingLegacy} className="save-btn">
              {savingLegacy ? 'Saving…' : editingLegacy ? 'Save changes' : 'Add legacy contact'}
            </button>
          </form>
        </div>
      )}

      {/* Add/edit notify contact */}
      {showContactForm && (
        <div className="sheet-overlay" onClick={e => { if (e.target === e.currentTarget) setShowContactForm(false); }}>
          <form onSubmit={saveContact} className="sheet">
            <div className="sheet-head">
              <h2 className="sheet-title">{editingContact ? 'Edit person' : 'Add person'}</h2>
              <button type="button" onClick={() => setShowContactForm(false)} className="sheet-close">✕</button>
            </div>
            <div className="field">
              <label>Full name</label>
              <input value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. James Miller" required />
            </div>
            <div className="field">
              <label>Relationship <span className="opt">(optional)</span></label>
              <input value={contactForm.relationship} onChange={e => setContactForm(f => ({ ...f, relationship: e.target.value }))}
                placeholder="e.g. Brother, Attorney, Accountant" />
            </div>
            <div className="field">
              <label>Email <span className="opt">(optional)</span></label>
              <input value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))} type="email" />
            </div>
            <div className="field">
              <label>Phone <span className="opt">(optional)</span></label>
              <input value={contactForm.phone} onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))} type="tel" />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Notify when</label>
              <select value={contactForm.notifyPhase} onChange={e => setContactForm(f => ({ ...f, notifyPhase: e.target.value }))}>
                {NOTIFY_PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            {contactError && <p className="field-error" style={{ marginTop: 16 }}>{contactError}</p>}
            <button type="submit" disabled={savingContact} className="save-btn">
              {savingContact ? 'Saving…' : editingContact ? 'Save changes' : 'Add person'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
