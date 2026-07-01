import { resend } from './resend';

const FROM = 'Mourning Guide <support@mourninguide.com>';

// ── Shared layout ─────────────────────────────────────────────────────────────

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Mourning Guide</title>
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#f5f0eb;min-height:100vh;padding:48px 20px;">
    <tr><td align="center" valign="top">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width:520px;">

        <!-- Logo -->
        <tr><td align="center" style="padding-bottom:28px;">
          <img src="https://mourninguide.com/mg-icon.svg"
            alt="Mourning Guide" width="52" height="52"
            style="display:block;margin:0 auto 14px;border:0;" />
          <span style="display:block;font-family:Georgia,serif;font-size:1.05rem;
            font-weight:600;color:#2f241f;letter-spacing:0.04em;">
            Mourning Guide
          </span>
        </td></tr>

        <!-- Card -->
        <tr><td style="
          background:#ffffff;
          border-radius:16px;
          border:1px solid #e2d9d0;
          overflow:hidden;
          box-shadow:0 2px 12px rgba(47,36,31,0.06);
        ">
          <!-- Accent bar -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background:#c57b57;height:4px;line-height:4px;font-size:4px;">&nbsp;</td></tr>
          </table>

          <!-- Content -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:40px 40px 44px;">
              ${content}
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding-top:32px;padding-bottom:8px;">
          <p style="margin:0 0 6px;font-size:0.72rem;color:#9c8880;letter-spacing:0.03em;text-transform:uppercase;">
            The kindest thing you can do for the people you love.
          </p>
          <p style="margin:0;font-size:0.72rem;color:#b8a89e;line-height:1.7;">
            <a href="https://mourninguide.com" style="color:#b8a89e;text-decoration:none;">mourninguide.com</a>
            &nbsp;·&nbsp;
            <a href="mailto:support@mourninguide.com" style="color:#b8a89e;text-decoration:none;">support@mourninguide.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function h1(text: string) {
  return `<h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:1.55rem;
    font-weight:600;color:#2f241f;line-height:1.3;">${text}</h1>`;
}

function p(text: string) {
  return `<p style="margin:0 0 16px;font-size:0.94rem;color:#6b5c55;line-height:1.8;">${text}</p>`;
}

function btn(href: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 4px;">
      <tr>
        <td style="background:#c57b57;border-radius:10px;padding:14px 30px;">
          <a href="${href}" style="
            color:#ffffff;font-family:Georgia,serif;font-size:0.94rem;
            font-weight:600;text-decoration:none;white-space:nowrap;
            letter-spacing:0.01em;
          ">${label}</a>
        </td>
      </tr>
    </table>`;
}

function divider() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
    <tr><td style="border-top:1px solid #ede5de;font-size:0;line-height:0;">&nbsp;</td></tr>
  </table>`;
}

