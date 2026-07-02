import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const checks = [
  {
    file: 'src/app/(app)/dashboard/page.tsx',
    name: 'Dashboard',
    require: [
      'app-install-card',
      'progress-card',
      'start-nudge-card',
      'Quick actions',
      'Status',
      "Your family's guide",
    ],
  },
  {
    file: 'src/app/(app)/vault/page.tsx',
    name: 'Personal overview',
    require: [
      'type VaultArea = [name: string, desc: string, href: string, areaIcon: ReactNode];',
      'areas-grid',
      'area-tile',
      'tile-icon',
      'Your planning areas',
    ],
    forbid: [
      '<div className="tile-icon">+</div>',
    ],
  },
  {
    file: 'src/app/(app)/remember/page.tsx',
    name: 'Remember overview',
    require: [
      'feature-grid remember-feature-grid',
      'What you can leave',
      'How it works',
      'Letters to loved ones',
    ],
  },
  {
    file: 'src/app/(app)/people/PeopleClient.tsx',
    name: 'People',
    require: [
      'role-grid designed-roles',
      'How activation works',
      'portal-page-header',
      'entry-card',
      'Legacy contacts',
      'People to notify',
    ],
  },
  {
    file: 'src/app/(app)/portal/PortalClient.tsx',
    name: 'Portal designer',
    require: [
      'portal-designer-preview',
      'portal-details-grid',
      'Publish memorial page',
      'What else you can set up',
      'ThemeSettings',
    ],
  },
  {
    file: 'src/app/(app)/portal/PortalOptionClients.tsx',
    name: 'Portal option pages',
    require: [
      'PortalPageFrame',
      'layout-grid',
      'Guestbook',
      'Ways to help',
      'Service & gifts',
      'gift-card designed',
    ],
  },
];

const sharedForbid = [
  {
    file: 'src/app/(app)/vault/page.tsx',
    text: "['Banks & savings', 'Checking, savings, and CDs', '/vault/finances?category=bank']",
  },
];

const failures = [];

for (const check of checks) {
  const target = path.join(root, check.file);
  const source = readFileSync(target, 'utf8');

  for (const snippet of check.require) {
    if (!source.includes(snippet)) {
      failures.push(`${check.name}: missing required design marker ${JSON.stringify(snippet)} in ${check.file}`);
    }
  }

  for (const snippet of check.forbid ?? []) {
    if (source.includes(snippet)) {
      failures.push(`${check.name}: found forbidden fallback marker ${JSON.stringify(snippet)} in ${check.file}`);
    }
  }
}

for (const item of sharedForbid) {
  const target = path.join(root, item.file);
  const source = readFileSync(target, 'utf8');
  if (source.includes(item.text)) {
    failures.push(`Forbidden lightweight implementation marker ${JSON.stringify(item.text)} still exists in ${item.file}`);
  }
}

if (failures.length) {
  console.error('\nDesign lock failed. Approved designed app routes were not preserved.\n');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('\nRefuse deploy until the designed route structure is restored.\n');
  process.exit(1);
}

console.log('Design lock passed: approved designed app routes are present.');
