import Link from 'next/link';
import type { ReactNode } from 'react';
import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';

export const metadata = { title: 'Planning areas — Mourning Guide' };

type VaultArea = [name: string, desc: string, href: string, areaIcon: ReactNode];

function icon(path: ReactNode) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
  );
}

const AREAS: VaultArea[] = [
  ['Banks & savings', 'Checking, savings, and CDs', '/vault/finances?category=bank', icon(<><path d="M3 9l9-7 9 7v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 9h18"/><rect x="8" y="13" width="3" height="7"/><rect x="13" y="13" width="3" height="7"/></>)],
  ['Credit cards & loans', 'Cards, personal and auto loans', '/vault/finances?category=credit_card', icon(<><rect x="2" y="6" width="20" height="14" rx="3"/><path d="M2 10h20"/><path d="M6 15h3M14 15h4"/></>)],
  ['Investments & retirement', '401k, IRA, brokerage accounts', '/vault/finances?category=investment', icon(<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>)],
  ['Insurance', 'Life, health, auto, and home', '/vault/finances?category=insurance', icon(<><path d="M12 2 4 6v6c0 5.25 3.5 10.15 8 11.35C16.5 22.15 20 17.25 20 12V6z"/><path d="M9 12l2 2 4-4"/></>)],
  ['Real estate & property', 'Home, mortgage, and rentals', '/vault/finances?category=property', icon(<><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-9h6v9"/></>)],
  ['Vehicles', 'Cars, motorcycles, boats', '/vault/finances?category=vehicle', icon(<><path d="M5 17H3v-5l2.5-6h11L19 12v5h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/><path d="M5 12h14"/></>)],
  ['Business interests', 'Ownership, partnerships, shares', '/vault/finances?category=business', icon(<><rect x="2" y="9" width="20" height="12" rx="2"/><path d="M16 9V7a4 4 0 0 0-8 0v2"/><path d="M12 14v2"/></>)],
  ['Legal & important papers', 'Will, trust, power of attorney', '/vault/documents', icon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/></>)],
  ['Digital life & accounts', 'Email, social, cloud storage', '/vault/finances?category=digital', icon(<><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1"/></>)],
  ['Subscriptions & services', 'Streaming, phone, memberships', '/vault/finances?category=subscription', icon(<><rect x="7" y="2" width="10" height="20" rx="3"/><path d="M11 18h2"/><path d="M10 6h4"/></>)],
  ['Utilities & home services', 'Electric, gas, water, internet', '/vault/finances?category=utility', icon(<path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12z"/>)],
  ['Pets', 'Vet, care instructions, new home', '/vault/finances?category=pet', icon(<><path d="M11 20c0-2.5-2-4-2-7a3 3 0 0 1 6 0c0 3-2 4.5-2 7"/><circle cx="6" cy="8" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="14" r="1.5"/><circle cx="20" cy="14" r="1.5"/></>)],
  ['Special items & sentimental', 'Jewelry, art, heirlooms', '/vault/finances?category=special_item', icon(<><path d="M6 3h12l3 5-9 13L3 8z"/><path d="M3 8h18"/><path d="M12 21V8M6 3l3 5M18 3l-3 5"/></>)],
  ['Government & benefits', 'Social Security, VA benefits, pension, Medicare', '/vault/finances?category=government', icon(<><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M7 10v11M11 10v11M13 10v11M17 10v11"/></>)],
  ['Funeral & final wishes', 'Burial, cremation, service wishes, prepaid arrangements', '/portal/service-details', icon(<><path d="M12 22V12"/><path d="M12 12C12 7 7 4 4 6c3 1 5 4 8 6z"/><path d="M12 12c0-5 5-8 8-6-3 1-5 4-8 6z"/><path d="M8 22h8"/></>)],
  ['Documents', 'Upload IDs, policies, wills, trusts, and files', '/vault/documents', icon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>)],
];

export default async function VaultOverviewPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Personal" active="vault">
      <h1 className="page-heading" data-walkthrough="walkthrough-vault-heading">Your planning areas</h1>
      <p className="page-sub">Tap any area to add your details. Work in any order. Everything is optional, and you can come back anytime.</p>
      <div className="areas-grid" data-walkthrough="walkthrough-vault-grid">
        {AREAS.map(([name, desc, href, areaIcon]) => (
          <Link key={name} href={href} className="area-tile">
            <div className="tile-icon">{areaIcon}</div>
            <div className="tile-name">{name}</div>
            <div className="tile-desc">{desc}</div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
