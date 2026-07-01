import type { Metadata } from 'next';
import MarketingShell from '@/components/MarketingShell';

export const metadata: Metadata = {
  title: 'Terms of Service | Mourning Guide',
  description: 'Terms of Service for Mourning Guide accounts, planning tools, subscriptions, memorial pages, and legacy-contact workflows.',
};

const updated = 'July 1, 2026';

export default function TermsPage() {
  return (
    <MarketingShell>
      <main style={main}>
        <p style={eyebrow}>Legal</p>
        <h1 style={h1}>Terms of Service</h1>
        <p style={lead}>
          These Terms govern your use of Mourning Guide. By creating an account or using the service, you agree to these Terms.
        </p>
        <p style={meta}>Effective date: {updated}</p>

        <Section title="The service">
          <p>
            Mourning Guide provides private planning tools, a vault for practical information, legacy-contact workflows,
            letters, final-wishes tools, memorial portal tools, and grief-oriented task guidance for US families.
          </p>
          <p>
            Mourning Guide is not a law firm, funeral home, financial adviser, tax adviser, health-care provider, emergency
            service, probate service, or clinical mental-health provider. Content in the service is general information and
            organizational support, not legal, financial, medical, tax, or professional advice.
          </p>
        </Section>

        <Section title="Eligibility and accounts">
          <ul>
            <li>You must be at least 18 years old and able to form a binding agreement.</li>
            <li>You are responsible for accurate account information and for keeping your sign-in credentials secure.</li>
            <li>You may not use another person&apos;s account without permission.</li>
            <li>You must notify us promptly if you believe your account has been compromised.</li>
          </ul>
        </Section>

        <Section title="Your content">
          <p>
            You keep ownership of the information, letters, wishes, documents, photos, obituary text, and other content you
            submit. You give Mourning Guide permission to host, store, process, display, transmit, and share that content
            as needed to provide the service and carry out the choices you make in the product.
          </p>
          <p>
            You are responsible for the content you add, publish, send, or ask us to deliver. Do not upload content that is
            unlawful, harmful, abusive, infringing, invasive of another person&apos;s privacy, or that you do not have the right
            to use.
          </p>
        </Section>

        <Section title="Legacy contacts, letters, and activation">
          <p>
            Mourning Guide lets planning users name legacy contacts and create instructions for release after death or
            activation. You are responsible for choosing trusted contacts, keeping contact information current, and ensuring
            the information you enter reflects your wishes.
          </p>
          <p>
            We may require authentication, waiting periods, audit logs, or other verification steps before releasing
            information. We cannot guarantee that every contact, email, or delivery will succeed, especially if contact
            information is outdated or third-party email systems reject messages.
          </p>
        </Section>

        <Section title="Subscriptions, trials, and payments">
          <p>
            Planning accounts may include a free trial and then convert to a paid subscription if you choose to upgrade.
            Prices, billing intervals, and plan details are shown at checkout. Payments are processed by Stripe.
          </p>
          <p>
            Unless otherwise stated at checkout, subscriptions renew automatically until canceled. You can cancel future
            renewals through account billing tools or by contacting support. Fees already paid are non-refundable except
            where required by law or expressly stated by us.
          </p>
          <p>
            The grief-support path is free. We may update plan features or pricing prospectively, but we will not charge
            you without your authorization.
          </p>
        </Section>

        <Section title="Acceptable use">
          <ul>
            <li>Do not break the law, violate another person&apos;s rights, or misuse personal information.</li>
            <li>Do not attempt to access accounts, data, systems, or APIs without authorization.</li>
            <li>Do not interfere with security, availability, billing, or normal operation of the service.</li>
            <li>Do not upload malware, spam, deceptive content, or content intended to harass or exploit others.</li>
            <li>Do not reverse engineer the service except where law permits.</li>
          </ul>
        </Section>

        <Section title="Disclaimers">
          <p>
            The service is provided &quot;as is&quot; and &quot;as available.&quot; We do not promise that the service will be uninterrupted,
            error-free, or that every instruction, email, memorial page, upload, or third-party integration will always work.
            To the fullest extent allowed by law, we disclaim implied warranties of merchantability, fitness for a particular
            purpose, and non-infringement.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent allowed by law, Mourning Guide will not be liable for indirect, incidental, special,
            consequential, exemplary, or punitive damages, or for lost profits, lost data, lost goodwill, or substitute
            services. Our total liability for claims relating to the service will not exceed the greater of the amount you
            paid Mourning Guide in the 12 months before the claim or $100.
          </p>
        </Section>

        <Section title="Termination">
          <p>
            You may stop using the service at any time. We may suspend or terminate access if you violate these Terms, create
            risk for users or the service, fail to pay amounts owed, or if continued operation would expose us or others to
            legal or security risk.
          </p>
        </Section>

        <Section title="Governing law">
          <p>
            Mourning Guide is operated by a business being registered in New Hampshire. These Terms are governed by the laws
            of the State of New Hampshire, without regard to conflict-of-law rules. Courts located in New Hampshire will have
            jurisdiction for disputes that are not otherwise resolved.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these Terms can be sent to <a href="mailto:support@mourninguide.com">support@mourninguide.com</a>.
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
