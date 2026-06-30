import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import './home.css';

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <div className="coded-home">
      <div className="coded-home-shell">

        {/* Header */}
        <header className="coded-header">
          <a className="coded-logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mg-icon.svg" alt="" />
            <span className="coded-logo-wordmark">Mourning Guide</span>
          </a>
          <nav className="coded-nav">
            <a href="/how-it-works">How It Works</a>
            <a href="/pricing">Pricing</a>
            <a href="/about">About</a>
          </nav>
          <Link className="coded-signin" href="/sign-in">Sign in</Link>
        </header>

        <main>
          {/* Hero */}
          <section className="coded-hero">
            <div className="coded-hero-copy">
              <h1>The kindest thing you can do for the people you love.</h1>
              <div className="coded-rule" />
              <p>Plan your estate at your own pace — or get one clear next step when someone you love has just died. First steps after a loss are always free.</p>
              <div className="coded-actions">
                <Link className="coded-button primary" href="/sign-up?path=planning">
                  Start planning — free for 14 days
                </Link>
                <Link className="coded-button secondary" href="/sign-up?path=grief">
                  Get help after a loss — free, always
                </Link>
              </div>
              <p className="coded-trust">Private. Secure. US families only.</p>
            </div>
            <div className="coded-hero-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/hero-scene.png" alt="A quiet archway opening onto a soft path through grass." />
            </div>
          </section>

          {/* Support moments */}
          <section className="coded-moments">
            <h2>Support for life's most important moments.</h2>
            <div className="coded-moment-grid">
              <article>
                <span className="emblem emblem-lock" />
                <h3>Always private</h3>
                <p>Your information is encrypted and never sold.</p>
              </article>
              <article>
                <span className="emblem emblem-family" />
                <h3>Built for US families</h3>
                <p>State-specific guidance, US agencies, and 100+ company guides.</p>
              </article>
              <article>
                <span className="emblem emblem-path" />
                <h3>One clear next step</h3>
                <p>Never more than three tasks at a time. No overwhelming checklists.</p>
              </article>
              <article>
                <span className="emblem emblem-heart" />
                <h3>Grief is always free</h3>
                <p>No credit card. No trial. No time limit. Support when you need it most.</p>
              </article>
            </div>
          </section>

          {/* Feature showcase */}
          <section className="coded-features">
            <h2>Everything your family needs — in one secure place.</h2>
            <div className="coded-small-rule" />
            <p className="coded-section-copy">From planning your estate to navigating the first days after a loss, Mourning Guide gives families a clear map and a calm next step.</p>
            <div className="coded-feature-grid">
              <article>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/feature-vault.png" alt="Framed family photo beside a mug and vase." />
                <span className="emblem emblem-family" />
                <h3>A private vault for what your family needs to find</h3>
                <p>Document every bank account, insurance policy, and subscription — so nothing gets missed and nothing goes to the wrong person.</p>
              </article>
              <article>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/feature-guides.png" alt="A next steps checklist beside a pen and coffee." />
                <span className="emblem emblem-guide" />
                <h3>Step-by-step guides for 100+ US companies</h3>
                <p>Exact phone numbers, the right department, and what to say — for every bank, insurer, cell carrier, and government agency.</p>
              </article>
              <article>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/feature-portal.png" alt="Memorial page displayed on a laptop." />
                <span className="emblem emblem-heart" />
                <h3>A beautiful online memorial — no app required to view</h3>
                <p>Share service details, photos, and a guestbook. Visitors just tap a link — no account, no download.</p>
              </article>
            </div>
          </section>

          {/* Fog / clarity */}
          <section className="coded-fog">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fog-chair.png" alt="A quiet chair with a blanket and small table." />
            <div>
              <p>What to do when someone dies</p>
              <h2>When you&apos;re in the fog, we bring one clear next step.</h2>
              <div className="coded-rule" />
              <p className="coded-fog-copy">You shouldn&apos;t have to figure out what to do after a loved one dies while you&apos;re in shock. We give you three things — and nothing more until you&apos;re ready.</p>
              <Link className="coded-button primary" href="/sign-up?path=grief">See how it works</Link>
            </div>
          </section>

          {/* Pre-footer strip */}
          <section className="coded-help-strip">
            <div>
              <span className="emblem emblem-heart" />
              <p><strong>Grief support is always free.</strong><br />No credit card. No trial period. No time limit. Start right now.</p>
            </div>
            <Link href="/sign-up?path=grief">Get help after a loss →</Link>
          </section>
        </main>

        {/* Footer */}
        <footer className="coded-footer">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mg-icon.svg" alt="Mourning Guide" />
            <p>© 2026 Mourning Guide. All rights reserved.</p>
          </div>
          <nav>
            <h4>Product</h4>
            <a href="/how-it-works">How It Works</a>
            <a href="/pricing">Pricing</a>
          </nav>
          <nav>
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="mailto:support@mourninguide.com">Contact Us</a>
            <a href="/privacy">Privacy</a>
          </nav>
          <nav>
            <h4>Company</h4>
            <a href="/about">About</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </nav>
          <form action="#">
            <h4>Stay in the know</h4>
            <p>Thoughtful guidance and updates.</p>
            <label>
              <span>Email address</span>
              <input type="email" placeholder="Your email address" />
            </label>
            <button type="submit">→</button>
          </form>
        </footer>

      </div>
    </div>
  );
}
