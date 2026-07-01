import FooterSubscribe from './FooterSubscribe';
import Link from 'next/link';
import '../app/design.css';

// Faithful port of the prototype marketing chrome (header + footer), using the
// real styles.css. The page body is passed as `children`.
export default function MarketingShell({
  current,
  children,
}: {
  current?: 'how-it-works' | 'pricing' | 'about';
  children: React.ReactNode;
}) {
  return (
    <div className="coded-home">
      <div
        className="coded-home-shell"
        style={{ width: 'min(100%,1060px)', background: 'linear-gradient(180deg,#fffaf4 0%,#f8efe7 100%)' }}
      >
        <header className="coded-header">
          <Link className="coded-logo" href="/" aria-label="Mourning Guide home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mg-icon.svg" alt="" />
            <span className="coded-logo-wordmark">Mourning Guide</span>
          </Link>
          <nav className="coded-nav" aria-label="Primary navigation">
            <Link href="/how-it-works" aria-current={current === 'how-it-works' ? 'page' : undefined}>How It Works</Link>
            <Link href="/pricing" aria-current={current === 'pricing' ? 'page' : undefined}>Pricing</Link>
            <Link href="/about" aria-current={current === 'about' ? 'page' : undefined}>About</Link>
          </nav>
          <Link className="coded-signin" href="/sign-in">Sign in</Link>
        </header>

        {children}

        <footer className="coded-footer">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mg-icon.svg" alt="Mourning Guide" style={{ height: 36, width: 'auto' }} />
            <p>© 2026 Mourning Guide. All rights reserved.</p>
          </div>
          <nav aria-label="Footer product links">
            <h4>Product</h4>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/reviews">Reviews</Link>
          </nav>
          <nav aria-label="Footer support links">
            <h4>Support</h4>
            <Link href="/help">Help Center</Link>
            <Link href="/contact">Contact Us</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/unsubscribe">Unsubscribe</Link>
          </nav>
          <nav aria-label="Footer company links">
            <h4>Company</h4>
            <Link href="/about">About</Link>
          </nav>
          <FooterSubscribe />
        </footer>
      </div>
    </div>
  );
}
