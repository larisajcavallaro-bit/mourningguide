'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type GalleryLayout = 'grid' | 'masonry' | 'slideshow';
type GuestbookAccess = 'anyone' | 'family' | 'off';

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

type HelpSetting = {
  on: boolean;
  url: string;
  label?: string;
};

type GiftSetting = {
  on: boolean;
  supplierChoice: string;
  supplier: string;
  url: string;
  phone: string;
  method: string;
  orderByDate: string;
  groupOrderUrl: string;
  familyEmail: string;
  familyContact: string;
};

type Vendor = {
  name: string;
  url: string;
  region?: string;
  priceRange?: string;
  process?: string;
  turnaround?: string;
  phone?: string;
  email?: string;
  tip?: string;
};

type Catalog = {
  meta?: { disclaimer?: string };
  categories?: Record<string, Vendor[]>;
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

const HELP_GROUPS: Array<{ title: string; items: Array<{ id: string; label: string; desc: string; placeholder: string; mark: string; tone: string; custom?: boolean }> }> = [
  {
    title: 'Meal coordination',
    items: [
      { id: 'mealtrain', label: 'MealTrain', desc: 'Organize a schedule for friends to bring meals to the family.', placeholder: 'https://www.mealtrain.com/trains/...', mark: 'M', tone: '#fff3e0' },
      { id: 'ttam', label: 'Take Them A Meal', desc: 'Simple meal scheduling for families in need.', placeholder: 'https://takethemameal.com/...', mark: 'T', tone: '#e8f5e9' },
    ],
  },
  {
    title: 'Fundraising and donations',
    items: [
      { id: 'gofundme', label: 'GoFundMe', desc: 'Fundraise for funeral costs, family support, or a memorial cause.', placeholder: 'https://www.gofundme.com/f/...', mark: 'G', tone: '#e3f2fd' },
      { id: 'givebutter', label: 'Givebutter', desc: 'Memorial fundraising pages and in-memoriam campaigns.', placeholder: 'https://www.givebutter.com/...', mark: 'GB', tone: '#fce4ec' },
      { id: 'networkforgood', label: 'Network for Good', desc: 'Charity giving and memorial donations.', placeholder: 'https://www.networkforgood.org/...', mark: 'N', tone: '#f3e5f5' },
    ],
  },
  {
    title: 'Help calendar',
    items: [
      { id: 'signupgenius', label: 'SignUpGenius', desc: 'Volunteer sign-ups and help scheduling.', placeholder: 'https://www.signupgenius.com/...', mark: 'S', tone: '#e8f0fb' },
      { id: 'lotsahands', label: 'Lotsa Helping Hands', desc: 'Care community calendar and volunteer coordination.', placeholder: 'https://lotsahelpinghands.com/...', mark: 'L', tone: '#e8f5e9' },
      { id: 'caringbridge', label: 'CaringBridge', desc: 'Care updates and coordination for close friends and family.', placeholder: 'https://www.caringbridge.org/...', mark: 'C', tone: '#fff3e0' },
    ],
  },
  {
    title: 'Housing for out-of-town family',
    items: [
      { id: 'airbnb', label: 'Airbnb', desc: 'Short-term accommodation links for visiting family.', placeholder: 'https://www.airbnb.com/...', mark: 'A', tone: '#fce4ec' },
      { id: 'vrbo', label: 'VRBO', desc: 'Short-term rental options near the service.', placeholder: 'https://www.vrbo.com/...', mark: 'V', tone: '#e3f2fd' },
      { id: 'signupgeniusHousing', label: 'Host volunteer sign-ups', desc: 'Let friends offer spare rooms or local rides.', placeholder: 'https://www.signupgenius.com/...', mark: 'H', tone: '#e8f0fb' },
      { id: 'hotelblock', label: 'Hotel block', desc: 'Show hotel block details or a booking link for guests.', placeholder: 'Hotel name, booking link, or contact details', mark: 'HB', tone: '#e3f2fd' },
    ],
  },
  {
    title: 'Bereavement fund',
    items: [
      { id: 'gofundmeBereave', label: 'GoFundMe', desc: 'Direct family support fund.', placeholder: 'https://www.gofundme.com/f/...', mark: 'G', tone: '#e3f2fd' },
      { id: 'venmo', label: 'Venmo', desc: 'Direct family support.', placeholder: 'https://venmo.com/u/...', mark: 'V', tone: '#e8f5e9' },
      { id: 'cashapp', label: 'Cash App', desc: 'Direct family support.', placeholder: 'https://cash.app/$...', mark: '$', tone: '#f3e5f5' },
      { id: 'paypalme', label: 'PayPal.Me', desc: 'Direct payment link.', placeholder: 'https://paypal.me/...', mark: 'P', tone: '#e3f2fd' },
    ],
  },
  {
    title: 'Donation to a cause',
    items: [
      { id: 'givebutterCause', label: 'Givebutter', desc: 'In-memoriam fundraising pages.', placeholder: 'https://www.givebutter.com/...', mark: 'GB', tone: '#fce4ec' },
      { id: 'networkforgoodCause', label: 'Network for Good', desc: 'Charity giving links.', placeholder: 'https://www.networkforgood.org/...', mark: 'N', tone: '#e8f5e9' },
      { id: 'everyorg', label: 'Every.org', desc: 'Charity giving platform.', placeholder: 'https://www.every.org/...', mark: 'E', tone: '#f3e5f5' },
    ],
  },
  {
    title: 'Custom',
    items: [
      { id: 'custom', label: 'Custom link', desc: 'Add any other link, appeal, or coordination page.', placeholder: 'https://...', mark: '+', tone: '#f5f5f5', custom: true },
    ],
  },
];

const GIFTS = [
  { id: 'bears', category: 'Memory bears', title: 'Memory bears', desc: "Handmade keepsakes crafted from a loved one's clothing.", mark: 'B', tone: '#fdf3e7' },
  { id: 'ashes', category: 'Ashes jewelry', title: 'Ashes jewelry', desc: 'Pendants, rings, and charms containing a small amount of ashes.', mark: 'A', tone: '#f3e8ff' },
  { id: 'candles', category: 'Memorial candles', title: 'Memorial candles', desc: 'Custom candles for services, anniversaries, or visitors.', mark: 'C', tone: '#fff8e1' },
  { id: 'stones', category: 'Memorial garden stones', title: 'Memorial garden stones', desc: 'Engraved garden stones, plaques, or stepping stones.', mark: 'S', tone: '#e8f5e9' },
  { id: 'portrait', category: 'Custom portrait', title: 'Custom portrait', desc: 'Illustrated or painted portraits from a photo.', mark: 'P', tone: '#e3f2fd' },
  { id: 'fingerprint', category: 'Fingerprint jewelry', title: 'Fingerprint jewelry', desc: 'Jewelry or keepsakes cast from a fingerprint.', mark: 'F', tone: '#fce4ec' },
];

const GALLERY_BACKGROUNDS = [
  'linear-gradient(135deg,#b98f6d,#ead6c5)',
  'linear-gradient(135deg,#6b7c6e,#cbd6c9)',
  'linear-gradient(135deg,#506f86,#d6e0e6)',
  'linear-gradient(135deg,#9f4d49,#ead9d4)',
  'linear-gradient(135deg,#8a5c3e,#d9a87e)',
  'linear-gradient(135deg,#6b7785,#e7d8ca)',
];

const DEFAULT_GIFT: GiftSetting = {
  on: false,
  supplierChoice: '',
  supplier: '',
  url: '',
  phone: '',
  method: '',
  orderByDate: '',
  groupOrderUrl: '',
  familyEmail: '',
  familyContact: '',
};

export function GallerySettingsClient() {
  const [settings, setSettings] = useSavedState('mg.portal.gallery', {
    layout: 'grid' as GalleryLayout,
    captions: true,
    familyUploads: true,
    visitorUploads: false,
  });
  const [saved, setSaved] = useState(false);

  return (
    <PortalPageFrame icon="gallery" title="Photo gallery" sub="Choose how your photos are displayed. The gallery colors will match your portal theme.">
      {saved && <SaveFlash>Gallery settings saved.</SaveFlash>}

      <p className="section-label-lg">Gallery layout</p>
      <div className="layout-grid">
        {(['grid', 'masonry', 'slideshow'] as GalleryLayout[]).map(layout => (
          <button key={layout} type="button" className={`layout-card ${settings.layout === layout ? 'selected' : ''}`} onClick={() => setSettings({ ...settings, layout })}>
            <span className="layout-radio"><span /></span>
            <LayoutPreview layout={layout} />
            <span className="layout-name">{layout === 'grid' ? 'Grid' : layout === 'masonry' ? 'Masonry' : 'Slideshow'}</span>
            <span className="layout-hint">{layout === 'grid' ? '3 columns, equal tiles' : layout === 'masonry' ? 'Varying heights, natural feel' : 'Full-width, one at a time'}</span>
          </button>
        ))}
      </div>

      <hr className="divider" />
      <p className="section-label-lg">Settings</p>
      <SettingRow title="Show captions" desc="Display the story or caption beneath each photo." on={settings.captions} onToggle={() => setSettings({ ...settings, captions: !settings.captions })} />
      <SettingRow title="Family can add photos" desc="Allow legacy contacts to upload photos after your passing." on={settings.familyUploads} onToggle={() => setSettings({ ...settings, familyUploads: !settings.familyUploads })} />
      <SettingRow title="Visitors can add photos" desc="Anyone with the portal link can contribute photos for family review." on={settings.visitorUploads} onToggle={() => setSettings({ ...settings, visitorUploads: !settings.visitorUploads })} />
      <button className="save-btn" onClick={() => flash(setSaved)}>Save gallery settings</button>
    </PortalPageFrame>
  );
}

export function GuestbookSettingsClient() {
  const [settings, setSettings] = useSavedState('mg.portal.guestbook', {
    access: 'anyone' as GuestbookAccess,
    moderation: true,
    photoAttachments: true,
    anonymous: false,
  });
  const [saved, setSaved] = useState(false);

  return (
    <PortalPageFrame icon="guestbook" title="Guestbook" sub="Let family and friends leave messages on your portal. You choose who can post and how messages are reviewed.">
      {saved && <SaveFlash>Guestbook settings saved.</SaveFlash>}

      <p className="section-label-lg">Preview</p>
      <div className="gb-preview">
        <div className="gb-preview-header">
          <PortalIcon name="guestbook" small />
          <span className="gb-preview-title">Guestbook</span>
        </div>
        <div className="gb-preview-body">
          <div className="gb-entry-mock"><div className="gb-entry-name">Maria Murphy</div><div className="gb-entry-text">She was the warmest person I ever knew. I&apos;ll carry her laughter with me always.</div></div>
          <div className="gb-entry-mock"><div className="gb-entry-name">Patrick O&apos;Brien</div><div className="gb-entry-text">Proud to have called her my teacher. Rest easy, Mrs. Murphy.</div></div>
        </div>
      </div>

      <p className="section-label-lg">Who can post</p>
      {[
        ['anyone', 'Anyone with the portal link', 'Open to all visitors for the widest reach for tributes and memories.'],
        ['family', 'Family only', 'Only legacy contacts and people on your notify list can leave messages.'],
        ['off', 'Guestbook off', 'No messages section on your portal; photos and service info only.'],
      ].map(([value, title, desc]) => (
        <OptionCard key={value} selected={settings.access === value} title={title} desc={desc} onClick={() => setSettings({ ...settings, access: value as GuestbookAccess })} />
      ))}

      <hr className="divider" />
      <p className="section-label-lg">Moderation</p>
      <SettingRow title="Review before publishing" desc="Legacy contacts approve each message before it appears on the portal." on={settings.moderation} onToggle={() => setSettings({ ...settings, moderation: !settings.moderation })} />
      <SettingRow title="Allow photo attachments" desc="Visitors can include a photo with their message." on={settings.photoAttachments} onToggle={() => setSettings({ ...settings, photoAttachments: !settings.photoAttachments })} />
      <SettingRow title="Anonymous posts allowed" desc="Visitors do not need to provide their name." on={settings.anonymous} onToggle={() => setSettings({ ...settings, anonymous: !settings.anonymous })} />
      <button className="save-btn" onClick={() => flash(setSaved)}>Save guestbook settings</button>
    </PortalPageFrame>
  );
}

export function WaysToHelpClient() {
  const [settings, setSettings] = useSavedState<Record<string, HelpSetting>>('mg.portal.help', {});
  const [saved, setSaved] = useState(false);

  function itemFor(id: string): HelpSetting {
    return settings[id] ?? { on: false, url: '', label: '' };
  }

  function update(id: string, patch: Partial<HelpSetting>) {
    setSettings({ ...settings, [id]: { ...itemFor(id), ...patch } });
  }

  const enabled = HELP_GROUPS.flatMap(group => group.items).filter(item => itemFor(item.id).on).slice(0, 4);

  return (
    <PortalPageFrame icon="help" title="Ways to help" sub="Show visitors how they can support your family: meals, fundraising, travel, memorial donations, and practical help.">
      {saved && <SaveFlash>Ways to help saved.</SaveFlash>}
      <div className="admin-note">
        <PortalIcon name="info" small />
        <span>Links to these services are for convenience. Mourning Guide is not affiliated with these platforms and receives no referral fees or commissions.</span>
      </div>

      <div className="help-preview">
        <p className="section-label-lg">Portal preview</p>
        <div className="help-preview-card">
          <div className="help-preview-head">Ways to help the family</div>
          <div className="help-preview-list">
            {enabled.length ? enabled.map(item => <span key={item.id}>{item.label}</span>) : <span>Turn on help options to preview them here</span>}
          </div>
        </div>
      </div>

      {HELP_GROUPS.map(group => (
        <section key={group.title} className="portal-option-section">
          <p className="section-label-lg">{group.title}</p>
          {group.items.map(item => {
            const setting = itemFor(item.id);
            return (
              <div className="platform-card designed" key={item.id}>
                <div className="platform-header">
                  <div className="platform-logo" style={{ background: item.tone }}>{item.mark}</div>
                  <div className="platform-info">
                    <div className="platform-name">{item.label}</div>
                    <div className="platform-desc">{item.desc}</div>
                  </div>
                  <Toggle on={setting.on} onToggle={() => update(item.id, { on: !setting.on })} />
                </div>
                {setting.on && (
                  <div className="platform-link-input">
                    {item.custom && (
                      <>
                        <label>Link label</label>
                        <input value={setting.label ?? ''} onChange={e => update(item.id, { label: e.target.value })} placeholder="e.g. Donate to the American Cancer Society" />
                      </>
                    )}
                    <label>{item.custom ? 'Link URL' : `${item.label} link`}</label>
                    <input value={setting.url} onChange={e => update(item.id, { url: e.target.value })} placeholder={item.placeholder} />
                  </div>
                )}
              </div>
            );
          })}
        </section>
      ))}

      <button className="save-btn" onClick={() => flash(setSaved)}>Save ways to help</button>
    </PortalPageFrame>
  );
}

export function ServiceDetailsClient() {
  const [form, setForm] = useState<ServiceDetails>(BLANK_SERVICE);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [gifts, setGifts] = useSavedState<Record<string, GiftSetting>>('mg.portal.gifts', {});

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

  useEffect(() => {
    fetch('/data/memorial-keepsakes.json')
      .then(r => r.ok ? r.json() : null)
      .then(data => setCatalog(data))
      .catch(() => setCatalog(null));
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
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      setSaveError('Something went wrong. Please try again.');
    }
    setSaving(false);
  }

  function f(key: keyof ServiceDetails) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));
  }

  function giftFor(id: string): GiftSetting {
    return { ...DEFAULT_GIFT, ...(gifts[id] ?? {}) };
  }

  function updateGift(id: string, patch: Partial<GiftSetting>) {
    setGifts({ ...gifts, [id]: { ...giftFor(id), ...patch } });
  }

  if (loading) {
    return <PortalPageFrame icon="service" title="Service & gifts" sub="Loading service details..."><p style={{ color: '#9a7a6a' }}>Loading...</p></PortalPageFrame>;
  }

  if (loadError) {
    return <PortalPageFrame icon="service" title="Service & gifts" sub="Add funeral home details, service wishes, and optional memorial keepsakes."><p className="field-error">Couldn&apos;t load service details. Please refresh and try again.</p></PortalPageFrame>;
  }

  return (
    <PortalPageFrame icon="service" title="Service & gifts" sub="Add your funeral home now. Your legacy contact can fill in final service timing later. You can also choose what memorial gifts to offer visitors.">
      {saved && <SaveFlash>Service details saved.</SaveFlash>}

      <form onSubmit={save}>
        <p className="section-label-lg">Funeral home</p>
        <div className="portal-form-grid">
          <div className="field"><label>Funeral home name</label><input value={form.venue} onChange={f('venue')} placeholder="e.g. Riverside Funeral Home" /></div>
          <div className="field"><label>Phone number</label><input value={form.parking} onChange={f('parking')} placeholder="e.g. 603-555-0100" /></div>
          <div className="field portal-wide"><label>Address</label><input value={form.address} onChange={f('address')} placeholder="Street, city, state" /></div>
          <div className="field portal-wide"><label>Website <span className="opt">(optional)</span></label><input value={form.livestreamUrl} onChange={f('livestreamUrl')} placeholder="https://..." /></div>
        </div>

        <div className="admin-note">
          <PortalIcon name="info" small />
          <span>Your legacy contact can add the final date, time, and location after your passing. These details may not be known in advance.</span>
        </div>

        <hr className="divider" />
        <p className="section-label-lg">Service preferences</p>
        <div className="field">
          <label>Type of service</label>
          <select value={form.type} onChange={f('type')}>
            <option value="">Select...</option>
            {['Traditional funeral service','Graveside service only','Cremation service','Celebration of life','Private family service','No formal service'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="field"><label>Dress code <span className="opt">(optional)</span></label><input value={form.dresscode} onChange={f('dresscode')} placeholder="e.g. Smart casual, no black required" /></div>
        <div className="field"><label>Notes for your legacy contact <span className="opt">(optional)</span></label><textarea value={form.notes} onChange={f('notes')} placeholder="Anything your family should know about the service." /></div>
        {saveError && <p className="field-error">{saveError}</p>}
        <button className="save-btn" disabled={saving}>{saving ? 'Saving...' : saved ? 'Saved' : 'Save service details'}</button>
      </form>

      <hr className="divider" />
      <p className="section-label-lg">Memorial gifts and keepsakes</p>
      <p className="portal-muted">Choose which keepsakes to offer visitors on your portal. When enabled, visitors see supplier details and ordering instructions on the memorial page.</p>
      {catalog?.meta?.disclaimer && <p className="portal-disclaimer">{catalog.meta.disclaimer}</p>}

      {GIFTS.map(gift => {
        const giftSetting = giftFor(gift.id);
        const vendors = catalog?.categories?.[gift.category] ?? [];
        const selectedVendor = vendors.find(v => v.url === giftSetting.supplierChoice);
        return (
          <div className="gift-card designed" key={gift.id}>
            <div className="gift-header">
              <div className="gift-emoji" style={{ background: gift.tone }}>{gift.mark}</div>
              <div className="gift-info">
                <div className="gift-name">{gift.title}</div>
                <div className="gift-desc">{gift.desc}</div>
              </div>
              <Toggle on={giftSetting.on} onToggle={() => updateGift(gift.id, { on: !giftSetting.on })} />
            </div>
            {giftSetting.on && (
              <div className="gift-supplier">
                <div className="gift-order-fields">
                  <div className="field">
                    <label>Order by date</label>
                    <input type="date" value={giftSetting.orderByDate} onChange={e => updateGift(gift.id, { orderByDate: e.target.value })} />
                    <span className="field-hint">Shown at the top of this keepsake on your memorial page.</span>
                  </div>
                  <div className="field">
                    <label>How should visitors order?</label>
                    <select value={giftSetting.method} onChange={e => updateGift(gift.id, { method: e.target.value })}>
                      <option value="">Select...</option>
                      <option value="direct">Order direct from the supplier</option>
                      <option value="group_link">Group order link</option>
                      <option value="email_family">Email the family to coordinate</option>
                    </select>
                  </div>
                  {giftSetting.method === 'group_link' && <div className="field"><label>Group order link</label><input value={giftSetting.groupOrderUrl} onChange={e => updateGift(gift.id, { groupOrderUrl: e.target.value })} placeholder="https://..." /></div>}
                  {giftSetting.method === 'email_family' && (
                    <div className="portal-form-grid">
                      <div className="field"><label>Family coordination email</label><input value={giftSetting.familyEmail} onChange={e => updateGift(gift.id, { familyEmail: e.target.value })} placeholder="memorial@family.com" /></div>
                      <div className="field"><label>Family contact <span className="opt">(optional)</span></label><input value={giftSetting.familyContact} onChange={e => updateGift(gift.id, { familyContact: e.target.value })} placeholder="e.g. Sarah, 603-555-0100" /></div>
                    </div>
                  )}
                </div>

                <label>Preferred supplier</label>
                <select value={giftSetting.supplierChoice} onChange={e => updateGift(gift.id, { supplierChoice: e.target.value })}>
                  <option value="">Choose a supplier...</option>
                  {vendors.map(vendor => <option key={vendor.url} value={vendor.url}>{vendor.name}{vendor.priceRange ? ` (${vendor.priceRange})` : ''}</option>)}
                  <option value="custom">Custom - add your own link</option>
                </select>
                {selectedVendor && <VendorDetail vendor={selectedVendor} />}
                {giftSetting.supplierChoice === 'custom' && (
                  <div className="vendor-custom show">
                    <div className="portal-form-grid">
                      <div className="field"><label>Company name</label><input value={giftSetting.supplier} onChange={e => updateGift(gift.id, { supplier: e.target.value })} placeholder="e.g. Local memorial shop" /></div>
                      <div className="field"><label>Website</label><input value={giftSetting.url} onChange={e => updateGift(gift.id, { url: e.target.value })} placeholder="https://..." /></div>
                      <div className="field"><label>Phone <span className="opt">(optional)</span></label><input value={giftSetting.phone} onChange={e => updateGift(gift.id, { phone: e.target.value })} placeholder="Phone number" /></div>
                    </div>
                  </div>
                )}
                <p className="portal-preview-note">Saved supplier details appear on your public memorial page for visitors.</p>
              </div>
            )}
          </div>
        );
      })}
    </PortalPageFrame>
  );
}

function LayoutPreview({ layout }: { layout: GalleryLayout }) {
  if (layout === 'masonry') {
    return (
      <span className="layout-preview">
        <span className="lp-masonry">
          <span className="lp-masonry-col">
            <span className="lp-m-cell" style={{ flex: 1.4, background: GALLERY_BACKGROUNDS[0] }} />
            <span className="lp-m-cell" style={{ flex: 0.8, background: GALLERY_BACKGROUNDS[1] }} />
          </span>
          <span className="lp-masonry-col">
            <span className="lp-m-cell" style={{ flex: 0.7, background: GALLERY_BACKGROUNDS[2] }} />
            <span className="lp-m-cell" style={{ flex: 1.5, background: GALLERY_BACKGROUNDS[3] }} />
          </span>
        </span>
      </span>
    );
  }

  if (layout === 'slideshow') {
    return (
      <span className="layout-preview">
        <span className="lp-slide" style={{ background: GALLERY_BACKGROUNDS[4] }}>
          <span className="lp-slide-overlay" />
          <span className="lp-slide-dots"><span className="lp-slide-dot active" /><span className="lp-slide-dot" /><span className="lp-slide-dot" /></span>
        </span>
      </span>
    );
  }

  return (
    <span className="layout-preview">
      <span className="lp-grid">
        {GALLERY_BACKGROUNDS.map((background, index) => <span key={background} className="lp-grid-cell" style={{ background, opacity: index % 2 ? 0.86 : 1 }} />)}
      </span>
    </span>
  );
}

function PortalPageFrame({ icon, title, sub, children }: { icon: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="portal-subpage">
      <Link href="/portal" className="back-link">Back to Portal</Link>
      <div className="portal-page-header">
        <div className="portal-page-header-icon"><PortalIcon name={icon} /></div>
        <div>
          <h1>{title}</h1>
          <p>{sub}</p>
        </div>
      </div>
      <div className="portal-pad">{children}</div>
    </div>
  );
}

function PortalIcon({ name, small = false }: { name: string; small?: boolean }) {
  const size = small ? 16 : 22;
  const stroke = small ? 'currentColor' : '#c57b57';
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke, strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'gallery') return <svg {...common}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
  if (name === 'guestbook') return <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
  if (name === 'help') return <svg {...common}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>;
  if (name === 'service') return <svg {...common}><path d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" /><path d="M9 21V12h6v9" /></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>;
}

