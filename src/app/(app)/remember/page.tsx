import Link from 'next/link';
import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';

export const metadata = { title: 'Remember — Mourning Guide' };

const REMEMBER_AREAS = [
  ['Letters to loved ones', 'Write messages that are delivered after activation.', '/vault/letters'],
  ['Obituary & eulogy', 'Write it yourself or leave notes for someone you trust.', '/portal'],
  ['Photos & memories', 'Add photos and stories for your memorial page.', '/portal/gallery'],
  ['Voice & video messages', 'Plan private recordings for loved ones.', '/portal/gallery'],
  ['Speakers & readings', 'Choose eulogies, poems, prayers, and readings.', '/portal/service-details'],
  ['Music for your service', 'Add songs and moments for your service.', '/portal/service-details'],
];

export default async function RememberPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Remember" active="remember">
      <h1 className="page-heading">Remember</h1>
      <p className="page-sub">Leave words, memories, and service details in your own voice. Start with whatever feels easiest.</p>
      <div className="areas-grid remember-grid">
        {REMEMBER_AREAS.map(([name, desc, href]) => (
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
