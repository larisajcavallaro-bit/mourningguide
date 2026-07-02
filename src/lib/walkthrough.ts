export type WalkthroughStep = {
  id: string;
  /** Matches [data-walkthrough="…"] on a page element */
  target: string;
  title: string;
  body: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
};

export type WalkthroughTourId =
  | 'planning-dashboard'
  | 'planning-vault'
  | 'planning-people'
  | 'planning-portal'
  | 'grief-dashboard';

const STORAGE_PREFIX = 'mg_walkthrough_done_';

export function isWalkthroughDone(tourId: WalkthroughTourId): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(`${STORAGE_PREFIX}${tourId}`) === '1';
}

export function markWalkthroughDone(tourId: WalkthroughTourId): void {
  localStorage.setItem(`${STORAGE_PREFIX}${tourId}`, '1');
}

export function resetWalkthrough(tourId: WalkthroughTourId): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${tourId}`);
}

export function resetAllWalkthroughs(): void {
  const tours: WalkthroughTourId[] = [
    'planning-dashboard',
    'planning-vault',
    'planning-people',
    'planning-portal',
    'grief-dashboard',
  ];
  tours.forEach(resetWalkthrough);
}

export const PLANNING_DASHBOARD_STEPS: WalkthroughStep[] = [
  {
    id: 'welcome',
    target: 'walkthrough-dashboard-heading',
    title: 'Welcome to your planning home',
    body: 'This is your starting place. You can come back here anytime. Nothing is urgent — add information at your own pace.',
    placement: 'bottom',
  },
  {
    id: 'viewing',
    target: 'walkthrough-account-switcher',
    title: 'Switch between plans',
    body: 'If you have more than one plan on this email — for example, your own plan and a parent\'s — use Viewing at the top to switch. Each plan is separate.',
    placement: 'bottom',
  },
  {
    id: 'nav',
    target: 'walkthrough-top-nav',
    title: 'The five main sections',
    body: 'Home is this screen. Personal is your vault of accounts and documents. Remember holds letters and photos. People is who gets access later. Portal is what family will see online.',
    placement: 'bottom',
  },
  {
    id: 'quick-actions',
    target: 'walkthrough-quick-actions',
    title: 'Quick actions',
    body: 'Tap any card to jump straight to that area. You do not need to fill everything in today. Even one entry helps your family.',
    placement: 'top',
  },
  {
    id: 'settings',
    target: 'walkthrough-settings-link',
    title: 'Settings & billing',
    body: 'Settings is where you manage your account, add another plan for a parent, invite a relative to help, and see subscription details.',
    placement: 'top',
  },
];

export const PLANNING_VAULT_STEPS: WalkthroughStep[] = [
  {
    id: 'vault-intro',
    target: 'walkthrough-vault-heading',
    title: 'Your planning vault',
    body: 'Each tile is a category — banks, insurance, documents, and more. Tap one to add names and notes. Store where things are, not passwords or account numbers.',
    placement: 'bottom',
  },
  {
    id: 'vault-tiles',
    target: 'walkthrough-vault-grid',
    title: 'Work in any order',
    body: 'All areas are optional. Many people start with banks and insurance, then add documents when they have them handy.',
    placement: 'top',
  },
];

export const PLANNING_PEOPLE_STEPS: WalkthroughStep[] = [
  {
    id: 'people-intro',
    target: 'walkthrough-people-heading',
    title: 'People who matter',
    body: 'Legacy contacts are trusted people who can unlock your guide when the time comes. Notification contacts are people you want informed — you can add many.',
    placement: 'bottom',
  },
];

export const PLANNING_PORTAL_STEPS: WalkthroughStep[] = [
  {
    id: 'portal-intro',
    target: 'walkthrough-portal-heading',
    title: 'Family memorial portal',
    body: 'This is the public page your family can share — obituary, service details, photos, and ways to help. You control what is published and can unpublish anytime.',
    placement: 'bottom',
  },
];

export const GRIEF_DASHBOARD_STEPS: WalkthroughStep[] = [
  {
    id: 'grief-welcome',
    target: 'walkthrough-dashboard-heading',
    title: 'We\'re here with you',
    body: 'This grief path is always free. We show a few next steps at a time — no pressure, no timers. You can stop anytime.',
    placement: 'bottom',
  },
  {
    id: 'grief-nav',
    target: 'walkthrough-top-nav',
    title: 'Find what you need',
    body: 'Use the tabs to open tasks, people to notify, finances to sort out, and a memorial page when you\'re ready.',
    placement: 'bottom',
  },
];

export function tourForPathname(
  pathname: string,
  accountPath: 'planning' | 'grief',
): WalkthroughTourId | null {
  if (accountPath === 'grief') {
    if (pathname === '/dashboard' || pathname.startsWith('/dashboard')) return 'grief-dashboard';
    return null;
  }
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard')) return 'planning-dashboard';
  if (pathname === '/vault' || pathname.startsWith('/vault')) return 'planning-vault';
  if (pathname === '/people' || pathname.startsWith('/people')) return 'planning-people';
  if (pathname === '/portal' || pathname.startsWith('/portal')) return 'planning-portal';
  return null;
}

export function stepsForTour(tourId: WalkthroughTourId): WalkthroughStep[] {
  switch (tourId) {
    case 'planning-dashboard': return PLANNING_DASHBOARD_STEPS;
    case 'planning-vault': return PLANNING_VAULT_STEPS;
    case 'planning-people': return PLANNING_PEOPLE_STEPS;
    case 'planning-portal': return PLANNING_PORTAL_STEPS;
    case 'grief-dashboard': return GRIEF_DASHBOARD_STEPS;
    default: return [];
  }
}