function VendorDetail({ vendor }: { vendor: Vendor }) {
  return (
    <div className="vendor-detail">
      <h4>{vendor.name}</h4>
      <VendorRow label="Website"><a href={vendor.url} target="_blank" rel="noopener noreferrer">{vendor.url.replace(/^https?:\/\//, '')}</a></VendorRow>
      {vendor.phone && !/contact via website/i.test(vendor.phone) && <VendorRow label="Phone">{vendor.phone}</VendorRow>}
      {vendor.email && <VendorRow label="Email">{vendor.email}</VendorRow>}
      {vendor.region && <VendorRow label="Region">{vendor.region}</VendorRow>}
      {vendor.priceRange && <VendorRow label="Typical cost">{vendor.priceRange}</VendorRow>}
      {vendor.process && <VendorRow label="Supplier notes">{vendor.process}</VendorRow>}
      {vendor.turnaround && <VendorRow label="Turnaround">{vendor.turnaround}</VendorRow>}
      {vendor.tip && <p className="vendor-detail-tip">{vendor.tip}</p>}
    </div>
  );
}

function VendorRow({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="vendor-detail-row"><span className="vendor-detail-label">{label}</span><span>{children}</span></div>;
}

function OptionCard({ selected, title, desc, onClick }: { selected: boolean; title: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" className={`option-card ${selected ? 'selected' : ''}`} onClick={onClick}>
      <span className="option-radio"><span /></span>
      <span><strong>{title}</strong><small>{desc}</small></span>
    </button>
  );
}

function SettingRow({ title, desc, on, onToggle }: { title: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="setting-row">
      <div>
        <strong>{title}</strong>
        <span>{desc}</span>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return <button type="button" aria-pressed={on} className={`toggle ${on ? 'on' : ''}`} onClick={onToggle}><span /></button>;
}

function SaveFlash({ children }: { children: React.ReactNode }) {
  return <div className="save-flash show">{children}</div>;
}

function useSavedState<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed && typeof parsed === 'object' && initial && typeof initial === 'object' && !Array.isArray(initial)) {
        return { ...(initial as Record<string, unknown>), ...parsed } as T;
      }
      return parsed ?? initial;
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
