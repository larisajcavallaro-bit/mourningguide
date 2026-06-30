'use client';

import { useState } from 'react';

export type LegacyContact = { id: string; name: string; email: string | null; phone: string | null } | null;
export type NotificationContact = {
  id: string; name: string; email: string | null; phone: string | null;
  relationship: string | null; notifyPhase: string | null;
};

const NOTIFY_PHASES = [
  { value: 'inner_circle', label: 'Inner circle — notify first' },
  { value: 'close_family', label: 'Close family' },
  { value: 'community', label: 'Community / friends' },
  { value: 'financial_only', label: 'Financial contacts only' },
  { value: 'manual', label: 'Notify manually' },
];

const CONTACT_BLANK = { name: '', email: '', phone: '', relationship: '', notifyPhase: 'manual' };

export default function PeopleClient({
  initialLegacy, initialContacts,
}: { initialLegacy: LegacyContact; initialContacts: NotificationContact[] }) {
  const [legacy, setLegacy] = useState<LegacyContact>(initialLegacy);
  const [legacyForm, setLegacyForm] = useState({
    name: initialLegacy?.name ?? '',
    email: initialLegacy?.email ?? '',
    phone: initialLegacy?.phone ?? '',
  });
  const [showLegacyForm, setShowLegacyForm] = useState(false);
  const [savingLegacy, setSavingLegacy] = useState(false);
  const [legacyError, setLegacyError] = useState('');

  const [contacts, setContacts] = useState<NotificationContact[]>(initialContacts);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ ...CONTACT_BLANK });
  const [savingContact, setSavingContact] = useState(false);
  const [contactError, setContactError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  async function saveLegacy(e: React.FormEvent) {
    e.preventDefault();
    setSavingLegacy(true);
    const res = await fetch('/api/people/legacy-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(legacyForm),
    });
    if (res.ok) {
      const { item } = await res.json();
      setLegacy(item);
      setShowLegacyForm(false);
      setLegacyError('');
    } else {
      setLegacyError('Something went wrong. Please try again.');
    }
    setSavingLegacy(false);
  }

  async function saveContact(e: React.FormEvent) {
    e.preventDefault();
    setSavingContact(true);
    const res = await fetch('/api/people/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm),
    });
    if (res.ok) {
      const { item } = await res.json();
      setContacts(prev => [...prev, item]);
      setContactForm({ ...CONTACT_BLANK });
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
    await fetch(`/api/people/contacts/${id}`, { method: 'DELETE' });
    setContacts(prev => prev.filter(c => c.id !== id));
    setDeleting(null);
  }

  return (
    <>
      {/* Legacy contact section */}
      <section style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <h2 style={sectionTitle}>Legacy contact</h2>
            <p style={sectionSub}>The one person who activates your guide and coordinates everything.</p>
          </div>
        </div>

        {legacy ? (
          <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--mg-dark)' }}>{legacy.name}</div>
              {legacy.email && <div style={{ fontSize: '0.83rem', color: 'var(--mg-light)', marginTop: 2 }}>{legacy.email}</div>}
              {legacy.phone && <div style={{ fontSize: '0.83rem', color: 'var(--mg-light)', marginTop: 2 }}>{legacy.phone}</div>}
            </div>
            <button onClick={() => {
              setLegacyForm({ name: legacy!.name, email: legacy!.email ?? '', phone: legacy!.phone ?? '' });
              setShowLegacyForm(true);
            }} style={iconBtnStyle}>Edit</button>
          </div>
        ) : (
          <button onClick={() => { setLegacyForm({ name: '', email: '', phone: '' }); setShowLegacyForm(true); }}
            style={addBtnStyle}>
            + Add legacy contact
          </button>
        )}
      </section>

      {/* Notification contacts section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <h2 style={sectionTitle}>People to notify</h2>
            <p style={sectionSub}>Family, friends, and financial contacts to reach out to.</p>
          </div>
        </div>

        <button onClick={() => { setContactForm({ ...CONTACT_BLANK }); setShowContactForm(true); }}
          style={{ ...addBtnStyle, marginBottom: contacts.length ? 16 : 0 }}>
          + Add person
        </button>

        {contacts.length === 0 && (
          <p style={{ fontSize: '0.84rem', color: 'var(--mg-light)', marginTop: 12 }}>
            No contacts yet. Add the people your family will need to notify.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {contacts.map(c => (
            <div key={c.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--mg-dark)', fontSize: '0.93rem' }}>{c.name}</div>
                {c.relationship && <div style={{ fontSize: '0.8rem', color: 'var(--mg-mid)', marginTop: 2 }}>{c.relationship}</div>}
                {c.email && <div style={{ fontSize: '0.8rem', color: 'var(--mg-light)', marginTop: 2 }}>{c.email}</div>}
                {c.phone && <div style={{ fontSize: '0.8rem', color: 'var(--mg-light)' }}>{c.phone}</div>}
                {c.notifyPhase && c.notifyPhase !== 'manual' && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--mg-accent)', marginTop: 5 }}>
                    {NOTIFY_PHASES.find(p => p.value === c.notifyPhase)?.label}
                  </div>
                )}
              </div>
              <button onClick={() => removeContact(c.id)} disabled={deleting === c.id}
                style={{ ...iconBtnStyle, color: '#c0392b', flexShrink: 0, marginLeft: 12 }}>
                {deleting === c.id ? '…' : 'Remove'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Legacy contact form */}
      {showLegacyForm && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowLegacyForm(false); }}>
          <form onSubmit={saveLegacy} style={sheetStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={sheetHeadStyle}>Legacy contact</h2>
              <button type="button" onClick={() => setShowLegacyForm(false)} style={closeBtn}>✕</button>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'var(--mg-light)', marginBottom: 20, lineHeight: 1.5 }}>
              This person activates your guide and coordinates your wishes. Choose someone you trust completely — a spouse, adult child, or close friend.
            </p>
            <label style={labelStyle}>Full name</label>
            <input value={legacyForm.name} onChange={e => setLegacyForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Sarah Chen" required style={inputStyle} />
            <label style={labelStyle}>Email</label>
            <input value={legacyForm.email} onChange={e => setLegacyForm(f => ({ ...f, email: e.target.value }))}
              type="email" placeholder="sarah@email.com" style={inputStyle} />
            <label style={labelStyle}>Phone</label>
            <input value={legacyForm.phone} onChange={e => setLegacyForm(f => ({ ...f, phone: e.target.value }))}
              type="tel" placeholder="(555) 000-0000" style={inputStyle} />
            {legacyError && <p style={{ color: '#c0392b', fontSize: '0.84rem', marginBottom: 10 }}>{legacyError}</p>}
            <button type="submit" disabled={savingLegacy} style={submitStyle}>
              {savingLegacy ? 'Saving…' : 'Save legacy contact'}
            </button>
          </form>
        </div>
      )}

      {/* Add contact form */}
      {showContactForm && (
        <div style={overlayStyle} onClick={e => { if (e.target === e.currentTarget) setShowContactForm(false); }}>
          <form onSubmit={saveContact} style={sheetStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={sheetHeadStyle}>Add person</h2>
              <button type="button" onClick={() => setShowContactForm(false)} style={closeBtn}>✕</button>
            </div>
            <label style={labelStyle}>Full name</label>
            <input value={contactForm.name} onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. James Miller" required style={inputStyle} />
            <label style={labelStyle}>Relationship <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
            <input value={contactForm.relationship} onChange={e => setContactForm(f => ({ ...f, relationship: e.target.value }))}
              placeholder="e.g. Brother, Attorney, Accountant" style={inputStyle} />
            <label style={labelStyle}>Email <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
            <input value={contactForm.email} onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
              type="email" style={inputStyle} />
            <label style={labelStyle}>Phone <span style={{ color: 'var(--mg-light)' }}>(optional)</span></label>
            <input value={contactForm.phone} onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
              type="tel" style={inputStyle} />
            <label style={labelStyle}>Notify when</label>
            <select value={contactForm.notifyPhase} onChange={e => setContactForm(f => ({ ...f, notifyPhase: e.target.value }))}
              style={inputStyle}>
              {NOTIFY_PHASES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            {contactError && <p style={{ color: '#c0392b', fontSize: '0.84rem', marginBottom: 10 }}>{contactError}</p>}
            <button type="submit" disabled={savingContact} style={submitStyle}>
              {savingContact ? 'Saving…' : 'Add person'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-playfair), Georgia, serif',
  fontSize: '1rem', color: 'var(--mg-dark)', fontWeight: 600, marginBottom: 2,
};
const sectionSub: React.CSSProperties = { fontSize: '0.82rem', color: 'var(--mg-light)' };
const addBtnStyle: React.CSSProperties = {
  display: 'block', width: '100%', padding: '12px',
  borderRadius: 10, background: 'var(--mg-accent)', color: '#fff',
  fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', border: 'none',
};
const cardStyle: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--mg-border)', borderRadius: 12, padding: '14px 16px',
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
  width: '100%', maxWidth: 520, margin: '0 auto', maxHeight: '90vh', overflowY: 'auto',
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
