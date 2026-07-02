import type { Metadata } from 'next';
import MarketingShell from '@/components/MarketingShell';
import { prepareMarketingHtml } from '@/lib/marketing-html';

export const metadata: Metadata = {
  title: 'About Mourning Guide — Our Mission & Why We Built This',
  description: "Mourning Guide is a calm, independent guide through end-of-life planning and loss. Not a funeral home, not a law firm, not affiliated with any service we mention. Built for US families.",
};

const MAIN = `
  <section style="padding:32px 0 52px;display:grid;grid-template-columns:1fr 0.7fr;gap:48px;align-items:center;border-bottom:1px solid rgba(142,95,70,0.14);">
    <div>
      <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 14px;">Our mission</p>
      <h1 style="font-family:var(--serif);font-size:clamp(2.6rem,4.5vw,4.2rem);font-weight:500;line-height:0.97;letter-spacing:-0.02em;margin:0 0 22px;">A calm guide in your pocket.<br>Not a funeral home.</h1>
      <p style="font-size:1.06rem;color:#594b43;line-height:1.72;max-width:56ch;margin:0;">Mourning Guide exists to help people plan the practical and personal side of death — and to give families one clear next step when it happens. We're not here to sell you anything. We're here to help.</p>
    </div>
    <div style="border-radius:28px;overflow:hidden;box-shadow:0 22px 52px rgba(67,46,33,0.14);position:relative;">
      <img src="/assets/about/hands-couple.jpg" alt="Elderly couple holding hands — a life of love between them" style="width:100%;height:480px;object-fit:cover;object-position:center 35%;display:block;filter:sepia(0.22) saturate(0.8) brightness(0.96) contrast(1.04);" />
      <div style="position:absolute;inset:0;background:rgba(196,156,120,0.12);pointer-events:none;"></div>
    </div>
  </section>

  <section style="padding:52px 0 0;">
    <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 10px;">Why we built this</p>
    <h2 style="font-family:var(--serif);font-size:clamp(2rem,3vw,2.8rem);font-weight:500;margin:0 0 28px;max-width:28ch;">Because no one should have to guess when they're already in pain.</h2>
    <div style="display:grid;grid-template-columns:1.1fr 0.9fr;gap:22px;align-items:start;">
      <div>
        <div style="padding:32px;border:1px solid rgba(142,95,70,0.18);border-radius:24px;background:linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.9));box-shadow:0 16px 38px rgba(67,46,33,0.07);margin-bottom:18px;">
          <p style="color:#594b43;font-size:1.02rem;line-height:1.75;margin:0 0 18px;">When someone dies, their family faces hundreds of practical decisions in the worst possible mental state. Which bank? Which phone number? What documents does Social Security need? Does the cell carrier have a bereavement process, and if so, what is it?</p>
          <p style="color:#594b43;font-size:1.02rem;line-height:1.75;margin:0;">Meanwhile, the person who planned everything — who knew the answers — is gone. And everything they knew went with them.</p>
        </div>
        <div style="padding:32px;border:1px solid rgba(142,95,70,0.18);border-radius:24px;background:linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.9));box-shadow:0 16px 38px rgba(67,46,33,0.07);">
          <p style="color:#594b43;font-size:1.02rem;line-height:1.75;margin:0 0 18px;">Mourning Guide changes that. Not by solving death — nothing does — but by giving families a map. The accounts, the documents, the wishes, the letters. The things that make the difference between chaos and clarity in the days and weeks after a loss.</p>
          <p style="color:#594b43;font-size:1.02rem;line-height:1.75;margin:0;">And for people planning ahead: the gift of sparing your family from guessing.</p>
        </div>
      </div>
      <div style="padding:36px;border:1px solid rgba(197,123,87,0.28);border-radius:24px;background:radial-gradient(circle at 80% 12%,rgba(216,137,99,0.12),transparent 38%),linear-gradient(135deg,rgba(233,222,209,0.76),rgba(252,247,241,0.88));box-shadow:0 16px 38px rgba(67,46,33,0.08);display:flex;flex-direction:column;justify-content:center;">
        <div style="position:relative;border-radius:16px;overflow:hidden;margin-bottom:22px;">
          <img src="/assets/about/grandma-kids-woods.jpg" alt="A grandmother showing her grandchildren something in the garden, seen from behind" style="width:100%;height:200px;object-fit:cover;object-position:center 20%;display:block;filter:sepia(0.28) saturate(0.72) brightness(0.95) contrast(1.05);" />
          <div style="position:absolute;inset:0;background:rgba(196,156,120,0.14);pointer-events:none;"></div>
        </div>
        <blockquote style="margin:0 0 18px;font-family:var(--serif);font-size:2rem;line-height:1.18;color:#2f241f;">"I wanted my kids to have answers, not questions."</blockquote>
        <p style="color:#594b43;font-size:0.92rem;line-height:1.6;margin:0;">That's what planning ahead with Mourning Guide is for. Not paperwork. Not a legal service. A calm, private place to leave everything your family will need.</p>
      </div>
    </div>
  </section>

  <section style="margin-top:52px;padding:40px;border:1px solid rgba(142,95,70,0.18);border-radius:28px;background:radial-gradient(circle at top left,rgba(216,137,99,0.1),transparent 42%),linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,250,244,0.94));box-shadow:0 18px 40px rgba(67,46,33,0.08);">
    <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 10px;">For families helping a parent</p>
    <h2 style="font-family:var(--serif);font-size:clamp(1.9rem,3vw,2.6rem);font-weight:500;margin:0 0 16px;max-width:24ch;">Set it up for them. Keep your own plan too.</h2>
    <p style="color:#594b43;font-size:1rem;line-height:1.72;margin:0 0 28px;max-width:62ch;">Many adult children build a Mourning Guide for a parent who will never open an app — and keep a separate plan for themselves. One email login. Two plans. Switch anytime from the header.</p>

    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:28px;">
      <div style="padding:24px;border:1px solid rgba(142,95,70,0.14);border-radius:20px;background:rgba(255,255,255,0.55);">
        <h3 style="font-family:var(--serif);font-size:1.2rem;font-weight:500;margin:0 0 8px;color:#2f241f;">1. Add a plan for them</h3>
        <p style="color:#594b43;font-size:0.88rem;line-height:1.65;margin:0;">Choose <strong>A parent or loved one</strong> at signup — or add another plan later from Settings. Enter their name and state. You build the vault; they are the person the plan is for.</p>
      </div>
      <div style="padding:24px;border:1px solid rgba(142,95,70,0.14);border-radius:20px;background:rgba(255,255,255,0.55);">
        <h3 style="font-family:var(--serif);font-size:1.2rem;font-weight:500;margin:0 0 8px;color:#2f241f;">2. No text required</h3>
        <p style="color:#594b43;font-size:0.88rem;line-height:1.65;margin:0;">If your parent can't confirm by SMS — no mobile phone, dementia, or they simply won't use text — that's fine. Confirm you're helping on their behalf and start building immediately. No waiting on a text reply.</p>
      </div>
      <div style="padding:24px;border:1px solid rgba(142,95,70,0.14);border-radius:20px;background:rgba(255,255,255,0.55);">
        <h3 style="font-family:var(--serif);font-size:1.2rem;font-weight:500;margin:0 0 8px;color:#2f241f;">3. Switch between plans</h3>
        <p style="color:#594b43;font-size:0.88rem;line-height:1.65;margin:0;">Use the <strong>Viewing</strong> menu at the top of the app to flip between <em>My plan</em> and <em>Mom's plan</em> (or Dad's). You pay for each planning account separately if you keep both on Guide Plan.</p>
      </div>
    </div>

    <div style="padding:22px 24px;border-radius:18px;border:1px solid rgba(197,123,87,0.22);background:rgba(255,250,244,0.85);margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:0.82rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#7a5341;">What we don't require</p>
      <ul style="margin:0;padding:0;list-style:none;display:grid;gap:8px;">
        <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.9rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:6px;width:7px;height:7px;border-radius:50%;background:#b76545;"></span>Your parent does not need their own login or email</li>
        <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.9rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:6px;width:7px;height:7px;border-radius:50%;background:#b76545;"></span>SMS confirmation is optional — not a blocker</li>
        <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.9rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:6px;width:7px;height:7px;border-radius:50%;background:#b76545;"></span>Your parent never has to touch billing unless you want them to</li>
        <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.9rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:6px;width:7px;height:7px;border-radius:50%;background:#b76545;"></span>When the time comes, your family still unlocks everything at no cost if the plan was active</li>
      </ul>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:center;">
      <a class="coded-button primary" href="/onboarding?path=planning&amp;new=1">Set up a plan for a parent</a>
      <a class="coded-button secondary" href="/help">Read common questions</a>
    </div>
  </section>

  <section style="margin-top:52px;">
    <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 10px;">Who we are</p>
    <h2 style="font-family:var(--serif);font-size:clamp(1.8rem,2.8vw,2.4rem);font-weight:500;margin:0 0 28px;">Your guide. On your side.</h2>
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;">
      <div style="padding:28px;border:1px solid rgba(142,95,70,0.18);border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.9));">
        <h3 style="font-family:var(--serif);font-size:1.35rem;font-weight:500;margin:0 0 10px;">We are</h3>
        <ul style="margin:0;padding:0;list-style:none;display:grid;gap:9px;">
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:#b76545;"></span>A private, secure vault for everything your family needs</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:#b76545;"></span>A calm, step-by-step guide for grieving families</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:#b76545;"></span>An independent advocate — not owned by anyone selling anything</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:#b76545;"></span>Plain language, no jargon, no fear-based sales</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:#b76545;"></span>Direct to consumer — no employer code required</li>
        </ul>
      </div>
      <div style="padding:28px;border:1px solid rgba(142,95,70,0.18);border-radius:22px;background:linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.9));">
        <h3 style="font-family:var(--serif);font-size:1.35rem;font-weight:500;margin:0 0 10px;">We are not</h3>
        <ul style="margin:0;padding:0;list-style:none;display:grid;gap:9px;">
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:rgba(142,95,70,0.4);"></span>A funeral home or funeral package seller</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:rgba(142,95,70,0.4);"></span>A law firm or probate service</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:rgba(142,95,70,0.4);"></span>An employer-gated or insurance-company benefit</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:rgba(142,95,70,0.4);"></span>A marketplace taking referral fees or commissions from any provider</li>
          <li style="display:flex;gap:12px;align-items:flex-start;font-size:0.92rem;color:#594b43;line-height:1.55;"><span style="flex-shrink:0;margin-top:5px;width:8px;height:8px;border-radius:50%;background:rgba(142,95,70,0.4);"></span>In-app grief therapy or clinical mental health</li>
        </ul>
      </div>
    </div>
  </section>

  <section style="margin-top:52px;display:grid;grid-template-columns:420px 1fr;min-height:300px;border-radius:28px;overflow:hidden;background:radial-gradient(circle at 91% 50%,rgba(214,190,166,0.12),transparent 23%),#fbf5ee;box-shadow:0 14px 32px rgba(67,46,33,0.07);">
    <div style="position:relative;width:420px;height:300px;flex-shrink:0;">
      <img src="/assets/about/family-portrait.jpg" alt="Grandparents smiling with their grandchildren, gathered together at home" style="width:420px;height:300px;object-fit:cover;object-position:center 30%;display:block;filter:sepia(0.35) saturate(0.65) brightness(0.94) contrast(1.05);" />
      <div style="position:absolute;inset:0;background:rgba(196,156,120,0.16);pointer-events:none;"></div>
    </div>
    <div style="padding:40px 48px;display:flex;flex-direction:column;justify-content:center;">
      <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 10px;">Our promise</p>
      <h2 style="font-family:var(--serif);font-size:clamp(1.6rem,2.5vw,2.2rem);font-weight:500;line-height:1.15;margin:0 0 14px;color:#2f241f;">We're here for both moments — the planning and the loss.</h2>
      <p style="color:#594b43;font-size:0.96rem;line-height:1.68;margin:0;max-width:44ch;">We built Mourning Guide because we believe everyone deserves a calm, clear guide — whether you're thinking ahead for your family, or facing the hardest days of your life right now.</p>
    </div>
  </section>

  <section style="margin-top:52px;">
    <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 10px;">How we work</p>
    <h2 style="font-family:var(--serif);font-size:clamp(1.8rem,2.8vw,2.4rem);font-weight:500;margin:0 0 28px;">Principles we won't compromise on.</h2>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;">
      <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
        <div style="width:38px;height:38px;margin-bottom:16px;border:1px solid rgba(183,101,69,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,250,244,0.9);color:#b76545;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="8" width="12" height="9" rx="1.5"/><path d="M6 8V6a3 3 0 0 1 6 0v2"/></svg></div>
        <h3 style="font-family:var(--serif);font-size:1.18rem;font-weight:500;margin:0 0 8px;">Map, not keys</h3>
        <p style="color:#594b43;font-size:0.86rem;line-height:1.65;margin:0;">We store institution names and contacts — never passwords, SSNs, or account numbers. Enough for your family to act. Nothing a thief can use.</p>
      </div>
      <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
        <div style="width:38px;height:38px;margin-bottom:16px;border:1px solid rgba(183,101,69,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,250,244,0.9);color:#b76545;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 1v10M5 7l4 4 4-4"/><rect x="2" y="13" width="14" height="4" rx="1"/></svg></div>
        <h3 style="font-family:var(--serif);font-size:1.18rem;font-weight:500;margin:0 0 8px;">Your data is yours</h3>
        <p style="color:#594b43;font-size:0.86rem;line-height:1.65;margin:0;">Export everything anytime — full PDF with original files, sent to your verified email only. Delete everything with MFA. We'll never hold your data hostage.</p>
      </div>
      <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
        <div style="width:38px;height:38px;margin-bottom:16px;border:1px solid rgba(183,101,69,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,250,244,0.9);color:#b76545;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="9" r="8"/><path d="M9 5v4l3 3"/></svg></div>
        <h3 style="font-family:var(--serif);font-size:1.18rem;font-weight:500;margin:0 0 8px;">One step at a time</h3>
        <p style="color:#594b43;font-size:0.86rem;line-height:1.65;margin:0;">Grief comes with cognitive fog. Our grief path shows max 3 tasks at a time. "Done for now" — explicit permission to stop. No overdue badges, no urgency theater.</p>
      </div>
      <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
        <div style="width:38px;height:38px;margin-bottom:16px;border:1px solid rgba(183,101,69,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,250,244,0.9);color:#b76545;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8A9 9 0 0 0 0 8"/><path d="M18 10A9 9 0 0 1 0 10"/><line x1="9" y1="1" x2="9" y2="17"/></svg></div>
        <h3 style="font-family:var(--serif);font-size:1.18rem;font-weight:500;margin:0 0 8px;">No paid placement</h3>
        <p style="color:#594b43;font-size:0.86rem;line-height:1.65;margin:0;">Funeral home finder, keepsake companies, grief resources — we list what helps, not who paid us. We are not affiliated with any service we mention, and we receive no referral fees or commissions. Your trust comes first.</p>
      </div>
      <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
        <div style="width:38px;height:38px;margin-bottom:16px;border:1px solid rgba(183,101,69,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,250,244,0.9);color:#b76545;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 16.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 5v4l2 2"/></svg></div>
        <h3 style="font-family:var(--serif);font-size:1.18rem;font-weight:500;margin:0 0 8px;">Honest about AI</h3>
        <p style="color:#594b43;font-size:0.86rem;line-height:1.65;margin:0;">We won't pretend AI knew your loved one. Eulogy prompts are real, human-written starters — not generated content. We'll always be clear about where AI is and isn't used.</p>
      </div>
      <div style="padding:26px;border:1px solid rgba(142,95,70,0.16);border-radius:22px;background:rgba(255,250,244,0.82);">
        <div style="width:38px;height:38px;margin-bottom:16px;border:1px solid rgba(183,101,69,0.3);border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,250,244,0.9);color:#b76545;"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 6l4 4 4-4 4 4 4-4"/><rect x="1" y="6" width="16" height="10" rx="1.5"/></svg></div>
        <h3 style="font-family:var(--serif);font-size:1.18rem;font-weight:500;margin:0 0 8px;">Grief is free, always</h3>
        <p style="color:#594b43;font-size:0.86rem;line-height:1.65;margin:0;">Grief support is free now and will always remain free. No upsells, no paywalls — ever. No one navigating loss should have to think about cost.</p>
      </div>
    </div>
  </section>

  <section style="margin-top:48px;padding:48px 40px;text-align:center;border:1px solid rgba(142,95,70,0.16);border-radius:28px;background:radial-gradient(circle at top center,rgba(216,137,99,0.1),transparent 38%),linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.9));box-shadow:0 18px 40px rgba(67,46,33,0.08);">
    <h2 style="font-family:var(--serif);font-size:clamp(1.8rem,2.8vw,2.6rem);font-weight:500;margin:0 0 12px;">Start where you are.</h2>
    <p style="color:#594b43;line-height:1.72;max-width:50ch;margin:0 auto 28px;">Planning ahead is free for 14 days — no credit card. And if someone just died, the grief path is free right now and always will be.</p>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:16px;">
      <a class="coded-button primary" href="/onboarding?path=planning">Start planning — free trial</a>
      <a class="coded-button secondary" href="/onboarding?path=grief">I need help after a loss</a>
    </div>
  </section>
`;

export default function AboutPage() {
  return (
    <MarketingShell current="about">
      <main style={{ padding: '0 58px 72px' }} dangerouslySetInnerHTML={{ __html: prepareMarketingHtml(MAIN) }} />
    </MarketingShell>
  );
}
