import Link from 'next/link';
import type { ReactNode } from 'react';
import { requirePlanningAccount } from '@/lib/account';
import AppShell from '@/components/AppShell';

export const metadata = { title: 'Remember — Mourning Guide' };

type RememberArea = [name: string, desc: string, href: string, status: string, areaIcon: ReactNode];

function icon(path: ReactNode) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
  );
}

const REMEMBER_AREAS: RememberArea[] = [
  ['Letters to loved ones', 'Write now. Each recipient gets a private link after your passing.', '/vault/letters', 'Delivered privately', icon(<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></>)],
  ['Photos & memories', 'Upload photos and write captions for your memorial portal.', '/remember/photos', 'Shown on portal', icon(<><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></>)],
  ['Voice & video messages', 'Record yourself speaking. Deliver privately or on your portal.', '/remember/voice-video', 'Personal & lasting', icon(<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/></>)],
  ['Music for your service', 'Choose songs and moments for a funeral or memorial service.', '/remember/music', 'Service planning', icon(<><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>)],
  ['Obituary & eulogy', 'Write your own words or leave notes for someone you trust.', '/remember/obituary', 'Your words', icon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/></>)],
  ['Speakers & readings', 'Name who should speak, read, pray, or perform.', '/remember/speakers', 'Service planning', icon(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>)],
];

export default async function RememberPage() {
  await requirePlanningAccount();
  return (
    <AppShell title="Remember" active="remember">
      <h1 className="page-heading">Remember</h1>
      <p className="page-sub">Leave what you want left behind — letters to each person you love, photos, music, your voice. Stored privately and delivered exactly as you intended, after your passing.</p>

      <p className="section-label-lg">What you can leave</p>
      <div className="feature-grid remember-feature-grid">
        {REMEMBER_AREAS.map(([name, desc, href, status, areaIcon]) => (
          <Link key={name} href={href} className="feature-tile">
            <div className="feature-icon">{areaIcon}</div>
            <div className="feature-name">{name}</div>
            <div className="feature-desc">{desc}</div>
            <span className="feature-status">{status}</span>
          </Link>
        ))}
      </div>

      <p className="section-label-lg">How it works</p>
      <div className="how-card">
        <div className="how-row">
          <div className="how-num">1</div>
          <div className="how-text"><strong>Add anything, in any order</strong><span>Nothing is sent or published while you&apos;re alive. Everything stays private.</span></div>
        </div>
        <div className="how-row">
          <div className="how-num">2</div>
          <div className="how-text"><strong>Your legacy contact confirms your passing</strong><span>They use their secure activation link and the built-in waiting period protects against mistakes.</span></div>
        </div>
        <div className="how-row">
          <div className="how-num">3</div>
          <div className="how-text"><strong>Everything is delivered as intended</strong><span>Letters go to named recipients. Photos, music, and service notes appear where you chose.</span></div>
        </div>
      </div>
    </AppShell>
  );
}
