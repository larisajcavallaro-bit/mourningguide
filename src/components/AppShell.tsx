import Link from 'next/link';

type NavKey = 'home' | 'vault' | 'remember' | 'people' | 'portal';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;              // shown under the wordmark (e.g. "Finances")
  back?: { href: string; label: string }; // legacy prop, accepted; nav replaces it
  active?: NavKey;
  meta?: React.ReactNode;      // right-side header text (e.g. trial status)
}

const NAV: { key: NavKey; href: string; label: string; icon: React.ReactNode }[] = [
  { key: 'home', href: '/dashboard', label: 'Home', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12L12 3l9 9"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9"/></svg>
  ) },
  { key: 'vault', href: '/vault', label: 'Personal', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h6M8 17h4"/></svg>
  ) },
  { key: 'remember', href: '/remember', label: 'Remember', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
  ) },
  { key: 'people', href: '/people', label: 'People', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
  ) },
  { key: 'portal', href: '/portal', label: 'Portal', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
  ) },
];

export default function AppShell({ children, title, active, meta }: AppShellProps) {
  return (
    <div className="app-outer">
      <div className="app-shell">
        <header className="app-header">
          <span className="app-header-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c57b57" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3C8 3 4 6 4 10c0 2 1 3.5 2.5 5L12 21l5.5-6C19 13.5 20 12 20 10c0-4-4-7-8-7z"/><path d="M8 10c0-2 1.8-3.5 4-3.5"/></svg>
          </span>
          <span className="app-header-title">Mourning Guide<small>{title ?? 'Your plan'}</small></span>
          <span className="app-header-meta">{meta}</span>
        </header>

        <nav className="top-nav" aria-label="App" data-walkthrough="walkthrough-top-nav">
          {NAV.map(n => (
            <Link key={n.key} href={n.href} className={active === n.key ? 'is-active' : undefined}>
              <span className="nav-icon" style={{ color: active === n.key ? '#c57b57' : '#9a7a6a' }}>{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="app-content">{children}</div>
      </div>
    </div>
  );
}
