import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  return (
    <main className="min-h-screen bg-[#fffaf4] p-8">
      <h1 className="font-serif text-3xl text-[#2f241f]">Your plan</h1>
      <p className="text-[#594b43] mt-2">Dashboard — coming soon.</p>
    </main>
  );
}
