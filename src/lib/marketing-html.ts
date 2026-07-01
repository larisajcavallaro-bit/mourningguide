// Prepares the ported prototype markup for the live app: rewrites prototype
// links to real app routes and tags multi-column grids so they collapse on
// mobile. The visual design is otherwise the exact prototype markup.

const PLANNING = '/sign-up?redirect_url=%2Fonboarding%3Fpath%3Dplanning';
const GRIEF = '/sign-up?redirect_url=%2Fonboarding%3Fpath%3Dgrief';

const LINKS: [RegExp, string][] = [
  [/\/onboarding\/planning-signup\.html/g, PLANNING],
  [/\/onboarding\/grief-signup\.html/g, GRIEF],
  [/\/marketing\/planning-path\.html/g, PLANNING],
  [/\/marketing\/grief-path\.html/g, GRIEF],
  [/\/marketing\/how-it-works\.html/g, '/how-it-works'],
  [/\/marketing\/pricing\.html/g, '/pricing'],
  [/\/marketing\/about\.html/g, '/about'],
  [/\/marketing\/privacy\.html/g, '/privacy'],
  [/\/marketing\/contact\.html/g, 'mailto:support@mourninguide.com'],
  [/\/marketing\/sign-in\.html/g, '/sign-in'],
  [/\/index\.html/g, '/'],
];

export function prepareMarketingHtml(html: string): string {
  let out = html;
  for (const [re, to] of LINKS) out = out.replace(re, to);
  // Tag every inline grid container so the responsive layer can collapse it.
  out = out.replace(/style="([^"]*grid-template-columns[^"]*)"/g, 'class="mkt-grid" style="$1"');
  // Drop prototype review hooks.
  out = out.replace(/\sdata-review-(section|label|page)="[^"]*"/g, '');
  return out;
}
