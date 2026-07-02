'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

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

type AreaMeta = {
  label: string;
  desc: string;
  icon: string;
  formTitle: string;
  addAnotherLabel?: string;
  institutionLabel: string;
  institutionPlaceholder: string;
  accountTypeLabel?: string;
  accountTypes: string[];
  locationLabel: string;
  locationPlaceholder: string;
  showInstructions?: boolean;
};

const AREA_META: Record<string, AreaMeta> = {
  bank: {
    label: 'Banks & savings',
    desc: 'Help your family find and close your bank accounts.',
    icon: 'bank',
    formTitle: 'Add a bank or savings account',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Bank or institution name',
    institutionPlaceholder: 'Search for your bank or type its name...',
    accountTypes: ['Checking account', 'Savings account', 'Money market account', 'Certificate of deposit (CD)', 'Health savings account (HSA)', 'Individual retirement account (IRA)', 'Joint account', 'Business account', 'Other'],
    locationLabel: 'Where can you find online banking details?',
    locationPlaceholder: 'e.g. Username saved in browser, password in 1Password, paper statements in desk drawer',
    showInstructions: true,
  },
  credit_card: {
    label: 'Credit cards & loans',
    desc: 'Document credit cards, personal loans, and lines of credit.',
    icon: 'card',
    formTitle: 'Add a credit card or loan',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Card issuer or lender name',
    institutionPlaceholder: 'e.g. Chase, American Express, Capital One...',
    accountTypes: ['Credit card', 'Personal loan', 'Home equity line of credit (HELOC)', 'Auto loan', 'Student loan', 'Business credit card', 'Store card', 'Other'],
    locationLabel: 'Where can you find the account details?',
    locationPlaceholder: 'e.g. Monthly paper statements in desk drawer, or online at chase.com',
  },
  subscription: {
    label: 'Subscriptions & services',
    desc: 'List subscriptions, streaming, memberships, and recurring services to cancel.',
    icon: 'pin',
    formTitle: 'Add a subscription or service',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Service name',
    institutionPlaceholder: 'e.g. Netflix, Spotify, Amazon Prime...',
    accountTypes: ['Streaming TV', 'Streaming music', 'News / magazine', 'Software / app', 'Gym / fitness', 'Delivery service', 'Phone plan', 'Internet / broadband', 'Cloud storage', 'Other'],
    locationLabel: 'Where can you find the login?',
    locationPlaceholder: 'e.g. Signed up with personal email, password in browser saved passwords',
  },
  utility: {
    label: 'Utilities & home services',
    desc: 'Electricity, gas, water, internet, and home services.',
    icon: 'home',
    formTitle: 'Add a utility or home service',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Provider name',
    institutionPlaceholder: 'e.g. PG&E, Comcast, AT&T...',
    accountTypes: ['Electricity', 'Gas', 'Water', 'Internet / broadband', 'Cable TV', 'Home phone', 'Security system', 'Waste / recycling', 'Other'],
    locationLabel: 'Where can you find the account details?',
    locationPlaceholder: 'e.g. Paper bill arrives monthly, or online account at provider website',
  },
  digital: {
    label: 'Digital life & accounts',
    desc: 'Email, social media, Apple ID, Google, and other digital accounts.',
    icon: 'screen',
    formTitle: 'Add a digital account',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Platform or service name',
    institutionPlaceholder: 'e.g. Apple ID, Gmail, Facebook, LinkedIn...',
    accountTypes: ['Email', 'Social media', 'Cloud storage / photos', 'Password manager', 'Online shopping', 'Gaming', 'Financial / crypto', 'Other'],
    locationLabel: 'Where can you find the login?',
    locationPlaceholder: 'e.g. Apple ID email is johndoe@icloud.com, password in 1Password',
  },
  insurance: {
    label: 'Insurance',
    desc: 'Life, health, home, auto, and other insurance policies.',
    icon: 'shield',
    formTitle: 'Add an insurance policy',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Insurance company name',
    institutionPlaceholder: 'e.g. MetLife, State Farm, Prudential...',
    accountTypes: ['Life insurance', 'Health insurance', 'Homeowner insurance', 'Renter insurance', 'Auto insurance', 'Long-term care', 'Disability insurance', 'Umbrella policy', 'Other'],
    locationLabel: 'Where can you find the policy details?',
    locationPlaceholder: 'e.g. Policy documents in filing cabinet, or online at metlife.com',
  },
  investment: {
    label: 'Investments & retirement',
    desc: 'Brokerage accounts, IRAs, 401(k)s, and retirement savings.',
    icon: 'chart',
    formTitle: 'Add an investment or retirement account',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Institution or platform name',
    institutionPlaceholder: 'e.g. Fidelity, Vanguard, Charles Schwab...',
    accountTypes: ['401(k) / 403(b)', 'Traditional IRA', 'Roth IRA', 'Brokerage / investment account', 'Pension', 'Annuity', '529 education savings', 'Other'],
    locationLabel: 'Where can you find the account details?',
    locationPlaceholder: 'e.g. Quarterly statements by mail, online at fidelity.com',
  },
  property: {
    label: 'Real estate & property',
    desc: 'Homes, land, rental properties, and mortgages.',
    icon: 'home',
    formTitle: 'Add a property or mortgage',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Property address or lender name',
    institutionPlaceholder: 'e.g. 123 Main St, or Wells Fargo Mortgage...',
    accountTypes: ['Primary home', 'Vacation / second home', 'Rental property', 'Land / plot', 'Mortgage', 'Reverse mortgage', 'Other'],
    locationLabel: 'Where can you find mortgage or title documents?',
    locationPlaceholder: 'e.g. Deed in fireproof safe, mortgage account at lender website',
  },
  vehicle: {
    label: 'Vehicles',
    desc: 'Cars, motorcycles, boats, RVs, and other vehicles.',
    icon: 'car',
    formTitle: 'Add a vehicle',
    addAnotherLabel: '+ Add another vehicle',
    institutionLabel: 'Vehicle make and model',
    institutionPlaceholder: 'e.g. 2018 Toyota Camry, 2020 Honda CRV...',
    accountTypeLabel: 'Type of vehicle',
    accountTypes: ['Car', 'Truck or SUV', 'Motorcycle', 'Boat', 'RV / motorhome', 'Other'],
    locationLabel: 'Where can you find the title and registration?',
    locationPlaceholder: 'e.g. Title in fireproof safe, registration in glove box',
  },
  business: {
    label: 'Business interests',
    desc: 'Businesses you own, partnerships, or shares in a company.',
    icon: 'briefcase',
    formTitle: 'Add a business interest',
    addAnotherLabel: '+ Add another business',
    institutionLabel: 'Business or entity name',
    institutionPlaceholder: 'e.g. Smith Plumbing LLC, ABC Partnership...',
    accountTypes: ['Sole proprietorship', 'LLC', 'S-Corporation', 'C-Corporation', 'Partnership', 'Shares in private company', 'Franchise', 'Other'],
    locationLabel: 'Where can you find the business documents?',
    locationPlaceholder: 'e.g. Operating agreement in office filing cabinet, accountant is Mary Chen',
  },
  government: {
    label: 'Government & benefits',
    desc: 'Social Security survivor benefits, VA benefits, pensions, and union benefits.',
    icon: 'columns',
    formTitle: 'Add a government or benefits account',
    addAnotherLabel: '+ Add another account',
    institutionLabel: 'Agency, employer, or benefit name',
    institutionPlaceholder: 'e.g. Social Security Administration, VA Benefits...',
    accountTypes: ['Social Security survivor benefit', 'Social Security lump-sum death benefit', 'VA survivor benefits', 'VA pension', 'Employer pension', 'Union pension / benefit', 'Railroad Retirement Board', 'Federal employee', 'State government pension', 'Other'],
    locationLabel: 'Where can you find paperwork or account details?',
    locationPlaceholder: 'e.g. SS card in fireproof safe, pension documents with HR at employer',
    showInstructions: true,
  },
  funeral: {
    label: 'Funeral & final wishes',
    desc: 'Your preferences for your funeral, burial, or memorial service.',
    icon: 'pin',
    formTitle: 'Add a funeral preference or arrangement',
    addAnotherLabel: '+ Add another item',
    institutionLabel: 'Funeral home or preference type',
    institutionPlaceholder: "e.g. Rose Hill Funeral Home, or 'Burial preference'...",
    accountTypes: ['Burial preference', 'Cremation preference', 'Funeral home', 'Pre-paid funeral plan', 'Cemetery / burial site', 'Religious or cultural wishes', 'Memorial service wishes', 'Other'],
    locationLabel: 'Where can you find more details?',
    locationPlaceholder: 'e.g. Pre-paid plan documents in filing cabinet',
  },
  pet: {
    label: 'Pets',
    desc: 'Your pets and who should care for them.',
    icon: 'heart',
    formTitle: 'Add a pet',
    addAnotherLabel: '+ Add another pet',
    institutionLabel: "Pet's name and type",
    institutionPlaceholder: 'e.g. Max (Golden Retriever), Bella (Tabby cat)...',
    accountTypeLabel: 'Type of pet',
    accountTypes: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Horse', 'Reptile', 'Other'],
    locationLabel: 'Who should care for this pet?',
    locationPlaceholder: 'e.g. Sister Maria has agreed to take Max, her number is in Contacts',
  },
  special_item: {
    label: 'Special items & sentimental',
    desc: 'Sentimental items, heirlooms, art, and collections.',
    icon: 'star',
    formTitle: 'Add a special item',
    addAnotherLabel: '+ Add another item',
    institutionLabel: 'Item name or description',
    institutionPlaceholder: "e.g. Grandmother's pearl necklace, vintage Gibson guitar...",
    accountTypeLabel: 'Type of item',
    accountTypes: ['Jewelry', 'Artwork', 'Antiques / furniture', 'Musical instrument', 'Collectible', 'Watch', 'Family heirloom', 'Other'],
    locationLabel: 'Where can this item be found?',
    locationPlaceholder: 'e.g. Pearl necklace in bedroom jewelry box, top drawer',
  },
  other: {
    label: 'Other planning item',
    desc: 'Anything else your family may need to find or understand.',
    icon: 'folder',
    formTitle: 'Add an item',
    addAnotherLabel: '+ Add another item',
    institutionLabel: 'Name',
    institutionPlaceholder: 'Type a name...',
    accountTypes: ['Other'],
    locationLabel: 'Where can your family find this?',
    locationPlaceholder: 'e.g. Green folder in filing cabinet, top drawer',
  },
};

