import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import "./app-design.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mourninguide.com"),
  applicationName: "Mourning Guide",
  title: "Mourning Guide",
  description: "A private planning vault and calm guide for the people you love.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Mourning Guide",
    "legacy planning",
    "family planning vault",
    "final wishes",
    "estate organization",
    "grief support",
  ],
  authors: [{ name: "Mourning Guide" }],
  creator: "Mourning Guide",
  publisher: "Mourning Guide",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mourninguide.com",
    siteName: "Mourning Guide",
    title: "Mourning Guide",
    description: "A private planning vault and calm guide for the people you love.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mourning Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mourning Guide",
    description: "A private planning vault and calm guide for the people you love.",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    title: "Mourning Guide",
    statusBarStyle: "default",
  },
  other: {
    "msapplication-TileColor": "#fffaf4",
    "msapplication-TileImage": "/mstile-150x150.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
