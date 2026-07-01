import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

const PAGE_BG = 'radial-gradient(circle at 72% 8%,rgba(203,183,162,0.18),transparent 28%),linear-gradient(180deg,#fffaf4,#f5eadf)';

export default function SignInPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: PAGE_BG }}>
      <Link href="/" style={{ marginBottom: 40, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mg-icon.svg" alt="" style={{ height: 44, width: 'auto' }} />
        <span style={{ fontFamily: "'Iowan Old Style',Palatino,Georgia,serif", fontSize: '1.05rem', fontWeight: 500, color: '#2C1C0E', letterSpacing: '-0.02em' }}>Mourning Guide</span>
      </Link>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#c57b57',
            colorBackground: 'transparent',
            fontFamily: "'Avenir Next','Segoe UI',Inter,system-ui,sans-serif",
            borderRadius: '12px',
          },
          elements: {
            card: {
              padding: '32px',
              border: '1px solid rgba(142,95,70,0.18)',
              borderRadius: '26px',
              background: 'linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,250,244,0.94))',
              boxShadow: '0 20px 46px rgba(67,46,33,0.1)',
            },
            headerTitle: { fontFamily: "'Iowan Old Style',Palatino,Georgia,serif", color: '#2f241f' },
            formButtonPrimary: { background: 'linear-gradient(180deg,#d88963,#c57b57)', fontSize: '1rem' },
            footerActionLink: { color: '#c86d49' },
          },
        }}
      />
    </div>
  );
}
