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
  {
    file: 'src/app/(app)/vault/letters/LettersClient.tsx',
    name: 'Letters page',
    require: [
      'Letters to loved ones',
      "Subject <span className=\"opt\">(optional)</span>",
      'When should this be delivered?',
      'On a specific date',
      'Saved letters',
    ],
    forbid: [
      'sheet-overlay',
      'Letter to</div>',
    ],
  },
  {
    file: 'src/app/(app)/vault/finances/FinancesClient.tsx',
    name: 'Finances detail',
    require: [
      'planning-detail-grid',
      'instructions-box',
      'security-note',
      'designed-saved-section',
      'Add another account',
    ],
  },
  {
    file: 'src/app/(app)/vault/documents/DocumentsClient.tsx',
    name: 'Documents page',
    require: [
      'Back to Personal',
      'Documents',
      'Store your will, trust, IDs, and other important papers.',
      '+ Add document',
      'entry-card',
    ],
  },
  {
    file: 'src/app/(app)/vault/wishes/WishesClient.tsx',
    name: 'Final wishes page',
    require: [
      'Final wishes',
      'Include a reception',
      'Save wishes',
      'Additional notes for your family',
    ],
  },
  {
    file: 'src/app/(app)/remember/RememberSetupClient.tsx',
    name: 'Remember detail template',
    require: [
      'Back to Remember',
      'portal-page-header',
      'remember-upload',
      'designed-saved-section remember-saved',
      'addAnotherLabel',
    ],
  },
  {
    file: 'src/app/(app)/remember/rememberSetups.ts',
    name: 'Remember setup definitions',
    require: [
      "title: 'Photos & memories'",
      "title: 'Voice & video messages'",
      "title: 'Music for your service'",
      "title: 'Speakers & readings'",
      "title: 'Obituary & eulogy'",
    ],
  },
  {
    file: 'src/app/(app)/remember/photos/page.tsx',
    name: 'Remember photos route',
    require: [
      'RememberSetupClient',
      'setupKey="photos"',
      'title="Photos & memories"',
    ],
  },
  {
    file: 'src/app/(app)/remember/voice-video/page.tsx',
    name: 'Remember voice-video route',
    require: [
      'RememberSetupClient',
      'setupKey="voice-video"',
      'title="Voice & video"',
    ],
  },
  {
    file: 'src/app/(app)/remember/music/page.tsx',
    name: 'Remember music route',
    require: [
      'RememberSetupClient',
      'setupKey="music"',
      'title="Music"',
    ],
  },
  {
    file: 'src/app/(app)/remember/speakers/page.tsx',
    name: 'Remember speakers route',
    require: [
      'RememberSetupClient',
      'setupKey="speakers"',
      'title="Speakers & readings"',
    ],
  },
  {
    file: 'src/app/(app)/remember/obituary/page.tsx',
    name: 'Remember obituary route',
    require: [
      'RememberSetupClient',
      'setupKey="obituary"',
      'title="Obituary & eulogy"',
    ],
  },
  {
    file: 'src/app/(app)/people/successors/page.tsx',
    name: 'Legacy contacts route',
    require: [
      'PeopleClient',
      'mode="legacy"',
      'title="Legacy contacts"',
    ],
  },
  {
    file: 'src/app/(app)/people/notify/page.tsx',
    name: 'People notify route',
    require: [
      'PeopleClient',
      'mode="notify"',
      'title="People to notify"',
    ],
  },
  {
    file: 'src/app/(app)/portal/gallery/page.tsx',
    name: 'Portal gallery route',
    require: [
      'GallerySettingsClient',
      'title="Portal"',
    ],
  },
  {
    file: 'src/app/(app)/portal/guestbook/page.tsx',
    name: 'Portal guestbook route',
    require: [
      'GuestbookSettingsClient',
      'title="Portal"',
    ],
  },
  {
    file: 'src/app/(app)/portal/ways-to-help/page.tsx',
    name: 'Portal ways-to-help route',
    require: [
      'WaysToHelpClient',
      'title="Portal"',
    ],
  },
  {
    file: 'src/app/(app)/portal/service-details/page.tsx',
    name: 'Portal service-details route',
    require: [
      'ServiceDetailsClient',
      'title="Portal"',
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
