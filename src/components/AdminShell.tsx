import Link from 'next/link';

type AdminNavKey = 'dashboard' | 'customers' | 'reviews';

interface AdminShellProps {
  children: React.ReactNode;
  title?: string;
  active: AdminNavKey;
}

const NAV: { key: AdminNavKey; href: string; label: string }[] = [
  { key: 'dashboard', href: '/staff', label: 'Overview' },
  { key: 'customers', href: '/staff/customers', label: 'Customers' },
  { key: 'reviews', href: '/staff/reviews', label: 'Reviews' },
];

export default function AdminShell({ children, title, active }: AdminShellProps) {
  return (
    <div className="admin-outer">
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">Staff only</p>
            <h1 className="admin-title">Mourning Guide Admin{title ? ` · ${title}` : ''}</h1>
          </div>
          <Link href="/dashboard" className="admin-back-link">← App</Link>
        </header>

        <nav className="admin-nav" aria-label="Admin">
          {NAV.map(item => (
            <Link
              key={item.key}
              href={item.href}
              className={active === item.key ? 'is-active' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
