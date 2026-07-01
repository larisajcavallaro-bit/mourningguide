import { NextResponse } from 'next/server';
import { unsubscribeMarketingEmail } from '@/lib/marketing';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, token } = body as { email?: string; token?: string };

    if (!email?.trim() && !token?.trim()) {
      return NextResponse.json({ error: 'Email or unsubscribe link required' }, { status: 400 });
    }

    const result = await unsubscribeMarketingEmail({
      email: email?.trim(),
      token: token?.trim(),
    });

    if (!result.found && !result.email) {
      return NextResponse.json({ error: 'We could not find that subscription' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, email: result.email, found: result.found });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unsubscribe failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
