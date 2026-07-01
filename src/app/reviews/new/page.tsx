import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingShell from '@/components/MarketingShell';
import ReviewForm from './ReviewForm';

export const metadata: Metadata = {
  title: 'Leave a review — Mourning Guide',
  description: 'Share your experience with Mourning Guide.',
};

export default function NewReviewPage() {
  return (
    <MarketingShell>
      <main style={{ padding: '48px 58px 80px', maxWidth: 640 }}>
        <p style={eyebrow}>Reviews</p>
        <h1 style={h1}>Leave a review</h1>
        <p style={lead}>
          Your feedback helps other families find calm during a difficult time. Reviews are moderated before publication.
        </p>

        <ReviewForm />

        <p style={{ ...copy, marginTop: 24 }}>
          <Link href="/reviews" style={{ color: '#c57b57', fontWeight: 600, textDecoration: 'none' }}>← Back to reviews</Link>
        </p>
      </main>
    </MarketingShell>
  );
}

const eyebrow: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c86d49', margin: '0 0 14px' };
const h1: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 500, lineHeight: 1.05, margin: '0 0 18px', color: '#2f241f' };
const lead: React.CSSProperties = { fontSize: '1.02rem', color: '#594b43', lineHeight: 1.75, margin: '0 0 28px' };
const copy: React.CSSProperties = { color: '#594b43', fontSize: '0.94rem', lineHeight: 1.65 };
