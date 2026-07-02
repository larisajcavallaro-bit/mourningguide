'use client';

import Link from 'next/link';
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
  initialLegacy, initialContacts, mode = 'all',
}: { initialLegacy: LegacyContact[]; initialContacts: NotificationContact[]; mode?: 'all' | 'legacy' | 'notify' }) {
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
  const showOverview = mode === 'all';
  const showLegacy = mode === 'all' || mode === 'legacy';
  const showNotify = mode === 'all' || mode === 'notify';

  return (
    <>
      {showOverview ? (
        <>
          <h1 className="page-heading" data-walkthrough="walkthrough-people-heading">People</h1>
          <p className="page-sub">Choose who gets access after you pass, who coordinates everything, and who gets notified. Two distinct roles — each with a clear job.</p>

          <p className="section-label-lg">The two roles</p>
          <div className="role-grid designed-roles">
            <div className="role-card">
              <div className="role-icon">{peopleIcon()}</div>
              <div className="role-name">Legacy contacts</div>
              <span className="role-limit">Up to 3</span>
              <div className="role-desc">People you trust to receive full access to your plan after your passing and coordinate the unlocking process.</div>
              <Link className="role-add-btn" href="/people/successors">Add legacy contact</Link>
            </div>
            <div className="role-card">
              <div className="role-icon">{mailIcon()}</div>
              <div className="role-name">Notify list</div>
              <span className="role-limit">Unlimited</span>
              <div className="role-desc">Friends, family, colleagues, or professionals who should receive a notification when your portal goes live.</div>
              <Link className="role-add-btn" href="/people/notify">Add contact</Link>
            </div>
          </div>
        </>
      ) : (
        <div className="designed-subpage">
          <Link href="/people" className="back-link">Back to People</Link>
          <div className="portal-page-header">
            <div className="portal-page-header-icon">{mode === 'legacy' ? peopleIcon() : mailIcon()}</div>
            <div>
              <h1>{mode === 'legacy' ? 'Legacy contacts' : 'People to notify'}</h1>
              <p>{mode === 'legacy'
                ? 'These people can activate your guide and receive full access after your passing. Add up to three trusted contacts.'
                : 'Add friends, family, colleagues, or professionals who should receive a gentle notification when your portal goes live.'}</p>
            </div>
          </div>
        </div>
      )}

      {showOverview && (
        <>
          <p className="section-label-lg">How activation works</p>
          <div className="how-card">
            <div className="how-row">
              <div className="how-num">1</div>
              <div className="how-text"><strong>A legacy contact opens their private link</strong><span>When you pass, whichever legacy contact is reachable confirms using their own secure link.</span></div>
            </div>
            <div className="how-row">
              <div className="how-num">2</div>
              <div className="how-text"><strong>We wait before contacting anyone</strong><span>This protects against mistakes. If it was activated in error, it can be cancelled before notifications go out.</span></div>
            </div>
            <div className="how-row">
              <div className="how-num">3</div>
              <div className="how-text"><strong>Your letters and wishes are released</strong><span>Letters reach their recipients, your plan is available to legacy contacts, and your portal can go live.</span></div>
            </div>
            <div className="how-row">
              <div className="how-num">4</div>
              <div className="how-text"><strong>Your notify list is told, gently and in order</strong><span>Everyone you listed receives a caring note — phased so no one is overwhelmed at once.</span></div>
            </div>
          </div>
        </>
      )}

      {/* Legacy contacts */}
      {showLegacy && (
        <section className={mode === 'legacy' ? 'portal-pad people-subpage-pad' : undefined}>
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
                      {resendingId === legacy.id ? '...' : 'Resend invite'}
                    </button>
                  )}
                  <button onClick={() => removeLegacy(legacy.id)} disabled={deletingLegacy === legacy.id} className="entry-link-btn danger">
                    {deletingLegacy === legacy.id ? '...' : 'Remove'}
                  </button>
                </div>
              </div>
              {!legacy.email && (
                <div className="warn-note">
                  No email on file. Add one so we can send {legacy.name.split(' ')[0]} their activation link.
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
            <button onClick={openAddLegacy} className="add-btn" style={{ marginBottom: mode === 'legacy' ? 0 : 24 }}>
              + Add legacy contact {legacyList.length > 0 ? '(backup)' : ''}
            </button>
          )}
        </section>
      )}

      {/* Notify list */}
      {showNotify && (
        <section className={mode === 'notify' ? 'portal-pad people-subpage-pad' : undefined}>
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
                    {deleting === c.id ? '...' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

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

function peopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function mailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}