const INSTRUCTIONS: Record<string, { subtitle: string; steps: string[]; docs: string[]; tip: string }> = {
  bank: {
    subtitle: 'step-by-step guide',
    steps: [
      'Get multiple certified death certificates. Most banks require their own original copy, not a photocopy.',
      'Call the bank estate services or bereavement department, not general customer service.',
      'Ask exactly which documents they require and whether a payable-on-death beneficiary is already listed.',
      'Expect review time. Accounts may be frozen while the bank verifies estate paperwork.',
    ],
    docs: ['Certified death certificate', 'Executor photo ID', 'Letters testamentary or small-estate affidavit', 'Recent statement if available', 'Do not write Social Security numbers here'],
    tip: 'The fastest way to avoid probate delay is naming payable-on-death beneficiaries while alive. This page helps your family know who to call and where to look.',
  },
  government: {
    subtitle: 'step-by-step guide',
    steps: [
      'Report the death to Social Security. If your loved one received Social Security, the payment for the month of death may need to be returned.',
      'File for survivor benefits as early as possible if a spouse, dependent child, or dependent parent may qualify.',
      'Contact the VA if your loved one was a veteran. Survivor and burial benefits are not always automatic.',
      'Notify pension, union, railroad, or employer benefit administrators directly.',
    ],
    docs: ['Certified death certificate', 'Government-issued photo ID', 'Marriage certificate for spouse claims', 'Birth certificates for dependent children', 'Military discharge papers (DD-214) for VA claims'],
    tip: 'These agencies can be slow and some benefits are not paid retroactively. Start early and keep a log of every call.',
  },
};

