import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingShell from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'Help Center | Mourning Guide',
  description: 'Answers about Mourning Guide accounts, privacy, planning, grief support, legacy contacts, memorial pages, billing, and account deletion.',
};

const faqs = [
  {
    title: 'What is Mourning Guide?',
    body: 'Mourning Guide is a private planning vault and practical guide for US families. You can plan ahead for your own family or use the free grief path after someone dies.',
  },
  {
    title: 'Is Mourning Guide a funeral home or law firm?',
    body: 'No. Mourning Guide is not a funeral home, law firm, probate service, financial adviser, tax adviser, health-care provider, or therapy service.',
  },
  {
    title: 'What should I store in my vault?',
    body: 'Store the practical map your family will need: institution names, who to contact, document locations, final wishes, letters, and trusted people. Do not store passwords, Social Security numbers, full account numbers, or credentials.',
  },
  {
    title: 'Can I set up Mourning Guide for a parent?',
    body: 'Yes. Choose "A parent or loved one" when creating a plan, or add another plan from Settings. You can keep your own plan on the same email and switch between them from the header. You build and pay; the plan is for them.',
  },
  {
    title: 'What if my parent can\'t confirm by text?',
    body: 'That\'s fine. At signup, choose "No — they can\'t use text" and confirm you\'re helping on their behalf. You can start building immediately. SMS confirmation is optional, not required.',
  },
  {
    title: 'Can one email have more than one plan?',
    body: 'Yes. You might have a plan for yourself and a separate plan for a parent. Go to Settings → "+ Add another plan", or use the Viewing menu at the top of the app. Each plan you own has its own 14-day trial and its own $89/year subscription after that.',
  },
  {
    title: 'How do I add a plan for a parent if I already have my own?',
    body: 'Sign in, then go to Settings and tap "+ Add another plan" (or open the Viewing menu at the top and choose the same option). Choose "A parent or loved one," enter their name, and complete setup. You\'ll switch between plans from the header anytime.',
  },
  {
    title: 'Who pays when I have multiple plans?',
    body: 'You pay separately for each plan you own — your personal plan and a parent\'s plan are two subscriptions if you upgrade both. Relatives you invite to help manage a parent\'s plan are never billed; only the plan owner handles payment.',
  },
  {
    title: 'Can a sibling help manage a parent\'s plan?',
    body: 'Yes. On a plan you manage for a parent or loved one, go to Settings and tap "+ Add a relative to help." They\'ll get an email invite. Once they accept, your parent\'s plan appears in their account switcher — but they only see that shared plan, not your personal plan or anyone else\'s.',
  },
  {
    title: 'How do legacy contacts work?',
    body: 'A legacy contact is a trusted person who can activate your guide when the time comes. They receive a private activation link and see the information you prepared after activation.',
  },
  {
    title: 'Can I publish and unpublish a memorial page?',
    body: 'Yes. The portal lets you save obituary and service details, preview the memorial page, publish a public link, and unpublish it when needed.',
  },
  {
    title: 'Is grief support really free?',
    body: 'Yes. The grief path is free and does not require a credit card. Planning ahead can include a free trial and a paid subscription after the trial.',
  },
  {
    title: 'How do I cancel or delete my account?',
    body: 'You can request account deletion from Settings or email support@mourninguide.com. Billing questions and cancellations can also be sent to support.',
  },
  {
    title: 'How do I contact support?',
    body: 'Email support@mourninguide.com from the email address on your account when possible.',
  },
];

export default function HelpPage() {
  return (
    <MarketingShell>
      <main style={{ padding: '48px 58px 80px', maxWidth: 820 }}>
        <p style={eyebrow}>Help Center</p>
        <h1 style={h1}>Clear answers, no maze.</h1>
        <p style={lead}>
          Start here for common questions. If you need account-specific help, contact us and we will handle it carefully.
        </p>

        <div style={faqGrid}>
          {faqs.map(item => (
            <section key={item.title} style={card}>
              <h2 style={h2}>{item.title}</h2>
              <p style={copy}>{item.body}</p>
            </section>
          ))}
        </div>

        <section style={contactPanel}>
          <h2 style={h2}>Still need help?</h2>
          <p style={copy}>
            Email <a href="mailto:support@mourninguide.com">support@mourninguide.com</a> or use the <Link href="/contact">contact page</Link>.
          </p>
        </section>
      </main>
    </MarketingShell>
  );
}

const eyebrow: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c86d49', margin: '0 0 14px' };
const h1: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem,4vw,3.4rem)', fontWeight: 500, lineHeight: 1.05, margin: '0 0 18px', color: '#2f241f' };
const lead: React.CSSProperties = { fontSize: '1.04rem', color: '#594b43', lineHeight: 1.75, margin: '0 0 34px' };
const faqGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16 };
const card: React.CSSProperties = { padding: 24, border: '1px solid rgba(142,95,70,0.18)', borderRadius: 18, background: 'rgba(255,250,244,0.82)' };
const contactPanel: React.CSSProperties = { marginTop: 28, padding: 28, border: '1px solid rgba(197,123,87,0.24)', borderRadius: 18, background: 'rgba(255,255,255,0.64)' };
const h2: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: '1.28rem', fontWeight: 500, color: '#2f241f', margin: '0 0 10px' };
const copy: React.CSSProperties = { color: '#594b43', fontSize: '0.94rem', lineHeight: 1.65, margin: 0 };
