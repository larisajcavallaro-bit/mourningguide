'use client';

import { usePathname } from 'next/navigation';
import AppWalkthrough from './AppWalkthrough';
import { stepsForTour, tourForPathname, type WalkthroughTourId } from '@/lib/walkthrough';

export default function WalkthroughHost({
  accountPath,
}: {
  accountPath: 'planning' | 'grief';
}) {
  const pathname = usePathname();
  const tourId: WalkthroughTourId | null = tourForPathname(pathname, accountPath);
  if (!tourId) return null;

  const steps = stepsForTour(tourId);
  return <AppWalkthrough key={tourId} tourId={tourId} steps={steps} />;
}
