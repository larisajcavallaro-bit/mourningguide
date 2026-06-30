import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--mg-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '2rem', color: 'var(--mg-dark)', marginBottom: 12, fontWeight: 600,
        }}>Mourning Guide</h1>
        <p style={{ color: 'var(--mg-light)', fontSize: '1rem', marginBottom: 40, lineHeight: 1.6 }}>
          The kindest thing you can do for the people you love.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/sign-up" style={{
            display: 'block', padding: '14px', borderRadius: 10,
            background: 'var(--mg-accent)', color: '#fff',
            fontWeight: 600, fontSize: '1rem', textDecoration: 'none',
          }}>Get started</Link>
          <Link href="/sign-in" style={{
            display: 'block', padding: '14px', borderRadius: 10,
            border: '1.5px solid var(--mg-border-strong)', color: 'var(--mg-mid)',
            fontWeight: 500, fontSize: '0.95rem', textDecoration: 'none',
          }}>Sign in</Link>
        </div>
        <p style={{ color: 'var(--mg-light)', fontSize: '0.78rem', marginTop: 28 }}>
          Planning path: $89/year · 14-day free trial · Grief support always free
        </p>
      </div>
    </div>
  );
}
