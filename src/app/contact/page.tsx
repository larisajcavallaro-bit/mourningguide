import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingShell from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'Contact Mourning Guide',
  description: 'Contact Mourning Guide for support, privacy questions, billing help, legal questions, or account deletion requests.',
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <main style={{ padding: '48px 58px 80px', maxWidth: 760 }}>
        <p style={eyebrow}>Contact</p>
        <h1 style={h1}>How can we help?</h1>
        <p style={lead}>
          Mourning Guide is a small team. Email is the best way to reach us, and it helps us handle sensitive account
          requests carefully.
        </p>

        <div style={grid}>
          <ContactCard title="Support" email="support@mourninguide.com" detail="Account help, product questions, billing, cancellation, and deletion requests." />
          <ContactCard title="Privacy" email="privacy@mourninguide.com" detail="Privacy questions, data access, correction, deletion, and policy questions." />
          <ContactCard title="Legal" email="legal@mourninguide.com" detail="Terms, legal notices, rights requests, and formal correspondence." />
          <ContactCard title="Funeral home coordination" email="support@mourninguide.com" detail="Questions about obituary delivery or family coordination through Mourning Guide." />
        </div>

        <section style={panel}>
          <h2 style={h2}>Before you write</h2>
          <p style={copy}>
            Please do not send passwords, Social Security numbers, full account numbers, or payment-card numbers by email.
            If your question is about a logged-in account, write from the email address on that account when possible.
          </p>
          <p style={copy}>
            Looking for common answers? Visit the <Link href="/help">Help Center</Link>.
          </p>
        </section>
      </main>
    </MarketingShell>
  );
}

function ContactCard({ title, email, detail }: { title: string; email: string; detail: string }) {
  return (
    <section style={card}>
      <h2 style={h2}>{title}</h2>
      <a href={`mailto:${email}`} style={emailStyle}>{email}</a>
      <p style={copy}>{detail}</p>
    </section>
  );
}

const eyebrow: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c86d49', margin: '0 0 14px' };
const h1: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem,4vw,3.4rem)', fontWeight: 500, lineHeight: 1.05, margin: '0 0 18px', color: '#2f241f' };
const lead: React.CSSProperties = { fontSize: '1.04rem', color: '#594b43', lineHeight: 1.75, margin: '0 0 34px' };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16, marginBottom: 28 };
const card: React.CSSProperties = { padding: 24, border: '1px solid rgba(142,95,70,0.18)', borderRadius: 18, background: 'rgba(255,250,244,0.82)' };
const panel: React.CSSProperties = { padding: 28, borderTop: '1px solid rgba(142,95,70,0.14)' };
const h2: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: '1.35rem', fontWeight: 500, color: '#2f241f', margin: '0 0 10px' };
const emailStyle: React.CSSProperties = { color: '#c57b57', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none' };
const copy: React.CSSProperties = { color: '#594b43', fontSize: '0.94rem', lineHeight: 1.65, margin: '10px 0 0' };
