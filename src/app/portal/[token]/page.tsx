import { db } from '@/db';
import { accounts } from '@/db/schema/accounts';
import { obituary, serviceDetails, photos, rememberEntries } from '@/db/schema/vault';
import { eq, and, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

async function load(token: string) {
  const [acct] = await db.select({ id: accounts.id })
    .from(accounts).where(eq(accounts.portalToken, token)).limit(1);
  if (!acct) return null;

  const [obit] = await db.select().from(obituary)
    .where(eq(obituary.accountId, acct.id)).limit(1);
  if (!obit || !obit.published) return null;

  const [service] = await db.select().from(serviceDetails)
    .where(eq(serviceDetails.accountId, acct.id)).limit(1);

  const photoRows = await db.select().from(photos)
    .where(eq(photos.accountId, acct.id))
    .orderBy(photos.createdAt);

  const rememberPhotoRows = await db.select().from(rememberEntries)
    .where(and(eq(rememberEntries.accountId, acct.id), eq(rememberEntries.kind, 'photos')))
    .orderBy(desc(rememberEntries.createdAt));

  return { obit, service: service ?? null, photos: photoRows, rememberPhotos: rememberPhotoRows };
}

export async function generateMetadata(
  { params }: { params: Promise<{ token: string }> }
): Promise<Metadata> {
  const { token } = await params;
  const data = await load(token);
  if (!data) return { title: 'Memorial — Mourning Guide' };
  return {
    title: `In memory of ${data.obit.name} — Mourning Guide`,
    description: data.obit.body?.slice(0, 160) ?? undefined,
  };
}

export default async function PublicMemorialPage(
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const data = await load(token);
  if (!data) notFound();
  const { obit, service, photos: gallery, rememberPhotos } = data;

  const dateLine = [obit.born, obit.died].filter(Boolean).join(' — ');
  const showService = service && (service.date || service.venue);
  const portrait = gallery[0] ?? null;
  const rest = rememberPhotos.filter((item) => item.storageKey);

  return (
    <div style={{ minHeight: '100vh', background: '#f5ede6' }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{
          minHeight: portrait ? 340 : 220,
          background: 'linear-gradient(160deg,#6b7c6e 0%,#4a5c4d 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
          padding: '32px 24px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {portrait && (
            <div style={{
              position: 'absolute', inset: 0, backgroundImage: `url(${portrait.storageKey})`,
              backgroundSize: 'cover', backgroundPosition: 'center top', filter: 'brightness(0.55) saturate(0.85)',
            }} />
          )}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {portrait ? (
              <div style={{
                width: 180, height: 180, borderRadius: '50%', border: '5px solid rgba(255,255,255,0.7)',
                overflow: 'hidden', margin: '0 auto 18px', boxShadow: '0 6px 32px rgba(0,0,0,0.3)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={portrait.storageKey} alt={obit.name ?? 'In memory'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div style={{
                width: 100, height: 100, borderRadius: '50%', border: '5px solid rgba(255,255,255,0.7)',
                background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px', fontSize: '2.4rem',
              }}>🌿</div>
            )}
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: '1.7rem', fontWeight: 500, color: '#fff', margin: '0 0 4px' }}>{obit.name}</h1>
            {dateLine && <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', margin: 0 }}>{dateLine}</p>}
            {obit.city && <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', margin: '4px 0 0' }}>{obit.city}</p>}
          </div>
        </div>

        {/* Content */}
        <main style={{ padding: '0 0 48px' }}>
          {obit.body && (
            <div style={block}>
              <p style={{ margin: 0, fontSize: '0.98rem', color: '#594b43', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{obit.body}</p>
            </div>
          )}

          {(obit.survived || obit.predeceased) && (
            <div style={block}>
              {obit.survived && (
                <p style={{ margin: '0 0 10px', fontSize: '0.92rem', color: '#594b43', lineHeight: 1.65 }}>
                  <strong style={{ color: '#2f241f' }}>Survived by:</strong> {obit.survived}
                </p>
              )}
              {obit.predeceased && (
                <p style={{ margin: 0, fontSize: '0.92rem', color: '#594b43', lineHeight: 1.65 }}>
                  <strong style={{ color: '#2f241f' }}>Predeceased by:</strong> {obit.predeceased}
                </p>
              )}
            </div>
          )}

          {showService && (
            <div style={block}>
              <h2 style={blockHead}>{service!.type || 'Service'}</h2>
              {(service!.date || service!.time) && <p style={svcRow}>{[service!.date, service!.time].filter(Boolean).join(' · ')}</p>}
              {service!.venue && <p style={svcRow}>{service!.venue}</p>}
              {service!.address && <p style={svcMuted}>{service!.address}</p>}
              {service!.livestreamUrl && (
                <p style={{ marginTop: 12 }}>
                  <a href={service!.livestreamUrl} style={{ color: '#c57b57', textDecoration: 'none', fontWeight: 600 }} target="_blank" rel="noreferrer">
                    Join the livestream →
                  </a>
                </p>
              )}
              {service!.reception && (service!.receptionVenue || service!.receptionTime) && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(145,104,82,0.12)' }}>
                  <p style={{ ...svcRow, fontWeight: 700 }}>Reception</p>
                  {service!.receptionVenue && <p style={svcRow}>{service!.receptionVenue}</p>}
                  {service!.receptionAddress && <p style={svcMuted}>{service!.receptionAddress}</p>}
                  {service!.receptionTime && <p style={svcMuted}>{service!.receptionTime}</p>}
                </div>
              )}
            </div>
          )}

          {rest.length > 0 && (
            <div style={block}>
              <h2 style={blockHead}>Photos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, borderRadius: 10, overflow: 'hidden' }}>
                {rest.map(p => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.id} src={p.storageKey!} alt={p.title ?? ''}
                    style={{ aspectRatio: '1', width: '100%', objectFit: 'cover', filter: 'sepia(0.12) contrast(1.03)' }} />
                ))}
              </div>
            </div>
          )}

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: '0.78rem', color: '#9a7a6a' }}>
            Held with care on{' '}
            <a href="https://mourninguide.com" style={{ color: '#9a7a6a', textDecoration: 'none' }}>Mourning Guide</a>
          </p>
        </main>
      </div>
    </div>
  );
}

const block: React.CSSProperties = { background: '#fff', borderRadius: 16, margin: '16px 16px 0', padding: '22px 20px', boxShadow: '0 1px 4px rgba(67,46,33,0.07)' };
const blockHead: React.CSSProperties = { fontFamily: 'var(--serif)', fontSize: '1.2rem', fontWeight: 500, color: '#2f241f', margin: '0 0 12px' };
const svcRow: React.CSSProperties = { margin: '0 0 6px', fontSize: '0.92rem', color: '#594b43' };
const svcMuted: React.CSSProperties = { margin: '0 0 6px', fontSize: '0.84rem', color: '#9a7a6a' };
