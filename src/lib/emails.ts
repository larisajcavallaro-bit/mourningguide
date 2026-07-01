import { resend } from './resend';

const FROM = 'Mourning Guide <support@mourninguide.com>';

// ── Layout ────────────────────────────────────────────────────────────────────

function layout(content: string, footerNote?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
</head>
<body style="margin:0;padding:0;background:#f2ece6;font-family:Georgia,'Times New Roman',serif;-webkit-font-smoothing:antialiased;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#f2ece6;padding:48px 20px 56px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="max-width:500px;">

        <!-- Logo mark -->
        <tr><td align="center" style="padding-bottom:24px;">
          <img src="https://mourninguide.com/mg-icon.svg"
            alt="Mourning Guide" width="60" height="60"
            style="display:block;margin:0 auto;border:0;border-radius:8px;" />
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#fffdf9;border-radius:20px;border:1px solid #ddd4c8;
          overflow:hidden;">

          <!-- Top accent -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="background:linear-gradient(90deg,#c57b57,#d4956f);height:3px;
              line-height:3px;font-size:3px;">&nbsp;</td></tr>
          </table>

          <!-- Body -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:44px 44px 48px;">
              ${content}
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding-top:36px;">
          ${footerNote ? `<p style="margin:0 0 12px;font-size:0.82rem;color:#a09088;font-style:italic;line-height:1.7;">${footerNote}</p>` : ''}
          <p style="margin:0;font-size:0.72rem;color:#b8a89e;line-height:1.8;letter-spacing:0.02em;">
            <a href="https://mourninguide.com" style="color:#b8a89e;text-decoration:none;">mourninguide.com</a>
            &nbsp;&nbsp;·&nbsp;&nbsp;
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

function greeting(name: string) {
  return `<p style="margin:0 0 28px;font-family:Georgia,serif;font-size:1.5rem;
    font-weight:600;color:#2f241f;line-height:1.3;">${name}</p>`;
}

function body(text: string) {
  return `<p style="margin:0 0 20px;font-size:1rem;color:#4a3c36;line-height:1.9;
    font-family:Georgia,serif;">${text}</p>`;
}

function pullQuote(text: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
      style="width:100%;margin:28px 0;">
      <tr>
        <td style="border-left:3px solid #c57b57;padding:4px 0 4px 20px;">
          <p style="margin:0;font-size:1.05rem;color:#6b5c55;line-height:1.8;
            font-style:italic;font-family:Georgia,serif;">${text}</p>
        </td>
      </tr>
    </table>`;
}

function cta(href: string, label: string) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
      style="margin:32px 0 8px;">
      <tr>
        <td style="background:#c57b57;border-radius:12px;padding:15px 32px;">
          <a href="${href}" style="color:#ffffff;font-family:Georgia,serif;
            font-size:0.95rem;font-weight:600;text-decoration:none;
            letter-spacing:0.02em;">${label}</a>
        </td>
      </tr>
    </table>`;
}

function divider() {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
      border="0" style="margin:32px 0 28px;">
      <tr><td style="border-top:1px solid #e8dfd6;line-height:0;font-size:0;">&nbsp;</td></tr>
    </table>`;
}

function sign() {
  return `<p style="margin:20px 0 0;font-size:0.9rem;color:#9c8880;font-style:italic;
    font-family:Georgia,serif;line-height:1.7;">With care,<br>
    <span style="color:#6b5c55;font-weight:600;">The Mourning Guide team</span></p>`;
}

// ── Welcome — planning ────────────────────────────────────────────────────────

function welcomePlanningHtml(firstName: string) {
  return layout(`
    ${greeting(`Dear ${firstName},`)}
    ${body('What you\'ve just done — sitting down and deciding to prepare — is one of the most loving things a person can do for their family.')}
    ${body('Most people never do it. Not because they don\'t love their family, but because it\'s hard to face. You faced it. And the people you love will one day be so grateful you did.')}
    ${pullQuote('Your vault is ready. Your finances, your letters, your wishes — a complete picture that means your family will never have to guess, search, or wonder at the hardest moment of their lives.')}
    ${body('You have 14 days to explore everything at no cost — no card, no commitment. Take your time. There\'s no rush. Just start with one thing today.')}
    ${cta('https://mourninguide.com/dashboard', 'Open your guide →')}
    ${divider()}
    ${body('If you ever have a question — about the guide, about what to fill in, about anything — just reply to this email. We\'re real people and we\'re here.')}
    ${sign()}
  `, 'You\'re doing something most people never do. Your family is lucky to have you.');
}

// ── Welcome — grief ───────────────────────────────────────────────────────────

function welcomeGriefHtml(firstName: string) {
  return layout(`
    ${greeting(`Dear ${firstName},`)}
    ${body('We are so sorry. Losing someone you love changes everything — the air feels different, the days feel longer, and the list of things you\'re supposed to do feels impossibly heavy.')}
    ${body('We built Mourning Guide because we\'ve been there. And we wanted to make sure that when the time came, you wouldn\'t have to figure it all out alone.')}
    ${pullQuote('Your guide is ready. It won\'t make grief smaller — nothing does — but it will help you hold it. One step at a time, at whatever pace feels right.')}
    ${body('There\'s nothing you have to do right now. When you\'re ready, your dashboard is waiting.')}
    ${cta('https://mourninguide.com/dashboard', 'Go to your dashboard →')}
    ${divider()}
    ${body('And if you just need to talk, or have a question, or don\'t know where to start — reply to this email. We\'re here.')}
    ${sign()}
  `, 'You don\'t have to do this alone.');
}

// ── Legacy contact invitation ─────────────────────────────────────────────────

function legacyInvitationHtml(contactName: string, ownerName: string) {
  return layout(`
    ${greeting(`Dear ${contactName},`)}
    ${body(`${ownerName} has done something quietly extraordinary — they\'ve sat down and organized everything their family will need, so that when the time comes, the people they love won\'t have to carry that weight alone.`)}
    ${body(`And they\'ve chosen you to be the one who carries it forward.`)}
    ${pullQuote(`Being named a legacy contact is an act of deep trust. It means ${ownerName} believes you are the person who will handle things with care, with love, and with the kind of calm that families need most in hard moments.`)}
    ${body('When the time comes, you\'ll be the one to activate their guide — releasing their letters to the people they addressed them to, sharing their wishes with the family, and making sure nothing important gets lost.')}
    ${body('You don\'t need to do anything right now. This email is simply so you know — so that when that moment arrives, it isn\'t a surprise, and you feel prepared.')}
    ${divider()}
    ${body(`If you have any questions at all, please reply to this email or write to us at <a href="mailto:support@mourninguide.com" style="color:#c57b57;text-decoration:none;">support@mourninguide.com</a>. We\'re honored to support you both.`)}
    ${sign()}
  `, `${ownerName} chose you because they trust you completely.`);
}

// ── Activation notification ───────────────────────────────────────────────────

function activationNotificationHtml(contactName: string, deceasedName: string, activatedBy: string) {
  return layout(`
    ${greeting(`Dear ${contactName},`)}
    ${body(`We\'re reaching out because ${activatedBy} has activated ${deceasedName}\'s Mourning Guide.`)}
    ${body(`${deceasedName} had listed you as someone to notify when this moment came. They were thinking of you — which is why your name is here.`)}
    ${pullQuote('The family is coming together now. There is no right way to grieve, and there is no right thing to say. Your presence is enough.')}
    ${body('If you\'d like to reach out to the family, please do so directly. They will be grateful to hear from you.')}
    ${divider()}
    ${body(`If you have questions or need anything at all, we\'re at <a href="mailto:support@mourninguide.com" style="color:#c57b57;text-decoration:none;">support@mourninguide.com</a>.`)}
    ${sign()}
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
      ? `Your guide is ready, ${firstName}`
      : 'We\'re here with you',
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
    subject: `${ownerName} has chosen you as their legacy contact`,
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
