'use client';

import { useState } from 'react';
import type { customerReviews } from '@/db/schema/admin';

type Review = typeof customerReviews.$inferSelect;

function stars(rating: number) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default function ReviewsClient({
  reviews,
  statusFilter,
}: {
  reviews: Review[];
  statusFilter: string;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(reviews.map(r => [r.id, r.adminReply ?? '']))
  );
  const [error, setError] = useState<string | null>(null);

  async function updateReview(id: string, payload: Record<string, unknown>) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/staff/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Update failed');
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        {(['all', 'pending', 'published', 'rejected'] as const).map(status => (
          <a
            key={status}
            href={status === 'all' ? '/staff/reviews' : `/staff/reviews?status=${status}`}
            className={`admin-btn${statusFilter === status ? ' primary' : ''}`}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </a>
        ))}
        <a className="admin-btn" href="/reviews/new" target="_blank" rel="noreferrer">Preview review form</a>
      </div>

      {error && (
        <p style={{ color: '#991b1b', fontSize: '0.88rem', marginBottom: 16 }}>{error}</p>
      )}

      {reviews.length === 0 ? (
        <p className="admin-empty">No reviews in this queue.</p>
      ) : (
        reviews.map(review => (
          <article key={review.id} className="review-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              <div>
                <span className={`admin-badge ${review.status}`}>{review.status}</span>
                <span className="review-stars" style={{ marginLeft: 10 }}>{stars(review.rating)}</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: '#9a7a6a' }}>
                {new Date(review.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
              </span>
            </div>

            {review.title && <h3>{review.title}</h3>}
            <p>{review.body}</p>
            <p style={{ marginTop: 10, fontSize: '0.82rem', color: '#9a7a6a' }}>
              {review.authorName} · {review.authorEmail}
            </p>

            {review.adminReply && (
              <div className="review-reply">
                <strong style={{ display: 'block', marginBottom: 4, color: '#2f241f' }}>Your reply</strong>
                {review.adminReply}
              </div>
            )}

            <div className="admin-form" style={{ marginTop: 16 }}>
              <label htmlFor={`reply-${review.id}`}>Reply (shown publicly when published)</label>
              <textarea
                id={`reply-${review.id}`}
                value={replyDrafts[review.id] ?? ''}
                onChange={e => setReplyDrafts(prev => ({ ...prev, [review.id]: e.target.value }))}
                placeholder="Thank them for the feedback…"
              />
            </div>

            <div className="admin-toolbar" style={{ marginBottom: 0 }}>
              {review.status !== 'published' && (
                <button
                  type="button"
                  className="admin-btn primary"
                  disabled={busyId === review.id}
                  onClick={() => updateReview(review.id, {
                    status: 'published',
                    adminReply: replyDrafts[review.id]?.trim() || undefined,
                  })}
                >
                  Publish{replyDrafts[review.id]?.trim() ? ' with reply' : ''}
                </button>
              )}
              {review.status === 'published' && (
                <button
                  type="button"
                  className="admin-btn primary"
                  disabled={busyId === review.id}
                  onClick={() => updateReview(review.id, { adminReply: replyDrafts[review.id]?.trim() || null })}
                >
                  Save reply
                </button>
              )}
              {review.status === 'pending' && (
                <button
                  type="button"
                  className="admin-btn danger"
                  disabled={busyId === review.id}
                  onClick={() => updateReview(review.id, { status: 'rejected' })}
                >
                  Reject
                </button>
              )}
              {review.status === 'published' && (
                <button
                  type="button"
                  className="admin-btn"
                  disabled={busyId === review.id}
                  onClick={() => updateReview(review.id, { status: 'pending' })}
                >
                  Unpublish
                </button>
              )}
            </div>
          </article>
        ))
      )}
    </>
  );
}