const INSTITUTIONS: Record<string, string[]> = {
  bank: [
    'JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'US Bank',
    'Truist Bank', 'PNC Bank', 'Capital One', 'TD Bank', 'Citizens Bank',
    'Regions Bank', 'Fifth Third Bank', 'Huntington Bank', 'KeyBank', 'Ally Bank',
    'Discover Bank', 'Goldman Sachs (Marcus)', 'Comerica', 'M&T Bank', 'First Citizens Bank',
    'Santander Bank', 'BMO Harris Bank', 'HSBC USA', 'American Express Bank', 'Navy Federal Credit Union',
    'USAA Bank', 'Charles Schwab Bank', 'SoFi Bank', 'Flagstar Bank', 'Synovus Bank',
    'Western Alliance Bank', 'East West Bank', 'Pacific Premier Bank', 'South State Bank', 'Glacier Bank',
    'Independent Bank Group', 'First Midwest Bancorp', 'Renasant Bank', 'Pinnacle Financial Partners', 'Heartland Financial',
    'QCR Holdings', 'Triumph Financial', 'Columbia Banking System', 'Berkshire Hills Bancorp', 'Sandy Spring Bancorp',
    'Shore Bankshares', 'S&T Bancorp', 'Lakeland Bancorp', 'Provident Financial Services', 'NBT Bancorp',
    'First Keystone Financial', 'Northwest Bank', 'Orrstown Financial', 'WesBanco', 'Old National Bank',
    'Wintrust Financial', 'Bremer Bank', 'Bell Bank', 'Valley National Bancorp', 'United Bankshares',
    'TowneBank', 'Texas Capital Bancshares', 'Southside Bancshares', 'Summit Financial Group', 'Simmons First National',
    'Silvergate Bank', 'Seacoast Banking', 'Riverview Financial', 'Premier Financial', 'Pathfinder Bancorp',
    'Origin Bancorp', 'National Western Financial', 'Midland States Bancorp', 'Investors Bancorp', 'Independent Bank',
    'Glacier Hills Bancorp', 'CrossFirst Bankshares', 'Columbia Bank NJ', 'Carter Bankshares', 'Brookline Bancorp',
    'Territorial Savings Bank', 'Stock Yards Financial', 'State Bank Financial', 'Silvergate Capital', 'Severn Bancorp',
    'ServisFirst Bancshares', 'Renasant Corporation', 'Ponce Financial Group', 'Plumas Bank', 'Northwest Bancshares',
    'National Penn Bancshares', 'National Bank Holdings', 'Midland States', 'MainStreet Bankshares', 'Mackinac Savings Bank',
    'Luther Burbank', 'Lakeland Bancorp', 'John Marshall Bank', 'Investors Community Bank', 'Hanover Bancorp',
    'Glacier Bancorp', 'First Western Financial', 'First Savings Financial', 'First National Corporation', 'Enterprise Financial',
    'Capitol Federal Financial', 'Centerstate Banks', 'Amalgamated Financial', 'Other (type name)',
  ],
  credit_card: [
    'American Express', 'Chase', 'Bank of America', 'Citibank', 'Capital One', 'Discover',
    'Wells Fargo', 'US Bank', 'Barclays', 'Synchrony Bank', 'TD Bank', 'USAA',
    'Navy Federal Credit Union', 'Goldman Sachs (Apple Card)', 'SoFi', 'Penfed Credit Union',
    'Ally Bank', 'Lightstream', 'Marcus by Goldman Sachs', 'Avant', 'LendingClub',
    'Prosper', 'Best Egg', 'Upgrade', 'Upstart', 'OneMain Financial', 'Other (type name)',
  ],
  subscription: [
    'Netflix', 'Disney+', 'Hulu', 'HBO Max / Max', 'Amazon Prime', 'Apple TV+',
    'Peacock', 'Paramount+', 'Spotify', 'Apple Music', 'YouTube Premium', 'Tidal',
    'Pandora', 'SiriusXM', 'Amazon Music', 'New York Times', 'Washington Post',
    'Wall Street Journal', 'The Atlantic', 'Audible', 'Kindle Unlimited',
    'Microsoft 365', 'Adobe Creative Cloud', 'Dropbox', 'Google One', 'iCloud+',
    'LinkedIn Premium', 'Zoom', 'Slack', 'Planet Fitness', 'Peloton',
    'HelloFresh', 'DoorDash DashPass', 'Amazon Fresh', 'Instacart+', 'Other (type name)',
  ],
  utility: [
    'PG&E', 'Southern California Edison', 'ConEdison', 'Duke Energy', 'Dominion Energy',
    'Xcel Energy', 'Evergy', 'APS (Arizona Public Service)', 'CenterPoint Energy',
    'Entergy', 'NV Energy', 'PSEG', 'ComEd', 'Georgia Power', 'Ameren',
    'Comcast / Xfinity', 'Charter / Spectrum', 'Cox Communications', 'AT&T', 'Verizon Fios',
    'CenturyLink / Lumen', 'Frontier Communications', 'Sparklight', 'Google Fiber',
    'Republic Services', 'Waste Management', 'American Water', 'Other (type name)',
  ],
  digital: [
    'Apple ID / iCloud', 'Google / Gmail', 'Microsoft / Outlook', 'Facebook / Meta',
    'Instagram', 'Twitter / X', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest',
    'Snapchat', 'Reddit', 'Amazon', 'eBay', 'PayPal', 'Venmo', 'Zelle',
    'Coinbase', 'Robinhood', '1Password', 'LastPass', 'Bitwarden', 'Dropbox', 'Other (type name)',
  ],
  insurance: [
    'MetLife', 'Prudential', 'New York Life', 'Northwestern Mutual', 'State Farm',
    'Allstate', 'Lincoln Financial', 'John Hancock', 'Transamerica', 'AIG Life',
    'Nationwide', 'Pacific Life', 'Mass Mutual', 'Principal Financial', 'Guardian Life',
    'Unum', 'Sun Life', 'Securian', 'Protective Life', 'Mutual of Omaha',
    'USAA', 'TIAA', 'Aetna', 'Cigna', 'UnitedHealth', 'Blue Cross Blue Shield',
    'Humana', 'Anthem', 'Kaiser Permanente', 'Other (type name)',
  ],
  investment: [
    'Fidelity Investments', 'Vanguard', 'Charles Schwab', 'Merrill Lynch', 'Morgan Stanley',
    'Edward Jones', 'TD Ameritrade (now Schwab)', 'Robinhood', 'E*TRADE', 'Interactive Brokers',
    'Raymond James', 'Ameriprise Financial', 'T. Rowe Price', 'BlackRock', 'TIAA',
    'Transamerica', 'Principal Financial', 'John Hancock', 'Nationwide', 'Empower Retirement',
    'Betterment', 'Wealthfront', 'SoFi Invest', 'Fidelity NetBenefits (401k)', 'Other (type name)',
  ],
  property: [
    'Wells Fargo Home Mortgage', 'Rocket Mortgage / Quicken Loans', 'Chase Mortgage',
    'Bank of America Mortgage', 'US Bank Home Mortgage', 'PNC Mortgage', 'Truist Mortgage',
    'Caliber Home Loans', 'loanDepot', 'Freedom Mortgage', 'Pennymac', 'Mr. Cooper (Nationstar)',
    'Guild Mortgage', 'Fairway Independent Mortgage', 'NewRez', 'Carrington Mortgage', 'Other (type name)',
  ],
};

