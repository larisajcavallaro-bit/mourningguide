import type { Metadata } from 'next';
import Link from 'next/link';
import MarketingShell from '@/components/MarketingShell';
import { getPublishedReviews } from '@/lib/admin';

export const metadata: Metadata = {
  title: 'Reviews — Mourning Guide',
  description: 'What families say about Mourning Guide.',
};

export const dynamic = 'force-dynamic';

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default async function ReviewsPage() {
  const reviews = await getPublishedReviews();
  const avg = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <MarketingShell>
      <main style={{ padding: '48px 58px 80px', maxWidth: 760 }}>
        <p style={eyebrow}>Reviews</p>
        <h1 style={h1}>Families sharing their experience</h1>
        <p style={lead}>
          {avg
            ? <>Average rating: <strong>{avg}</strong> from {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}. </>
            : 'Be the first to share your experience. '}
          Reviews are moderated before they appear here.
        </p>

        <Link href="/reviews/new" style={cta}>Leave a review</Link>

        <div style={{ marginTop: 36 }}>
          {reviews.length === 0 ? (
            <p style={copy}>No published reviews yet.</p>
          ) : (
            reviews.map(review => (
              <article key={review.id} className="review-card">
                <div className="review-stars" style={{ marginBottom: 8 }}>{stars(review.rating)}</div>
                {review.title && <h3>{review.title}</h3>}
                <p>{review.body}</p>
                <p style={{ marginTop: 10, fontSize: '0.82rem', color: '#9a7a6a' }}>{review.authorName}</p>
                {review.adminReply && (
                  <div className="review-reply">
                    <strong style={{ display: 'block', marginBottom: 4, color: '#2f241f' }}>Mourning Guide</strong>
                    {review.adminReply}
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </main>
    </MarketingShell>
  );
}

const eyebrow: React.CSSProperties = { fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c86d49', margin: '0 0 14px' };
const h1: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: 'clamp(2.2rem,4vw,3.4rem)', fontWeight: 500, lineHeight: 1.05, margin: '0 0 18px', color: '#2f241f' };
const lead: React.CSSProperties = { fontSize: '1.04rem', color: '#594b43', lineHeight: 1.75, margin: '0 0 24px' };
const copy: React.CSSProperties = { color: '#594b43', fontSize: '0.94rem', lineHeight: 1.65 };
const cta: React.CSSProperties = { display: 'inline-block', padding: '12px 18px', borderRadius: 999, background: 'linear-gradient(180deg,#df8259,#c57b57)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' };
