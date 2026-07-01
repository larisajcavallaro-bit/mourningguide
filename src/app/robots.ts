import type { MetadataRoute } from 'next';

const SITE_URL = 'https://mourninguide.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/help',
          '/how-it-works',
          '/pricing',
          '/privacy',
          '/sign-in',
          '/sign-up',
          '/terms',
        ],
        disallow: [
          '/api/',
          '/dashboard',
          '/people',
          '/portal',
          '/settings',
          '/upgrade',
          '/vault/',
          '/onboarding',
          '/activate/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
