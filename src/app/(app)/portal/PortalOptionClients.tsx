'use client';

import { useEffect, useState } from 'react';

type ServiceDetails = {
  type: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  parking: string;
  dresscode: string;
  officiant: string;
  reception: boolean;
  receptionVenue: string;
  receptionAddress: string;
  receptionTime: string;
  livestreamUrl: string;
  notes: string;
};

const BLANK_SERVICE: ServiceDetails = {
  type: '',
  date: '',
  time: '',
  venue: '',
  address: '',
  parking: '',
  dresscode: '',
  officiant: '',
  reception: false,
  receptionVenue: '',
  receptionAddress: '',
  receptionTime: '',
  livestreamUrl: '',
  notes: '',
};

const HELP_GROUPS = [
  {
    title: 'Meals and everyday help',
    items: [
      ['mealtrain', 'Meal Train', 'https://www.mealtrain.com/trains/...'],
      ['takethemameal', 'Take Them A Meal', 'https://takethemameal.com/...'],
      ['signupgenius', 'SignUpGenius', 'https://www.signupgenius.com/...'],
      ['lotsahands', 'Lotsa Helping Hands', 'https://lotsahelpinghands.com/...'],
    ],
  },
  {
    title: 'Donations and memorial funds',
    items: [
      ['gofundme', 'GoFundMe', 'https://www.gofundme.com/f/...'],
      ['givebutter', 'Givebutter', 'https://www.givebutter.com/...'],
      ['paypalme', 'PayPal.Me', 'https://paypal.me/...'],
      ['venmo', 'Venmo', 'https://venmo.com/u/...'],
      ['cashapp', 'Cash App', 'https://cash.app/$...'],
      ['everyorg', 'Every.org', 'https://www.every.org/...'],
    ],
  },
  {
    title: 'Travel and housing',
    items: [
      ['airbnb', 'Airbnb', 'https://www.airbnb.com/...'],
      ['vrbo', 'VRBO', 'https://www.vrbo.com/...'],
      ['hotelblock', 'Hotel block', 'Hotel name or booking link'],
    ],
  },
];

const GIFTS = [
  ['bears', 'Memory bears', 'Keepsakes made from clothing or fabric.'],
  ['ashes', 'Ashes jewelry', 'Rings, necklaces, or keepsakes containing ashes.'],
  ['candles', 'Memorial candles', 'Candles for services, anniversaries, or visitors.'],
  ['stones', 'Memorial stones', 'Garden stones, markers, or engraved pieces.'],
  ['portrait', 'Custom portrait', 'Painted, illustrated, or printed portraits.'],
  ['fingerprint', 'Fingerprint keepsake', 'Jewelry or keepsakes using a fingerprint.'],
];

export function GallerySettingsClient() {
  const [settings, setSettings] = useSavedState('mg.portal.gallery', {
    captions: true,
    familyUploads: true,
    visitorUploads: false,
  });
  const [saved, setSaved] = useState(false);

  return (
    <PortalForm title="Photo gallery" sub="Choose how photos appear and who can add them after your passing.">
      <SettingRow title="Show captions" desc="Display the story or caption beneath each photo." on={settings.captions} onToggle={() => setSettings({ ...settings, captions: !settings.captions })} />
      <SettingRow title="Allow family to add photos" desc="Legacy contacts can add photos to the memorial page." on={settings.familyUploads} onToggle={() => setSettings({ ...settings, familyUploads: !settings.familyUploads })} />
      <SettingRow title="Allow visitor photo submissions" desc="Visitors can submit photos for review before posting." on={settings.visitorUploads} onToggle={() => setSettings({ ...settings, visitorUploads: !settings.visitorUploads })} />
      <button className="save-btn" onClick={() => flash(setSaved)}>Save gallery settings</button>
      {saved && <div className="save-flash show">Gallery settings saved.</div>}
    </PortalForm>
  );
}

