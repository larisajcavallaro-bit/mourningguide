import { NextResponse } from 'next/server';
import { subscribeMarketingEmail, unsubscribeUrl } from '@/lib/marketing';
import { sendMarketingSubscribeConfirmation } from '@/lib/emails';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await subscribeMarketingEmail(email, 'footer');

    if (!result.alreadySubscribed) {
      sendMarketingSubscribeConfirmation({
        to: result.email,
        unsubscribeUrl: unsubscribeUrl(result.token),
      }).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      alreadySubscribed: result.alreadySubscribed,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Subscribe failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