function checklist(items: [string, string, string][]) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
      style="width:100%;margin:16px 0 24px;border:1px solid #ede5de;border-radius:12px;overflow:hidden;">
      ${items.map(([icon, title, sub], i) => `
        <tr style="background:${i % 2 === 0 ? '#faf7f4' : '#ffffff'};">
          <td style="padding:13px 14px;font-size:1.1rem;vertical-align:top;width:36px;">${icon}</td>
          <td style="padding:13px 14px 13px 4px;vertical-align:top;${i < items.length - 1 ? 'border-bottom:1px solid #ede5de;' : ''}">
            <div style="font-size:0.86rem;font-weight:600;color:#2f241f;margin-bottom:2px;">${title}</div>
            <div style="font-size:0.8rem;color:#9c8880;line-height:1.5;">${sub}</div>
          </td>
        </tr>
      `).join('')}
    </table>`;
}

// ── Email bodies ──────────────────────────────────────────────────────────────

function welcomePlanningHtml(firstName: string) {
  return layout(`
    ${h1(`Welcome, ${firstName}.`)}
    ${p('Your Mourning Guide vault is ready. You have <strong style="color:#2f241f;">14 days free</strong> to explore everything — no card needed yet.')}
    ${p("Here's the best place to start:")}
    ${checklist([
      ['🏦', 'Finances', 'Add your bank accounts, insurance, and investments'],
      ['✉️', 'Letters', 'Write a message to someone you love — to be delivered after'],
      ['👥', 'People', 'Name your legacy contact — the person who activates your guide'],
      ['🕊️', 'Final wishes', 'Leave instructions so your family never has to guess'],
    ])}
    ${btn('https://mourninguide.com/dashboard', 'Go to your dashboard →')}
    ${divider()}
    ${p('Reply to this email any time — we\'re here.')}
  `);
}

function welcomeGriefHtml(firstName: string) {
  return layout(`
    ${h1(`We\'re here with you, ${firstName}.`)}
    ${p('We\'re so sorry for your loss. Your Mourning Guide is set up and ready to help you navigate what comes next.')}
    ${p('Grief is not a checklist — but having a clear next step can help. Your dashboard will walk you through what to do in the days ahead, one thing at a time.')}
    ${btn('https://mourninguide.com/dashboard', 'Go to your dashboard →')}
    ${divider()}
    ${p('If there\'s anything we can do, just reply to this email.')}
  `);
}

function legacyInvitationHtml(contactName: string, ownerName: string) {
  return layout(`
    ${h1(`${ownerName} has named you their legacy contact.`)}
    ${p(`Hi ${contactName},`)}
    ${p(`<strong style="color:#2f241f;">${ownerName}</strong> has named you as their legacy contact on Mourning Guide — a private vault where people organize their finances, wishes, and letters for the people they love.`)}
    ${p('When the time comes, you\'ll be the person who activates their guide. That means:')}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
      style="width:100%;margin:4px 0 24px;border:1px solid #ede5de;border-radius:12px;overflow:hidden;">
      <tr style="background:#faf7f4;"><td style="padding:13px 16px;font-size:0.86rem;color:#6b5c55;line-height:1.6;border-bottom:1px solid #ede5de;">
        📬&nbsp; Their letters are released to the people they wrote them for
      </td></tr>
      <tr style="background:#ffffff;"><td style="padding:13px 16px;font-size:0.86rem;color:#6b5c55;line-height:1.6;border-bottom:1px solid #ede5de;">
        🕊️&nbsp; Their service wishes are shared with the family
      </td></tr>
      <tr style="background:#faf7f4;"><td style="padding:13px 16px;font-size:0.86rem;color:#6b5c55;line-height:1.6;">
        🏦&nbsp; Financial contacts and account details are made available
      </td></tr>
    </table>
    ${p('You don\'t need to do anything right now. We just wanted you to know — so it\'s never a surprise.')}
    ${divider()}
    ${p('Questions? Reply to this email or reach us at <a href="mailto:support@mourninguide.com" style="color:#c57b57;">support@mourninguide.com</a>.')}
  `);
}

function activationNotificationHtml(contactName: string, deceasedName: string, activatedBy: string) {
  return layout(`
    ${h1(`A message about ${deceasedName}.`)}
    ${p(`Hi ${contactName},`)}
    ${p(`<strong style="color:#2f241f;">${activatedBy}</strong> has activated ${deceasedName}'s Mourning Guide. ${deceasedName} had listed you as someone to notify.`)}
    ${p('The family is coordinating arrangements. If you\'d like to reach out, please contact the family directly.')}
    ${divider()}
    ${p('Questions? <a href="mailto:support@mourninguide.com" style="color:#c57b57;">support@mourninguide.com</a>')}
  `);
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail({
  to, firstName, path,
}: { to: string; firstName: string; path: 'planning' | 'grief' }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: path === 'planning'
      ? 'Your Mourning Guide is ready'
      : 'We\'re here with you — your guide is set up',
    html: path === 'planning'
      ? welcomePlanningHtml(firstName)
      : welcomeGriefHtml(firstName),
  });
}

export async function sendLegacyContactInvitation({
  to, contactName, ownerName,
}: { to: string; contactName: string; ownerName: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${ownerName} has named you their legacy contact`,
    html: legacyInvitationHtml(contactName, ownerName),
  });
}

export async function sendActivationNotification({
  to, contactName, deceasedName, activatedBy,
}: { to: string; contactName: string; deceasedName: string; activatedBy: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `A message about ${deceasedName}`,
    html: activationNotificationHtml(contactName, deceasedName, activatedBy),
  });
}
