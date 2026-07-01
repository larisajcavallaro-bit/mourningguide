import { resend } from './resend';

const FROM = 'Mourning Guide <support@mourninguide.com>';
const BRAND = '#c57b57';
const DARK = '#2f241f';
const MID = '#6b5c55';
const LIGHT = '#9c8880';
const BG = '#faf7f4';

function layout(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BG};font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Header -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <span style="font-family:Georgia,serif;font-size:1.3rem;font-weight:600;color:${DARK};letter-spacing:0.02em;">
            Mourning Guide
          </span>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:16px;border:1px solid #e8e0d8;padding:40px 36px;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center;">
          <p style="margin:0;font-size:0.75rem;color:${LIGHT};line-height:1.6;">
            Mourning Guide · <a href="https://mourninguide.com" style="color:${LIGHT};">mourninguide.com</a><br>
            Questions? <a href="mailto:support@mourninguide.com" style="color:${LIGHT};">support@mourninguide.com</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function btn(href: string, label: string) {
  return `<table cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
    <tr><td style="background:${BRAND};border-radius:10px;padding:13px 28px;">
      <a href="${href}" style="color:#ffffff;font-family:Georgia,serif;font-size:0.95rem;font-weight:600;text-decoration:none;">${label}</a>
    </td></tr>
  </table>`;
}

function h1(text: string) {
  return `<h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:1.5rem;font-weight:600;color:${DARK};line-height:1.3;">${text}</h1>`;
}

function p(text: string) {
  return `<p style="margin:0 0 16px;font-size:0.95rem;color:${MID};line-height:1.75;">${text}</p>`;
}

function divider() {
  return `<hr style="border:none;border-top:1px solid #e8e0d8;margin:24px 0;">`;
}

// ── Welcome — planning path ─────────────────────────────────────────────────

function welcomePlanningHtml(firstName: string) {
  return layout(`
    ${h1(`Welcome, ${firstName}.`)}
    ${p('Your Mourning Guide vault is ready. You have <strong style="color:${DARK}">14 days free</strong> to explore everything — no card needed yet.')}
    ${p('Here\'s the best place to start:')}

    <table cellpadding="0" cellspacing="0" style="width:100%;margin:4px 0 20px;">
      ${[
        ['🏦', 'Finances', 'Add your bank accounts, insurance, and investments'],
        ['✉️', 'Letters', 'Write a message to someone you love — to be delivered after'],
        ['👥', 'People', 'Name your legacy contact — the person who activates your guide'],
        ['🕊️', 'Final wishes', 'Leave instructions for your service so your family never has to guess'],
      ].map(([icon, title, sub]) => `
        <tr>
          <td style="padding:10px 0;vertical-align:top;width:32px;font-size:1.1rem;">${icon}</td>
          <td style="padding:10px 0 10px 10px;vertical-align:top;border-bottom:1px solid #f0e8e0;">
            <div style="font-size:0.88rem;font-weight:600;color:${DARK};margin-bottom:2px;">${title}</div>
            <div style="font-size:0.82rem;color:${LIGHT};line-height:1.5;">${sub}</div>
          </td>
        </tr>
      `).join('')}
    </table>

    ${btn('https://mourninguide.com/dashboard', 'Go to your dashboard →')}
    ${divider()}
    ${p('Reply to this email any time — we\'re here.')}
  `);
}

// ── Welcome — grief path ────────────────────────────────────────────────────

function welcomeGriefHtml(firstName: string) {
  return layout(`
    ${h1(`We're here with you, ${firstName}.`)}
    ${p('We\'re so sorry for your loss. Your Mourning Guide is set up and ready to help you navigate what comes next.')}
    ${p('Grief is not a checklist — but having a clear next step can help. Your dashboard will walk you through what to do in the days ahead, one thing at a time.')}
    ${btn('https://mourninguide.com/dashboard', 'Go to your dashboard →')}
    ${divider()}
    ${p('If there\'s anything we can do, just reply to this email.')}
  `);
}

// ── Legacy contact invitation ────────────────────────────────────────────────

function legacyInvitationHtml(contactName: string, ownerName: string) {
  return layout(`
    ${h1(`${ownerName} has named you their legacy contact.`)}
    ${p(`Hi ${contactName},`)}
    ${p(`<strong style="color:${DARK}">${ownerName}</strong> has named you as their legacy contact on Mourning Guide — a private vault where people organize their finances, wishes, and letters for their family.`)}
    ${p('When the time comes, you\'ll be the person who activates their guide. That means:')}

    <ul style="margin:0 0 20px;padding-left:20px;">
      <li style="font-size:0.9rem;color:${MID};line-height:1.75;margin-bottom:6px;">Their letters get released to the people they addressed them to</li>
      <li style="font-size:0.9rem;color:${MID};line-height:1.75;margin-bottom:6px;">Their final wishes and service instructions are shared with the family</li>
      <li style="font-size:0.9rem;color:${MID};line-height:1.75;">Their financial contacts and account details are made available</li>
    </ul>

    ${p('You don\'t need to do anything right now. We just wanted you to know — so it\'s never a surprise.')}
    ${divider()}
    ${p(`Questions? Reply to this email or reach us at <a href="mailto:support@mourninguide.com" style="color:${BRAND};">support@mourninguide.com</a>.`)}
  `);
}

// ── Activation notification ──────────────────────────────────────────────────

function activationNotificationHtml(contactName: string, deceasedName: string, activatedBy: string) {
  return layout(`
    ${h1(`A message about ${deceasedName}.`)}
    ${p(`Hi ${contactName},`)}
    ${p(`<strong style="color:${DARK}">${activatedBy}</strong> has activated ${deceasedName}'s Mourning Guide. ${deceasedName} had listed you as someone to notify.`)}
    ${p('The family is coordinating arrangements. If you\'d like to reach out, please contact the family directly.')}
    ${divider()}
    ${p(`If you have questions, you can reach us at <a href="mailto:support@mourninguide.com" style="color:${BRAND};">support@mourninguide.com</a>.`)}
  `);
}

// ── Public API ───────────────────────────────────────────────────────────────

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
