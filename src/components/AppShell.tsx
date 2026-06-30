import Link from 'next/link';

interface AppShellProps {
  children: React.ReactNode;
  back?: { href: string; label: string };
  title: string;
}

export default function AppShell({ children, back, title }: AppShellProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--mg-bg)', paddingBottom: 80 }}>
      <header style={{
        background: '#fff', borderBottom: '1px solid var(--mg-border)',
        padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        {back && (
          <Link href={back.href} style={{
            color: 'var(--mg-light)', textDecoration: 'none', fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          }}>
            ← {back.label}
          </Link>
        )}
        <span style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontSize: '1.05rem', color: 'var(--mg-dark)', fontWeight: 600,
          flex: 1, textAlign: back ? 'center' : 'left',
        }}>{title}</span>
        {back && <span style={{ width: 60 }} />}
      </header>
      <main style={{ maxWidth: 520, margin: '0 auto', padding: '24px 20px' }}>
        {children}
      </main>
    </div>
  );
}
