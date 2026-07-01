import type { MetadataRoute } from 'next';

const SITE_URL = 'https://mourninguide.com';

const routes = [
  { path: '/', priority: 1 },
  { path: '/how-it-works', priority: 0.8 },
  { path: '/pricing', priority: 0.8 },
  { path: '/about', priority: 0.7 },
  { path: '/contact', priority: 0.6 },
  { path: '/help', priority: 0.6 },
  { path: '/privacy', priority: 0.4 },
  { path: '/terms', priority: 0.4 },
  { path: '/sign-in', priority: 0.3 },
  { path: '/sign-up', priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(route => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.path === '/' ? 'weekly' : 'monthly',
    priority: route.priority,
  }));
}
