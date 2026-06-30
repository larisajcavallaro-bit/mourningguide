import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fffaf4]">
      <SignUp />
    </main>
  );
}
