import type { Metadata } from 'next';
import MarketingShell from '@/components/MarketingShell';
import { prepareMarketingHtml } from '@/lib/marketing-html';

export const metadata: Metadata = {
  title: 'Pricing | Mourning Guide — Free Grief Support, 14-Day Planning Trial',
  description: 'Grief support is always free — no credit card, no time limit. Planning ahead is 14 days full access, no credit card required, then $89/year. Your family never pays after your passing.',
};

const MAIN = `
  <section style="padding:28px 0 52px;text-align:center;">
    <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 14px;">Pricing</p>
    <h1 style="font-family:var(--serif);font-size:clamp(2.8rem,5vw,4.4rem);font-weight:500;line-height:0.97;letter-spacing:-0.02em;margin:0 0 18px;max-width:22ch;margin-inline:auto;">Free when you're grieving.<br>Free trial when you're planning.</h1>
    <p style="font-size:1.06rem;color:#594b43;line-height:1.72;max-width:54ch;margin:0 auto 12px;">Grief is already expensive enough. The support you need when someone dies is always free — no card, no subscription, no time limit.</p>
    <p style="font-size:1.06rem;color:#594b43;line-height:1.72;max-width:54ch;margin:0 auto;">Planning ahead is full access for 14 days, no credit card required. Then $89/year — only if it's helping.</p>
  </section>

  <section style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;">

    <article style="padding:36px;border:1px solid rgba(197,123,87,0.32);border-radius:28px;background:radial-gradient(circle at 88% 10%,rgba(216,137,99,0.13),transparent 36%),linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,250,244,0.94));box-shadow:0 18px 42px rgba(67,46,33,0.1);">
      <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 10px;">Planning path · Guide Plan</p>
      <h2 style="font-family:var(--serif);font-size:2.6rem;font-weight:500;margin:0 0 4px;">$89<span style="font-size:1.4rem;font-weight:400;color:#594b43;">/year</span></h2>
      <p style="color:#594b43;font-size:0.9rem;margin:0 0 6px;">After a 14-day full trial — no card required to start.</p>
      <p style="color:#7a5341;font-size:0.84rem;font-style:italic;margin:0 0 28px;">Try everything free. No upgrade prompts during the trial.</p>
      <div style="margin-bottom:28px;">
        <p style="font-size:0.82rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#7a5341;margin:0 0 14px;">What's included</p>
        <ul style="margin:0;padding:0;list-style:none;display:grid;gap:10px;">
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Unlimited vault editing across all 16 areas</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Letters for each loved one — written now, released after your passing</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Up to 3 legacy contacts + 1 admin with role-based access</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Unlimited notification contacts, phased delivery</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Memorial portal + 12 months hosting after your passing</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Export anytime — even after cancellation</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#7a5341;line-height:1.55;font-weight:600;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Your family unlocks everything at no cost when the time comes</li>
        </ul>
      </div>
      <a class="coded-button primary" href="/onboarding/planning-signup.html" style="width:100%;display:flex;justify-content:center;min-height:54px;">Start free 14-day trial</a>
      <p style="margin:12px 0 0;font-size:0.82rem;color:#7a5341;text-align:center;">No credit card until trial ends. Cancel anytime.</p>
    </article>

    <article style="padding:36px;border:1px solid rgba(142,95,70,0.18);border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.92));box-shadow:0 18px 42px rgba(67,46,33,0.07);">
      <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 10px;">Grief path</p>
      <h2 style="font-family:var(--serif);font-size:2.6rem;font-weight:500;margin:0 0 6px;">Always free.</h2>
      <p style="color:#594b43;font-size:0.96rem;line-height:1.65;margin:0 0 28px;">No credit card. No trial period. Core grief support is free now and always will be.</p>
      <div style="margin-bottom:28px;">
        <p style="font-size:0.82rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#7a5341;margin:0 0 14px;">What's included</p>
        <ul style="margin:0;padding:0;list-style:none;display:grid;gap:10px;">
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Day 1–7 timeline — max 3 tasks at a time, never overwhelming</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Weeks 2–4 guidance: probate overview, COBRA deadline, estate timing</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Company bereavement guides for 100+ institutions</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Vault, full data export anytime (PDF + original files)</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Memorial portal customization and hosting</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Unlimited notification contacts — no caps, no upgrades</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:2px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Eulogy writing starters — real prompts, real structure, no AI</li>
        </ul>
      </div>
      <a class="coded-button secondary" href="/onboarding/grief-signup.html" style="width:100%;display:flex;justify-content:center;min-height:54px;">Get help now — no card needed</a>
      <p style="margin:16px 0 0;font-size:0.82rem;color:#7a5341;text-align:center;">The grief path is free now and always will be. No upsells, ever.</p>
    </article>

  </section>

  <section style="margin-top:48px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;">
    <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
      <h3 style="font-family:var(--serif);font-size:1.25rem;font-weight:500;margin:0 0 10px;">Your family never pays after your passing.</h3>
      <p style="color:#594b43;font-size:0.88rem;line-height:1.65;margin:0;">If your Guide Plan was active when you died, your legacy contacts and admin unlock the full vault, letters, and portal at no cost. That access is never paywalled.</p>
    </div>
    <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
      <h3 style="font-family:var(--serif);font-size:1.25rem;font-weight:500;margin:0 0 10px;">No countdown during your trial.</h3>
      <p style="color:#594b43;font-size:0.88rem;line-height:1.65;margin:0;">We'll never show "X days left" timers or upgrade banners during your 14-day trial. One optional note in Settings: your trial ends date. That's it.</p>
    </div>
    <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
      <h3 style="font-family:var(--serif);font-size:1.25rem;font-weight:500;margin:0 0 10px;">If you ever stop paying.</h3>
      <p style="color:#594b43;font-size:0.88rem;line-height:1.65;margin:0;">Your vault goes read-only for 90 days — not deleted. Export works the whole time. We'll never hold your information hostage.</p>
    </div>
  </section>

  <section style="margin-top:30px;padding:36px 40px;border:1px solid rgba(142,95,70,0.16);border-radius:28px;background:radial-gradient(circle at top right,rgba(216,137,99,0.1),transparent 32%),rgba(255,250,244,0.82);">
    <div style="display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center;">
      <div>
        <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 8px;">Give the gift of reassurance</p>
        <h2 style="font-family:var(--serif);font-size:1.9rem;font-weight:500;margin:0 0 10px;">Buy a Guide Plan for a parent or loved one.</h2>
        <p style="color:#594b43;font-size:0.92rem;line-height:1.65;margin:0;">An adult child pays — the parent controls the plan. They may never touch the billing. You just give them the gift of having it done. $89/year, billed to you.</p>
      </div>
      <a class="coded-button primary" href="/onboarding/planning-signup.html" style="white-space:nowrap;">Give as a gift</a>
    </div>
  </section>

  <section style="margin-top:30px;padding:48px 40px;text-align:center;border:1px solid rgba(142,95,70,0.16);border-radius:28px;background:radial-gradient(circle at top center,rgba(216,137,99,0.1),transparent 38%),linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.9));box-shadow:0 18px 40px rgba(67,46,33,0.08);">
    <h2 style="font-family:var(--serif);font-size:clamp(1.8rem,2.8vw,2.6rem);font-weight:500;margin:0 0 12px;">Start where you are.</h2>
    <p style="color:#594b43;line-height:1.72;max-width:52ch;margin:0 auto 28px;">If you're planning ahead, start free for 14 days. If someone just died, we're here now — no card, no barrier.</p>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;">
      <a class="coded-button primary" href="/onboarding/planning-signup.html">Start planning — free trial</a>
      <a class="coded-button secondary" href="/onboarding/grief-signup.html">I need help after a loss</a>
    </div>
  </section>
`;

export default function PricingPage() {
  return (
    <MarketingShell current="pricing">
      <main style={{ padding: '0 58px 72px' }} dangerouslySetInnerHTML={{ __html: prepareMarketingHtml(MAIN) }} />
    </MarketingShell>
  );
}
