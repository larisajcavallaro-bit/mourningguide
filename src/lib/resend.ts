import { Resend } from 'resend';

type ResendClient = InstanceType<typeof Resend>;

let client: ResendClient | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is required to send email');
  }
  client ??= new Resend(apiKey);
  return client;
}

export const resend = {
  emails: {
    send: (...args: Parameters<ResendClient['emails']['send']>) =>
      getResend().emails.send(...args),
  },
};