export function GuestbookSettingsClient() {
  const [settings, setSettings] = useSavedState('mg.portal.guestbook', {
    access: 'anyone',
    moderation: true,
    emailAlerts: true,
    privateNotes: false,
  });
  const [saved, setSaved] = useState(false);

  return (
    <PortalForm title="Guestbook" sub="Decide who can leave messages and how memories should be reviewed.">
      <p className="section-label-lg">Who can sign</p>
      {[
        ['anyone', 'Anyone with the portal link', 'Open to all visitors for the widest reach.'],
        ['family', 'Family only', 'Only legacy contacts and notify-list contacts can leave messages.'],
        ['off', 'Guestbook off', 'No messages section on your portal.'],
      ].map(([value, title, desc]) => (
        <button key={value} type="button" className={`option-card ${settings.access === value ? 'selected' : ''}`} onClick={() => setSettings({ ...settings, access: value })}>
          <span className="option-radio"><span /></span>
          <span><strong>{title}</strong><small>{desc}</small></span>
        </button>
      ))}
      <p className="section-label-lg" style={{ marginTop: 22 }}>Message rules</p>
      <SettingRow title="Review messages before they post" desc="Recommended. Keeps the portal calm and respectful." on={settings.moderation} onToggle={() => setSettings({ ...settings, moderation: !settings.moderation })} />
      <SettingRow title="Email new messages to family" desc="Legacy contacts get a copy when someone leaves a memory." on={settings.emailAlerts} onToggle={() => setSettings({ ...settings, emailAlerts: !settings.emailAlerts })} />
      <SettingRow title="Allow private notes" desc="Visitors can send a note to family without posting publicly." on={settings.privateNotes} onToggle={() => setSettings({ ...settings, privateNotes: !settings.privateNotes })} />
      <button className="save-btn" onClick={() => flash(setSaved)}>Save guestbook settings</button>
      {saved && <div className="save-flash show">Guestbook settings saved.</div>}
    </PortalForm>
  );
}

