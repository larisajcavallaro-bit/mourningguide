'use client';

import { useMemo, useState } from 'react';
import type { CustomerRow } from '@/lib/admin';

type Filters = {
  path: string;
  plan: string;
  marketingOnly: boolean;
};

export default function CustomersClient({
  customers,
  filters,
}: {
  customers: CustomerRow[];
  filters: Filters;
}) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(c =>
      (c.ownerEmail ?? '').toLowerCase().includes(q) ||
      (c.subjectName ?? '').toLowerCase().includes(q) ||
      (c.usState ?? '').toLowerCase().includes(q)
    );
  }, [customers, query]);

  const exportHref = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.path !== 'all') params.set('path', filters.path);
    if (filters.plan !== 'all') params.set('plan', filters.plan);
    if (filters.marketingOnly) params.set('marketingOnly', '1');
    const qs = params.toString();
    return `/api/staff/customers/export${qs ? `?${qs}` : ''}`;
  }, [filters]);

  async function copyMarketingEmails() {
    try {
      const res = await fetch('/api/staff/marketing/emails');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not load emails');
      await navigator.clipboard.writeText((data.emails as string[]).join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <div className="admin-toolbar">
        <select
          value={filters.path}
          onChange={e => {
            const params = new URLSearchParams(window.location.search);
            if (e.target.value === 'all') params.delete('path');
            else params.set('path', e.target.value);
            window.location.search = params.toString();
          }}
        >
          <option value="all">All paths</option>
          <option value="planning">Planning</option>
          <option value="grief">Grief</option>
        </select>

        <select
          value={filters.plan}
          onChange={e => {
            const params = new URLSearchParams(window.location.search);
            if (e.target.value === 'all') params.delete('plan');
            else params.set('plan', e.target.value);
            window.location.search = params.toString();
          }}
        >
          <option value="all">All plans</option>
          <option value="free">Free / trial</option>
          <option value="guide">Guide Plan</option>
          <option value="lapsed">Lapsed</option>
        </select>

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.84rem', color: '#594b43' }}>
          <input
            type="checkbox"
            checked={filters.marketingOnly}
            onChange={e => {
              const params = new URLSearchParams(window.location.search);
              if (e.target.checked) params.set('marketing', '1');
              else params.delete('marketing');
              window.location.search = params.toString();
            }}
          />
          Marketing opt-in only
        </label>

        <input
          type="search"
          placeholder="Search name, email, state…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <a className="admin-btn primary" href={exportHref}>Download CSV</a>
        <button type="button" className="admin-btn" onClick={copyMarketingEmails}>
          {copied ? 'Copied!' : 'Copy opt-in emails'}
        </button>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: '#9a7a6a' }}>
        Showing {filtered.length} of {customers.length} accounts. Email addresses are stored at signup for account updates and optional product news.
      </p>

      <div className="admin-panel admin-table-wrap">
        {filtered.length === 0 ? (
          <p className="admin-empty">No customers match these filters.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Path</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Marketing</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <strong style={{ display: 'block', color: '#2f241f' }}>{c.subjectName ?? '—'}</strong>
                    <span style={{ color: '#9a7a6a' }}>{c.ownerEmail ?? 'No email on file'}</span>
                    {c.usState && <span style={{ display: 'block', color: '#9a7a6a', fontSize: '0.76rem' }}>{c.usState}</span>}
                  </td>
                  <td><span className={`admin-badge ${c.path}`}>{c.path}</span></td>
                  <td>{formatPlan(c)}</td>
                  <td>{c.activationStatus.replace('_', ' ')}</td>
                  <td>{c.marketingOptIn ? 'Yes' : 'No'}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function formatPlan(c: CustomerRow): string {
  if (c.planTier === 'guide') return 'Guide ($89/yr)';
  if (c.planTier === 'lapsed') return 'Lapsed';
  if (c.trialEndsAt && new Date(c.trialEndsAt) > new Date()) {
    return `Trial · ${new Date(c.trialEndsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }
  return 'Free';
}
