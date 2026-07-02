import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/how-it-works',      // public marketing pages
  '/pricing',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
  '/help',
  '/reviews',
  '/reviews/(.*)',
  '/unsubscribe',
  '/robots.txt',
  '/sitemap.xml',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/dashboard',
  '/people',
  '/settings',
  '/staff',
  '/staff/(.*)',
  '/billing',
  '/upgrade',
  '/vault(.*)',
  '/remember(.*)',
  '/portal',
  '/portal/(.*)',       // public memorial pages
  '/invite/(.*)',      // family collaborator invite accept
  '/activate/(.*)',    // legacy contact activation flow
  '/api/activate/(.*)', // activation + cancel endpoints (token-authenticated)
  '/api/cron/(.*)',    // cron jobs (CRON_SECRET-authenticated)
  '/api/webhooks/(.*)', // Stripe + Clerk webhooks bypass auth
  '/api/reviews',         // public review list + submit (POST moderated)
  '/api/marketing/subscribe',
  '/api/marketing/unsubscribe',
  '/marketing/(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};