export function WaysToHelpClient() {
  const [settings, setSettings] = useSavedState<Record<string, { on: boolean; url: string }>>('mg.portal.help', {});
  const [saved, setSaved] = useState(false);

  return (
    <PortalForm title="Ways to help" sub="Add trusted links so visitors know exactly how to support the family.">
      {HELP_GROUPS.map(group => (
        <section key={group.title} style={{ marginBottom: 24 }}>
          <p className="section-label-lg">{group.title}</p>
          {group.items.map(([id, label, placeholder]) => {
            const item = settings[id] ?? { on: false, url: '' };
            return (
              <div className="platform-card" key={id}>
                <SettingRow
                  title={label}
                  desc={item.on ? 'This will be shown on the portal.' : 'Hidden until you turn it on.'}
                  on={item.on}
                  onToggle={() => setSettings({ ...settings, [id]: { ...item, on: !item.on } })}
                />
                {item.on && (
                  <div className="field" style={{ marginBottom: 0 }}>
                    <label>{label} link</label>
                    <input value={item.url} onChange={e => setSettings({ ...settings, [id]: { ...item, url: e.target.value } })} placeholder={placeholder} />
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}
      <button className="save-btn" onClick={() => flash(setSaved)}>Save ways to help</button>
      {saved && <div className="save-flash show">Ways to help saved.</div>}
    </PortalForm>
  );
}

export function ServiceDetailsClient() {
  const [form, setForm] = useState<ServiceDetails>(BLANK_SERVICE);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [gifts, setGifts] = useSavedState<Record<string, { on: boolean; supplier: string; url: string; phone: string; method: string }>>('mg.portal.gifts', {});

  useEffect(() => {
    fetch('/api/vault/wishes')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(({ item }) => {
        if (item) setForm({
          type: item.type ?? '',
          date: item.date ?? '',
          time: item.time ?? '',
          venue: item.venue ?? '',
          address: item.address ?? '',
          parking: item.parking ?? '',
          dresscode: item.dresscode ?? '',
          officiant: item.officiant ?? '',
          reception: item.reception ?? false,
          receptionVenue: item.receptionVenue ?? '',
          receptionAddress: item.receptionAddress ?? '',
          receptionTime: item.receptionTime ?? '',
          livestreamUrl: item.livestreamUrl ?? '',
          notes: item.notes ?? '',
        });
        setLoading(false);
      })
      .catch(() => { setLoadError(true); setLoading(false); });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    const res = await fetch('/api/vault/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    else setSaveError('Something went wrong. Please try again.');
    setSaving(false);
  }

  function f(key: keyof ServiceDetails) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  if (loading) return <p style={{ color: '#9a7a6a' }}>Loading...</p>;
  if (loadError) return <p className="field-error">Couldn&apos;t load service details. Please refresh and try again.</p>;

  return (
    <PortalForm title="Service & gifts" sub="Add funeral home details, service wishes, and optional memorial keepsakes.">
      <form onSubmit={save}>
        <p className="section-label-lg">Funeral home</p>
        <div className="field"><label>Funeral home name</label><input value={form.venue} onChange={f('venue')} placeholder="e.g. Riverside Funeral Home" /></div>
        <div className="field"><label>Address</label><input value={form.address} onChange={f('address')} placeholder="Street, city, state" /></div>
        <div className="field"><label>Phone or contact notes</label><input value={form.parking} onChange={f('parking')} placeholder="Phone number, parking, or arrival notes" /></div>

        <p className="section-label-lg">Service details</p>
        <div className="field">
          <label>Type of service</label>
          <select value={form.type} onChange={f('type')}>
            <option value="">Select...</option>
            {['Traditional funeral service','Graveside service only','Cremation service','Celebration of life','Private family service','No formal service'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field"><label>Date</label><input value={form.date} onChange={f('date')} placeholder="e.g. Saturday, June 14" /></div>
          <div className="field"><label>Time</label><input value={form.time} onChange={f('time')} placeholder="e.g. 2:00 PM" /></div>
        </div>
        <div className="field"><label>Dress code <span className="opt">(optional)</span></label><input value={form.dresscode} onChange={f('dresscode')} placeholder="e.g. Smart casual, no black required" /></div>
        <div className="field"><label>Notes for your legacy contact <span className="opt">(optional)</span></label><textarea value={form.notes} onChange={f('notes')} placeholder="Anything your family should know about the service." /></div>
        {saveError && <p className="field-error">{saveError}</p>}
        <button className="save-btn" disabled={saving}>{saving ? 'Saving...' : saved ? 'Saved' : 'Save service details'}</button>
      </form>

      <p className="section-label-lg" style={{ marginTop: 28 }}>Memorial gifts and keepsakes</p>
      {GIFTS.map(([id, title, desc]) => {
        const gift = gifts[id] ?? { on: false, supplier: '', url: '', phone: '', method: '' };
        return (
          <div className="gift-card" key={id}>
            <SettingRow title={title} desc={desc} on={gift.on} onToggle={() => setGifts({ ...gifts, [id]: { ...gift, on: !gift.on } })} />
            {gift.on && (
              <div className="gift-fields">
                <div className="field"><label>Preferred supplier</label><input value={gift.supplier} onChange={e => setGifts({ ...gifts, [id]: { ...gift, supplier: e.target.value } })} placeholder="Company name" /></div>
                <div className="field"><label>Website</label><input value={gift.url} onChange={e => setGifts({ ...gifts, [id]: { ...gift, url: e.target.value } })} placeholder="https://..." /></div>
                <div className="field"><label>Phone <span className="opt">(optional)</span></label><input value={gift.phone} onChange={e => setGifts({ ...gifts, [id]: { ...gift, phone: e.target.value } })} placeholder="Phone number" /></div>
                <div className="field"><label>How should visitors order?</label><select value={gift.method} onChange={e => setGifts({ ...gifts, [id]: { ...gift, method: e.target.value } })}><option value="">Select...</option><option>Order direct from supplier</option><option>Group order link</option><option>Email the family to coordinate</option></select></div>
              </div>
            )}
          </div>
        );
      })}
    </PortalForm>
  );
}

function PortalForm({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <>
      <h1 className="page-heading">{title}</h1>
      <p className="page-sub">{sub}</p>
      {children}
    </>
  );
}

function SettingRow({ title, desc, on, onToggle }: { title: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
      <button type="button" aria-pressed={on} className={`toggle ${on ? 'on' : ''}`} onClick={onToggle}><span /></button>
    </div>
  );
}

function useSavedState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  function save(next: T) {
    setValue(next);
    window.localStorage.setItem(key, JSON.stringify(next));
  }

  return [value, save];
}

function flash(setSaved: (value: boolean) => void) {
  setSaved(true);
  setTimeout(() => setSaved(false), 2500);
}
