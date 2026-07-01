import type { Metadata } from 'next';
import MarketingShell from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'Privacy Policy | Mourning Guide',
  description: "Mourning Guide's privacy policy for accounts, vault data, legacy contacts, letters, memorial pages, and support requests.",
};

const updated = 'July 1, 2026';

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <main style={main}>
        <p style={eyebrow}>Legal</p>
        <h1 style={h1}>Privacy Policy</h1>
        <p style={lead}>
          Mourning Guide handles sensitive end-of-life planning information. This policy explains what we collect,
          how we use it, when we share it, and the choices you have.
        </p>
        <p style={meta}>Effective date: {updated}</p>

        <Section title="Who we are">
          <p>
            Mourning Guide is operated by a business being registered in New Hampshire. We provide a private planning
            vault, legacy-contact workflow, letters, final-wishes tools, memorial portal tools, and practical guidance
            for US families.
          </p>
          <p>
            For privacy questions or requests, email <a href="mailto:privacy@mourninguide.com">privacy@mourninguide.com</a>.
          </p>
        </Section>

        <Section title="Information we collect">
          <ul>
            <li><strong>Account information:</strong> name, email address, authentication identifiers, plan status, and account preferences.</li>
            <li><strong>Planning information:</strong> state of residence, final wishes, service details, financial-institution notes, letters, trusted people, legacy contacts, notification contacts, obituary text, memorial-page content, uploaded documents, and uploaded photos.</li>
            <li><strong>Payment information:</strong> subscription status and Stripe customer/session identifiers. Card details are processed by Stripe and are not stored by Mourning Guide.</li>
            <li><strong>Communications:</strong> support emails, deletion requests, funeral-home send requests, and service notifications.</li>
            <li><strong>Technical information:</strong> device, browser, IP address, cookies, session data, logs, and security events used to operate and protect the service.</li>
          </ul>
        </Section>

        <Section title="How we use information">
          <ul>
            <li>Provide and secure your account, vault, letters, wishes, contacts, documents, and memorial portal.</li>
            <li>Authenticate users and protect access through Clerk and related security controls.</li>
            <li>Process subscriptions, trials, billing, and account-status changes through Stripe.</li>
            <li>Send account, legacy-contact, activation, letter-delivery, deletion, and support emails through our email provider.</li>
            <li>Maintain, debug, improve, and monitor the service.</li>
            <li>Comply with law, prevent misuse, and enforce our Terms.</li>
          </ul>
        </Section>

        <Section title="How we share information">
          <p>We do not sell personal information. We do not run an advertising business or sell data to brokers.</p>
          <ul>
            <li><strong>Service providers:</strong> hosting, database, authentication, email, file storage, payments, analytics, monitoring, and support tools that help us operate Mourning Guide.</li>
            <li><strong>People you choose:</strong> legacy contacts, letter recipients, notification contacts, funeral homes, and public memorial visitors when you publish or send content through the service.</li>
            <li><strong>Legal and safety reasons:</strong> when required by law, to protect users, to prevent fraud or abuse, or to defend our rights.</li>
            <li><strong>Business transfers:</strong> if Mourning Guide is involved in a merger, acquisition, financing, reorganization, or sale of assets, subject to continued protection of user information.</li>
          </ul>
        </Section>

        <Section title="Public memorial pages">
          <p>
            If you publish a memorial page, the obituary, service details, photos, and other information you choose to
            publish may be visible to anyone with the link and may be indexed or shared outside Mourning Guide. You can
            unpublish a memorial page from your account.
          </p>
        </Section>

        <Section title="Retention and deletion">
          <p>
            We keep account and vault information while your account is active or as needed to provide the service,
            comply with legal obligations, resolve disputes, prevent abuse, and maintain backups. You can request account
            deletion from Settings or by emailing <a href="mailto:support@mourninguide.com">support@mourninguide.com</a>.
            Deletion requests are processed within a reasonable time, subject to legal, security, backup, and fraud-prevention
            requirements.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We use administrative, technical, and organizational safeguards designed for sensitive information, including
            access controls, authentication, HTTPS, provider-level security controls, and limited internal access. No
            online service can guarantee absolute security, so please do not store passwords, Social Security numbers,
            full account numbers, or other credentials in Mourning Guide.
          </p>
        </Section>

        <Section title="Your choices and privacy requests">
          <ul>
            <li>Access and update account information in your account where available.</li>
            <li>Export, revise, delete, or unpublish content where product tools allow.</li>
            <li>Request deletion or ask privacy questions by emailing us.</li>
            <li>Opt out of non-essential marketing emails by using the unsubscribe link or contacting support.</li>
          </ul>
          <p>
            Some US state privacy laws may give residents additional rights. We will honor applicable requests to access,
            correct, delete, or obtain a copy of personal information when required by law.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Mourning Guide is intended for adults and is not directed to children under 13. We do not knowingly collect
            personal information from children under 13.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update this Privacy Policy as the service changes or legal requirements evolve. The effective date above
            shows when this policy was last updated.
          </p>
        </Section>
      </main>
    </MarketingShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={section}>
      <h2 style={h2}>{title}</h2>
      <div style={copy}>{children}</div>
    </section>
  );
}

const main: React.CSSProperties = { padding: '48px 58px 80px', maxWidth: 760 };
const eyebrow: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c86d49', margin: '0 0 14px' };
const h1: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem,4vw,3.4rem)', fontWeight: 500, lineHeight: 1.05, margin: '0 0 18px', color: '#2f241f' };
const lead: React.CSSProperties = { fontSize: '1.04rem', color: '#594b43', lineHeight: 1.75, margin: '0 0 12px' };
const meta: React.CSSProperties = { fontSize: '0.86rem', color: '#9a7a6a', margin: '0 0 34px' };
const section: React.CSSProperties = { padding: '28px 0', borderTop: '1px solid rgba(142,95,70,0.14)' };
const h2: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: '1.45rem', fontWeight: 500, color: '#2f241f', margin: '0 0 12px' };
const copy: React.CSSProperties = { color: '#594b43', fontSize: '0.96rem', lineHeight: 1.75 };