const BLANK = {
  category: '',
  institutionName: '',
  accountType: '',
  lastFour: '',
  whoToCall: '',
  purposeNotes: '',
  paperworkLocation: '',
  notes: '',
};

function categoryFromParam(value?: string) {
  return value && AREA_META[value] ? value : 'bank';
}

function Icon({ name }: { name: string }) {
  const common = { width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: '#c57b57', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (name === 'card') return <svg {...common}><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20M6 15h2M10 15h4" /></svg>;
  if (name === 'shield') return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
  if (name === 'chart') return <svg {...common}><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></svg>;
  if (name === 'home') return <svg {...common}><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>;
  if (name === 'car') return <svg {...common}><path d="M5 17H3a2 2 0 0 1-2-2v-4l3-7h12l3 7v4a2 2 0 0 1-2 2h-2" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="16.5" cy="17.5" r="2.5" /></svg>;
  if (name === 'screen') return <svg {...common}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
  if (name === 'columns') return <svg {...common}><path d="M3 9l9-7 9 7H3z" /><path d="M5 10v10M10 10v10M14 10v10M19 10v10M3 20h18" /></svg>;
  if (name === 'briefcase') return <svg {...common}><rect x="2" y="7" width="20" height="13" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>;
  if (name === 'heart') return <svg {...common}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" /></svg>;
  if (name === 'star') return <svg {...common}><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2z" /></svg>;
  if (name === 'pin') return <svg {...common}><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>;
  return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9h10M7 13h6M7 17h4" /></svg>;
}

export default function FinancesClient({ initial, initialCategory }: { initial: FinancialAccount[]; initialCategory?: string }) {
  const activeCategory = categoryFromParam(initialCategory);
  const area = AREA_META[activeCategory];
  const [items, setItems] = useState<FinancialAccount[]>(initial);
  const [editing, setEditing] = useState<FinancialAccount | null>(null);
  const [form, setForm] = useState({ ...BLANK, category: activeCategory });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [institutionFocused, setInstitutionFocused] = useState(false);
  const [focusedInstitutionIndex, setFocusedInstitutionIndex] = useState(-1);
  const institutionWrapRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = useMemo(() => items.filter((item) => item.category === activeCategory), [items, activeCategory]);
  const instructions = INSTRUCTIONS[activeCategory];
  const institutionOptions = useMemo(() => {
    const source = INSTITUTIONS[activeCategory] ?? [];
    const query = form.institutionName.trim().toLowerCase();
    if (!query) return source.slice(0, 12);
    return source.filter((name) => name.toLowerCase().includes(query)).slice(0, 12);
  }, [activeCategory, form.institutionName]);
  const showInstitutionDropdown = institutionFocused && institutionOptions.length > 0;

  useEffect(() => {
    setFocusedInstitutionIndex(-1);
  }, [activeCategory, form.institutionName]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!institutionWrapRef.current?.contains(event.target as Node)) {
        setInstitutionFocused(false);
        setFocusedInstitutionIndex(-1);
      }
    }

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  function edit(item: FinancialAccount) {
    setEditing(item);
    setSaved(false);
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
  }

  function clearForm() {
    setEditing(null);
    setForm({ ...BLANK, category: activeCategory });
    setSaveError('');
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaved(false);
    const payload = { ...form, category: activeCategory };
    const url = editing ? `/api/vault/finances/${editing.id}` : '/api/vault/finances';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const { item } = await res.json();
      setItems((prev) => editing ? prev.map((x) => (x.id === item.id ? item : x)) : [...prev, item]);
      setSaved(true);
      setEditing(null);
      setForm({ ...BLANK, category: activeCategory });
    } else {
      setSaveError('Something went wrong. Please try again.');
    }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm('Remove this entry?')) return;
    setDeleting(id);
    const res = await fetch(`/api/vault/finances/${id}`, { method: 'DELETE' });
    if (res.ok) setItems((prev) => prev.filter((x) => x.id !== id));
    else alert('Could not remove this entry. Please try again.');
    setDeleting(null);
  }

  return (
    <div className="planning-detail">
      <Link href="/vault" className="back-link">
        <span aria-hidden>←</span> Back to all planning areas
      </Link>

      <div className="area-header">
        <div className="area-header-icon"><Icon name={area.icon} /></div>
        <div>
          <h1 className="area-header-title">{area.label}</h1>
          <p className="area-header-desc">{area.desc}</p>
        </div>
      </div>

      {area.showInstructions && instructions && (
        <div className="instructions-box">
          <button type="button" className="instructions-toggle" onClick={() => setInstructionsOpen((open) => !open)}>
            <span className="instructions-toggle-left">
              <span className="instructions-alert">!</span>
              <strong>What to do after a death</strong>
              <span>{instructions.subtitle}</span>
            </span>
            <span className={`instructions-toggle-chevron ${instructionsOpen ? 'open' : ''}`}>⌄</span>
          </button>
          {instructionsOpen && (
            <div className="instructions-body open">
              {instructions.steps.map((step, index) => (
                <div className="instructions-step" key={step}>
                  <span className="step-num">{index + 1}</span>
                  <p className="step-text">{step}</p>
                </div>
              ))}
              <ul className="docs-list">
                {instructions.docs.map((doc) => <li key={doc}>{doc}</li>)}
              </ul>
              <div className="instructions-tip">{instructions.tip}</div>
            </div>
          )}
        </div>
      )}

      <div className="security-note">
        <Icon name="shield" />
        <p><strong>Safe to save here:</strong> institution names, account types, where to find statements, and who to call. <strong>Never save:</strong> full account numbers, passwords, SSNs, or PINs.</p>
      </div>

      <section className="planning-detail-grid">
        <form onSubmit={save} className="planning-detail-form">
          <h2>{editing ? 'Edit entry' : area.formTitle}</h2>

          {saved && <div className="success-flash show">Entry saved to your plan.</div>}

          <div className="field">
            <label>{area.institutionLabel}</label>
            <div className="institution-wrap" ref={institutionWrapRef}>
              <svg className="institution-search-icon" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" stroke="#9a7a6a" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" stroke="#9a7a6a" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={form.institutionName}
                onChange={(e) => setForm((f) => ({ ...f, institutionName: e.target.value }))}
                onFocus={() => setInstitutionFocused(true)}
                onKeyDown={(e) => {
                  if (!institutionOptions.length) return;
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setInstitutionFocused(true);
                    setFocusedInstitutionIndex((current) => (current + 1) % institutionOptions.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setInstitutionFocused(true);
                    setFocusedInstitutionIndex((current) => (current <= 0 ? institutionOptions.length - 1 : current - 1));
                  } else if (e.key === 'Enter' && focusedInstitutionIndex >= 0 && institutionOptions[focusedInstitutionIndex]) {
                    e.preventDefault();
                    setForm((f) => ({ ...f, institutionName: institutionOptions[focusedInstitutionIndex] }));
                    setInstitutionFocused(false);
                    setFocusedInstitutionIndex(-1);
                  } else if (e.key === 'Escape') {
                    setInstitutionFocused(false);
                    setFocusedInstitutionIndex(-1);
                  }
                }}
                placeholder={area.institutionPlaceholder}
                required
                autoComplete="off"
              />
              <div className={`inst-dropdown ${showInstitutionDropdown ? 'open' : ''}`}>
                {institutionOptions.map((name, index) => (
                  <button
                    key={name}
                    type="button"
                    className={`inst-option ${focusedInstitutionIndex === index ? 'focused' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setForm((f) => ({ ...f, institutionName: name === 'Other (type name)' ? '' : name }));
                      setInstitutionFocused(false);
                      setFocusedInstitutionIndex(-1);
                    }}
                  >
                    <span className="inst-name">{name}</span>
                    {name === 'Other (type name)' && <span className="inst-badge">Custom</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="field">
            <label>{area.accountTypeLabel ?? 'What type is this?'}</label>
            <select value={form.accountType} onChange={(e) => setForm((f) => ({ ...f, accountType: e.target.value }))}>
              <option value="">Select...</option>
              {area.accountTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Last 4 digits <span className="opt">(optional - never the full number)</span></label>
            <input
              value={form.lastFour}
              onChange={(e) => setForm((f) => ({ ...f, lastFour: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
              placeholder="e.g. 4821"
              inputMode="numeric"
              maxLength={4}
            />
          </div>

          <div className="field">
            <label>{area.locationLabel}</label>
            <input
              value={form.paperworkLocation}
              onChange={(e) => setForm((f) => ({ ...f, paperworkLocation: e.target.value }))}
              placeholder={area.locationPlaceholder}
            />
            <p className="field-hint">Tell your family where to look, not the actual login details.</p>
          </div>

          <div className="field">
            <label>Who should they call? <span className="opt">(optional)</span></label>
            <input
              value={form.whoToCall}
              onChange={(e) => setForm((f) => ({ ...f, whoToCall: e.target.value }))}
              placeholder="e.g. Estate services, advisor, HR, agent, or trusted contact"
            />
          </div>

          <div className="field">
            <label>What should your family know?</label>
            <textarea
              value={form.purposeNotes}
              onChange={(e) => setForm((f) => ({ ...f, purposeNotes: e.target.value }))}
              placeholder="e.g. This is our main household account. Mortgage is auto-paid from here."
            />
          </div>

          <div className="field">
            <label>Additional notes <span className="opt">(optional)</span></label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Anything else your family should know. Do not include passwords, SSNs, PINs, or full account numbers."
            />
            <p className="field-hint danger">Never write account numbers, passwords, SSNs, or PINs here.</p>
          </div>

          {saveError && <p className="field-error">{saveError}</p>}

          <button type="submit" disabled={saving} className="save-btn">{saving ? 'Saving...' : editing ? 'Save changes' : 'Save entry'}</button>
          <button type="button" className="add-another-btn" onClick={clearForm}>
            {editing ? 'Cancel edit' : area.addAnotherLabel ?? '+ Add another account'}
          </button>
        </form>

        <aside className="saved-section designed-saved-section">
          <h3>Saved to your plan</h3>
          {visibleItems.length === 0 ? (
            <div className="empty-state compact">
              <div className="emoji">+</div>
              <p>No entries here yet. Add the first item so your family knows where to start.</p>
            </div>
          ) : (
            <div className="entries-list">
              {visibleItems.map((item) => (
                <div className="saved-pill" key={item.id}>
                  <div className="pill-icon"><Icon name={area.icon} /></div>
                  <div className="pill-main">
                    <div className="pill-name">{item.institutionName}{item.lastFour ? ` ...${item.lastFour}` : ''}</div>
                    <div className="pill-meta">{[item.accountType, item.paperworkLocation].filter(Boolean).join(' - ')}</div>
                    {item.purposeNotes && <p>{item.purposeNotes}</p>}
                  </div>
                  <div className="pill-actions">
                    <button type="button" onClick={() => edit(item)}>Edit</button>
                    <button type="button" onClick={() => remove(item.id)} disabled={deleting === item.id}>{deleting === item.id ? '...' : 'Remove'}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </section>

      <Link href="/vault" className="back-to-plan">← Back to all planning areas</Link>
    </div>
  );
}
