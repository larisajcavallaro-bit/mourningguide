import type { Metadata } from 'next';
import MarketingShell from '@/components/MarketingShell';
import { prepareMarketingHtml } from '@/lib/marketing-html';

export const metadata: Metadata = {
  title: 'How It Works | Mourning Guide — End-of-Life Planning & First Steps After Death',
  description: 'Mourning Guide works two ways: plan your estate with calm confidence, or get one clear next step — a checklist after the death of a loved one — always free.',
};

const MAIN = `
  <section style="padding:28px 0 52px;">
    <div style="display:grid;grid-template-columns:1fr 390px;gap:48px;align-items:start;margin-bottom:52px;">
      <div>
        <p style="font-size:0.75rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0 0 14px;">How it works</p>
        <h1 style="font-family:var(--serif);font-size:clamp(3rem,5.5vw,5.2rem);font-weight:500;line-height:0.97;letter-spacing:-0.02em;margin:0 0 22px;max-width:18ch;">Two paths.<br>One calm guide.</h1>
        <p style="font-size:1.06rem;color:#594b43;line-height:1.72;max-width:48ch;margin:0;">Mourning Guide adapts to where you are. Plan your estate at your own pace, or get a step-by-step checklist for after the death of a loved one — free, with no time limit.</p>
      </div>
      <div style="border-radius:22px;overflow:hidden;box-shadow:0 24px 52px rgba(67,46,33,0.14);">
        <img src="/assets/about/hands-couple.jpg" alt="Elderly couple's hands held together — a moment of quiet love" style="width:390px;height:480px;object-fit:cover;object-position:center 40%;display:block;filter:sepia(0.18) saturate(0.85) brightness(0.97);" />
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;">

      <div style="display:flex;flex-direction:column;gap:16px;padding:36px;border:2px solid rgba(142,95,70,0.2);border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.9));box-shadow:0 18px 40px rgba(67,46,33,0.08);">
        <p style="font-size:0.72rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0;">Planning path</p>
        <h2 style="font-family:var(--serif);font-size:2rem;font-weight:500;margin:0;color:#2f241f;">I'm planning ahead for my family.</h2>
        <p style="color:#594b43;line-height:1.68;font-size:0.96rem;margin:0;">You're thinking ahead — and that's the greatest gift you can give the people you love. Build a vault at your own pace, write letters held until the right moment, and leave your family a map instead of a mystery.</p>
        <ul style="margin:0;padding:0;list-style:none;display:grid;gap:7px;">
          <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.86rem;color:#594b43;line-height:1.5;"><span style="flex-shrink:0;margin-top:3px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>16-area private vault — accounts, documents, wishes</li>
          <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.86rem;color:#594b43;line-height:1.5;"><span style="flex-shrink:0;margin-top:3px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Sealed letters released to family after your passing</li>
          <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.86rem;color:#594b43;line-height:1.5;"><span style="flex-shrink:0;margin-top:3px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Company guides for 100+ banks, carriers, agencies</li>
          <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.86rem;color:#594b43;line-height:1.5;"><span style="flex-shrink:0;margin-top:3px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Memorial portal, ready to go live after your passing</li>
        </ul>
        <div style="margin-top:auto;padding-top:16px;display:flex;flex-direction:column;gap:10px;">
          <a class="coded-button primary" href="/marketing/planning-path.html" style="text-align:center;">See how the planning path works →</a>
          <p style="margin:0;text-align:center;font-size:0.82rem;color:#7a5341;">14-day free trial · No credit card · <a href="/onboarding/planning-signup.html" style="color:#c86d49;text-decoration:underline;text-underline-offset:3px;">Start now</a></p>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px;padding:36px;border:2px solid rgba(142,95,70,0.2);border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,0.66),rgba(255,250,244,0.9));box-shadow:0 18px 40px rgba(67,46,33,0.08);">
        <p style="font-size:0.72rem;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#c86d49;margin:0;">Grief path</p>
        <h2 style="font-family:var(--serif);font-size:2rem;font-weight:500;margin:0;color:#2f241f;">Someone I love just died.</h2>
        <p style="color:#594b43;line-height:1.68;font-size:0.96rem;margin:0;">You're in the fog. We know. We won't give you a 270-item checklist. We'll give you three things to do today — and nothing more until you're ready. No credit card. Always free.</p>
        <ul style="margin:0;padding:0;list-style:none;display:grid;gap:7px;">
          <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.86rem;color:#594b43;line-height:1.5;"><span style="flex-shrink:0;margin-top:3px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Max 3 tasks at a time — never more than you can hold</li>
          <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.86rem;color:#594b43;line-height:1.5;"><span style="flex-shrink:0;margin-top:3px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Day-by-day guidance that shifts as weeks pass</li>
          <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.86rem;color:#594b43;line-height:1.5;"><span style="flex-shrink:0;margin-top:3px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>Vault merge if your loved one had a plan</li>
          <li style="display:flex;gap:10px;align-items:flex-start;font-size:0.86rem;color:#594b43;line-height:1.5;"><span style="flex-shrink:0;margin-top:3px;width:14px;height:14px;border-radius:50%;background:radial-gradient(circle at center,#b76545 0 45%,transparent 48%);border:1px solid rgba(183,101,69,0.4);"></span>"Done for now" — explicit permission to stop</li>
        </ul>
        <div style="margin-top:auto;padding-top:16px;display:flex;flex-direction:column;gap:10px;">
          <a class="coded-button secondary" href="/marketing/grief-path.html" style="text-align:center;">See what day one looks like →</a>
          <p style="margin:0;text-align:center;font-size:0.82rem;color:#7a5341;">Always free · No credit card · <a href="/onboarding/grief-signup.html" style="color:#c86d49;text-decoration:underline;text-underline-offset:3px;">Get help now</a></p>
        </div>
      </div>

    </div>
  </section>
`;

export default function HowItWorksPage() {
  return (
    <MarketingShell current="how-it-works">
      <main style={{ padding: '0 58px 72px' }} dangerouslySetInnerHTML={{ __html: prepareMarketingHtml(MAIN) }} />
    </MarketingShell>
  );
}
