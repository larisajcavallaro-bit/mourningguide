import { resend } from './resend';

const FROM = 'Mourning Guide <support@mourninguide.com>';

// -- Welcome email sent to the user after onboarding --
export async function sendWelcomeEmail({
  to, firstName, path,
}: { to: string; firstName: string; path: 'planning' | 'grief' }) {
  const subject = path === 'planning'
    ? 'Your Mourning Guide is ready'
    : 'We\'re here with you — your guide is set up';

  const body = path === 'planning' ? `
    <p>Hi ${firstName},</p>
    <p>Your Mourning Guide vault is ready. You have 14 days to explore everything before your free trial ends — no card needed yet.</p>
    <p>Here's what to do first:</p>
    <ul>
      <li><strong>Finances</strong> — add your bank accounts, insurance, and investments</li>
      <li><strong>Letters</strong> — write a message to someone you love</li>
      <li><strong>People</strong> — add your legacy contact, the person who'll activate your guide</li>
      <li><strong>Final wishes</strong> — leave instructions for your service</li>
    </ul>
    <p><a href="https://mourninguide.com/dashboard">Go to your dashboard →</a></p>
    <p>Questions? Reply to this email anytime.</p>
    <p>— The Mourning Guide team</p>
  ` : `
    <p>Hi ${firstName},</p>
    <p>We're so sorry for your loss. Your Mourning Guide is set up and ready to help you navigate what comes next.</p>
    <p>Your dashboard has a checklist of what to do in the days and weeks ahead — take it one step at a time.</p>
    <p><a href="https://mourninguide.com/dashboard">Go to your dashboard →</a></p>
    <p>If there's anything we can do, reply to this email.</p>
    <p>— The Mourning Guide team</p>
  `;

  return resend.emails.send({
    from: FROM,
    to,
    subject,
    html: `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#2f241f;line-height:1.7">${body}</div>`,
  });
}

// -- Invitation email to a legacy contact when they're added --
export async function sendLegacyContactInvitation({
  to, contactName, ownerName,
}: { to: string; contactName: string; ownerName: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${ownerName} has named you their legacy contact`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#2f241f;line-height:1.7">
        <h2 style="font-size:1.4rem;margin-bottom:8px">Hi ${contactName},</h2>
        <p>${ownerName} has named you as their <strong>legacy contact</strong> on Mourning Guide.</p>
        <p>This means that when the time comes, you'll be the person who activates their guide — releasing their letters, sharing their wishes, and helping coordinate everything for the family.</p>
        <p>You don't need to do anything right now. We just wanted you to know, so it's never a surprise.</p>
        <p>If you have questions, you can reply to this email or reach us at <a href="mailto:support@mourninguide.com">support@mourninguide.com</a>.</p>
        <p>— The Mourning Guide team</p>
      </div>
    `,
  });
}

// -- Notification to a contact when the guide is activated (future use) --
export async function sendActivationNotification({
  to, contactName, deceasedName, activatedBy,
}: { to: string; contactName: string; deceasedName: string; activatedBy: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `A message about ${deceasedName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#2f241f;line-height:1.7">
        <p>Hi ${contactName},</p>
        <p>${activatedBy} has activated ${deceasedName}'s Mourning Guide. ${deceasedName} had listed you as someone to notify.</p>
        <p>The family is coordinating arrangements. If you'd like to reach out, please contact the family directly.</p>
        <p>— The Mourning Guide team</p>
      </div>
    `,
  });
}
