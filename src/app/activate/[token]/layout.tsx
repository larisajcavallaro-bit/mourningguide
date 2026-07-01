import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Activate Guide — Mourning Guide',
  robots: { index: false, follow: false },
};

export default function ActivateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
