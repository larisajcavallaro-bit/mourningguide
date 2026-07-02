import Link from 'next/link';
import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';

export const metadata = { title: 'Planning areas — Mourning Guide' };

const AREAS = [
  ['Banks & savings', 'Checking, savings, and CDs', '/vault/finances?category=bank'],
  ['Credit cards & loans', 'Cards, personal and auto loans', '/vault/finances?category=credit_card'],
  ['Investments & retirement', '401k, IRA, brokerage accounts', '/vault/finances?category=investment'],
  ['Insurance', 'Life, health, auto, and home', '/vault/finances?category=insurance'],
  ['Real estate & property', 'Home, mortgage, and rentals', '/vault/finances?category=property'],
  ['Vehicles', 'Cars, motorcycles, boats', '/vault/finances?category=vehicle'],
  ['Business interests', 'Ownership, partnerships, shares', '/vault/finances?category=business'],
  ['Legal & important papers', 'Will, trust, power of attorney', '/vault/documents'],
  ['Digital life & accounts', 'Email, social, cloud storage', '/vault/finances?category=digital'],
  ['Subscriptions & services', 'Streaming, phone, memberships', '/vault/finances?category=subscription'],
  ['Utilities & home services', 'Electric, gas, water, internet', '/vault/finances?category=utility'],
  ['Pets', 'Vet, care instructions, new home', '/vault/finances?category=pet'],
  ['Special items & sentimental', 'Jewelry, art, heirlooms', '/vault/finances?category=special_item'],
  ['Government & benefits', 'Social Security, VA benefits, pension, Medicare', '/vault/finances?category=government'],
  ['Funeral & final wishes', 'Burial, cremation, service wishes, prepaid arrangements', '/portal/service-details'],
  ['Documents', 'Upload IDs, policies, wills, trusts, and files', '/vault/documents'],
];

export default async function VaultOverviewPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Personal" active="vault">
      <h1 className="page-heading" data-walkthrough="walkthrough-vault-heading">Your planning areas</h1>
      <p className="page-sub">Tap any area to add your details. Work in any order. Everything is optional, and you can come back anytime.</p>
      <div className="areas-grid" data-walkthrough="walkthrough-vault-grid">
        {AREAS.map(([name, desc, href]) => (
          <Link key={name} href={href} className="area-tile">
            <div className="tile-icon">+</div>
            <div className="tile-name">{name}</div>
            <div className="tile-desc">{desc}</div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
