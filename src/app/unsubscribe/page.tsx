import type { Metadata } from 'next';
import MarketingShell from '@/components/MarketingShell';
import UnsubscribeForm from './UnsubscribeForm';

export const metadata: Metadata = {
  title: 'Unsubscribe — Mourning Guide',
  description: 'Opt out of Mourning Guide product update emails.',
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  return (
    <MarketingShell>
      <main style={{ padding: '48px 58px 80px', maxWidth: 640 }}>
        <p style={eyebrow}>Email preferences</p>
        <h1 style={h1}>Unsubscribe</h1>
        <UnsubscribeForm initialToken={params.token} />
      </main>
    </MarketingShell>
  );
}

const eyebrow: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c86d49', margin: '0 0 14px' };
const h1: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 500, lineHeight: 1.05, margin: '0 0 24px', color: '#2f241f' };
