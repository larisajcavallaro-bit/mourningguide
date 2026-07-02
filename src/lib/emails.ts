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

// ── Account collaborator invitation ───────────────────────────────────────────

function collaboratorInvitationHtml(
  inviteeName: string,
  subjectName: string,
  inviterName: string,
  acceptUrl: string,
) {
  const first = subjectName.split(' ')[0];
  return layout(`
    ${greeting(`Dear ${inviteeName},`)}
    ${body(`<strong style="color:#2f241f;">${inviterName}</strong> has invited you to help manage <strong style="color:#2f241f;">${subjectName}</strong>'s Mourning Guide plan — the private vault where the family is organizing accounts, wishes, and letters for when they're needed.`)}
    ${pullQuote(`You'll be able to help build and update ${first}'s plan. You won't see anyone else's personal plans — only this shared family plan.`)}
    ${body(`Accept the invitation with the email address this was sent to. Once you're in, use the <strong>Viewing</strong> menu at the top of the app to switch to ${first}'s plan anytime.`)}
    ${cta(acceptUrl, `Accept invitation →`)}
    ${divider()}
    ${body(`If you weren't expecting this, you can ignore this email. If you have questions, reply here — we're happy to help.`)}
    ${sign()}
  `, `Help ${first}'s family get organized — together.`);
}

// ── Legacy contact invitation ─────────────────────────────────────────────────

function legacyInvitationHtml(contactName: string, ownerName: string) {
  return layout(`
    ${greeting(`Dear ${contactName},`)}
    ${body(`You're receiving this email because <strong style="color:#2f241f;">${ownerName}</strong> has named you as their legacy contact — and we wanted to make sure you understood exactly what that means, and why it matters so much.`)}
    ${body(`First, a little about us. Mourning Guide is a private vault where people organize everything their family will need when they\'re gone — their financial accounts, their final wishes, personal letters written to the people they love, and instructions for who to contact and when. Think of it as the most thoughtful gift a person can leave behind.`)}
    ${pullQuote(`${ownerName} is building that gift right now. And they\'ve chosen you to be the one who opens it for the family when the time comes.`)}
    ${body(`As their legacy contact, you\'ll be the person who activates their guide. When that day arrives, you\'ll have access to everything they\'ve prepared:`)}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
      style="width:100%;margin:8px 0 28px;border-radius:14px;overflow:hidden;border:1px solid #e8dfd6;">
      <tr style="background:#faf6f2;">
        <td style="padding:16px 18px;border-bottom:1px solid #e8dfd6;">
          <div style="font-size:0.88rem;font-weight:600;color:#2f241f;margin-bottom:4px;">📬 &nbsp;Personal letters</div>
          <div style="font-size:0.84rem;color:#6b5c55;line-height:1.7;">Messages written directly to the people they love — released the moment you activate the guide. Words they may never have said out loud.</div>
        </td>
      </tr>
      <tr style="background:#fffdf9;">
        <td style="padding:16px 18px;border-bottom:1px solid #e8dfd6;">
          <div style="font-size:0.88rem;font-weight:600;color:#2f241f;margin-bottom:4px;">🕊️ &nbsp;Final wishes</div>
          <div style="font-size:0.84rem;color:#6b5c55;line-height:1.7;">Service preferences, music, readings, who to call — everything the family needs to honor them, exactly as they wanted.</div>
        </td>
      </tr>
      <tr style="background:#faf6f2;">
        <td style="padding:16px 18px;border-bottom:1px solid #e8dfd6;">
          <div style="font-size:0.88rem;font-weight:600;color:#2f241f;margin-bottom:4px;">🏦 &nbsp;Financial accounts</div>
          <div style="font-size:0.84rem;color:#6b5c55;line-height:1.7;">Bank accounts, insurance policies, investments — organized and labeled so the family knows exactly what exists, where it is, and who to call.</div>
        </td>
      </tr>
      <tr style="background:#fffdf9;">
        <td style="padding:16px 18px;">
          <div style="font-size:0.88rem;font-weight:600;color:#2f241f;margin-bottom:4px;">👥 &nbsp;Who to notify</div>
          <div style="font-size:0.84rem;color:#6b5c55;line-height:1.7;">A list of family, friends, and contacts — organized by who should be told first — so no one is forgotten and nothing falls through the cracks.</div>
        </td>
      </tr>
    </table>

    ${body(`Think about what it usually looks like when someone passes away without any of this in place. Family members searching through drawers for account numbers. Nobody knowing which insurance company to call. Siblings disagreeing about what their loved one actually wanted. Important people going unnotified for weeks.`)}
    ${pullQuote(`${ownerName} is making sure none of that happens to you. That\'s what this is.`)}
    ${body(`<strong style="color:#2f241f;">You don\'t need to do anything right now.</strong> You don\'t need to create an account or log in. When the time comes, we\'ll send you a private link to activate the guide — and we\'ll walk you through everything step by step. This email is simply so you know, so that day isn\'t a surprise.`)}
    ${divider()}
    ${body(`If you have questions — about what Mourning Guide is, what your role involves, or anything else — just reply to this email. We\'re real people and we\'re honored to be part of this.`)}
    ${sign()}
  `, `${ownerName} is giving their family an extraordinary gift. You\'re the one who gets to deliver it.`);
}

function legacyInvitationWithLinkHtml(contactName: string, ownerName: string, activationUrl: string) {
  return legacyInvitationHtml(contactName, ownerName).replace(
    `</body>`,
    `<!-- activation link embedded in footer --></body>`
  );
  // Note: activationUrl is included via the CTA block below — this overrides the function
}

function legacyInvitationFullHtml(contactName: string, ownerName: string, activationUrl: string) {
  return layout(`
    ${greeting(`Dear ${contactName},`)}
    ${body(`You're receiving this email because <strong style="color:#2f241f;">${ownerName}</strong> has named you as their legacy contact — and we wanted to make sure you understood exactly what that means, and why it matters so much.`)}
    ${body(`First, a little about us. Mourning Guide is a private vault where people organize everything their family will need when they\'re gone — their financial accounts, their final wishes, personal letters written to the people they love, and instructions for who to contact and when. Think of it as the most thoughtful gift a person can leave behind.`)}
    ${pullQuote(`${ownerName} is building that gift right now. And they\'ve chosen you to be the one who opens it for the family when the time comes.`)}
    ${body(`As their legacy contact, you\'ll be the person who activates their guide. When that day arrives, you\'ll have access to everything they\'ve prepared:`)}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0"
      style="width:100%;margin:8px 0 28px;border-radius:14px;overflow:hidden;border:1px solid #e8dfd6;">
      <tr style="background:#faf6f2;">
        <td style="padding:16px 18px;border-bottom:1px solid #e8dfd6;">
          <div style="font-size:0.88rem;font-weight:600;color:#2f241f;margin-bottom:4px;">📬 &nbsp;Personal letters</div>
          <div style="font-size:0.84rem;color:#6b5c55;line-height:1.7;">Messages written directly to the people they love — released the moment you activate the guide. Words they may never have said out loud.</div>
        </td>
      </tr>
      <tr style="background:#fffdf9;">
        <td style="padding:16px 18px;border-bottom:1px solid #e8dfd6;">
          <div style="font-size:0.88rem;font-weight:600;color:#2f241f;margin-bottom:4px;">🕊️ &nbsp;Final wishes</div>
          <div style="font-size:0.84rem;color:#6b5c55;line-height:1.7;">Service preferences, music, readings, who to call — everything the family needs to honor them, exactly as they wanted.</div>
        </td>
      </tr>
      <tr style="background:#faf6f2;">
        <td style="padding:16px 18px;border-bottom:1px solid #e8dfd6;">
          <div style="font-size:0.88rem;font-weight:600;color:#2f241f;margin-bottom:4px;">🏦 &nbsp;Financial accounts</div>
          <div style="font-size:0.84rem;color:#6b5c55;line-height:1.7;">Bank accounts, insurance policies, investments — organized and labeled so the family knows exactly what exists, where it is, and who to call.</div>
        </td>
      </tr>
      <tr style="background:#fffdf9;">
        <td style="padding:16px 18px;">
          <div style="font-size:0.88rem;font-weight:600;color:#2f241f;margin-bottom:4px;">👥 &nbsp;Who to notify</div>
          <div style="font-size:0.84rem;color:#6b5c55;line-height:1.7;">A list of family, friends, and contacts — organized by who should be told first — so no one is forgotten and nothing falls through the cracks.</div>
        </td>
      </tr>
    </table>

    ${body(`Think about what it usually looks like when someone passes away without any of this in place. Family members searching through drawers for account numbers. Nobody knowing which insurance company to call. Siblings disagreeing about what their loved one actually wanted. Important people going unnotified for weeks.`)}
    ${pullQuote(`${ownerName} is making sure none of that happens to you. That\'s what this is.`)}
    ${body(`<strong style="color:#2f241f;">You don\'t need to do anything right now.</strong> When the time comes, use the button below to activate their guide. We\'ll walk you through everything step by step.`)}
    ${cta(activationUrl, 'Activate the guide when the time comes →')}
    ${divider()}
    ${body(`If you have questions — about what Mourning Guide is, what your role involves, or anything else — just reply to this email. We\'re real people and we\'re honored to be part of this.`)}
    ${sign()}
  `, `${ownerName} is giving their family an extraordinary gift. You\'re the one who gets to deliver it.`);
}

// ── Activation notification ───────────────────────────────────────────────────

function activationNotificationHtml(contactName: string, deceasedName: string, _activatedBy: string) {
  return layout(`
    ${greeting(`Dear ${contactName},`)}
    ${body(`We\'re writing with some very sad news, and we\'re so sorry to be the ones to bring it to you.`)}
    ${body(`<strong style="color:#2f241f;">${deceasedName} has passed away.</strong>`)}
    ${body(`Some time ago, ${deceasedName} took a quiet, loving step to make things a little gentler for the people they cared about. They left instructions asking that, when this day came, you be told — because you mattered to them. That wish is why this message has reached you now.`)}
    ${pullQuote(`You were on their mind. Of all the people in the world, they wanted to be sure you weren\'t left wondering.`)}
    ${body(`There is nothing you need to do. Please take whatever time you need. If and when you feel ready, the family would surely be grateful to hear from you — but there is no expectation, and no right thing to say. Your care alone is enough.`)}
    ${body(`Details about services and arrangements aren\'t settled yet, but we\'ll send them to you by email as soon as the family has shared them.`)}
    ${divider()}
    ${body(`This note was sent through <a href="https://mourninguide.com" style="color:#c57b57;text-decoration:none;">Mourning Guide</a>, a service ${deceasedName} used to prepare things for their loved ones in advance. If you have any questions, or we can help in any way, we\'re gently here at <a href="mailto:support@mourninguide.com" style="color:#c57b57;text-decoration:none;">support@mourninguide.com</a>.`)}
    ${body(`Holding you and everyone who loved ${deceasedName} in our thoughts.`)}
    ${sign()}
  `, `Sent with care, because ${deceasedName} wanted you to know.`);
}

// ── Letter delivery ───────────────────────────────────────────────────────────

function letterDeliveryHtml(recipientName: string, senderName: string, letterBody: string) {
  const escaped = letterBody.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  return layout(`
    ${greeting(`Dear ${recipientName},`)}
    ${body(`Someone who loves you has left you a letter.`)}
    ${body(`<strong style="color:#2f241f;">${senderName}</strong> prepared this for you — words they wanted you to have, written while they were still here, meant to reach you now.`)}
    ${divider()}
    <div style="background:#faf6f2;border-radius:16px;padding:30px 28px;border:1px solid #e0d6cc;margin:4px 0 32px;">
      <p style="margin:0;font-size:1rem;color:#4a3c36;line-height:2.0;font-family:Georgia,serif;">${escaped}</p>
    </div>
    ${divider()}
    ${body(`This letter was entrusted to <a href="https://mourninguide.com" style="color:#c57b57;text-decoration:none;">Mourning Guide</a> — a place where people leave everything they want their family to have when they\'re gone. ${senderName} thought of you. That\'s why you\'re reading this.`)}
    ${sign()}
  `, `Written with love. Delivered with care.`);
}

// ── Funeral home obituary ─────────────────────────────────────────────────────

function funeralHomeObituaryHtml(opts: {
  senderName: string;
  deceasedName: string;
  born: string | null;
  died: string | null;
  city: string | null;
  survived: string | null;
  predeceased: string | null;
  body: string | null;
  legacyContactName?: string | null;
  legacyContactEmail?: string | null;
}) {
  const { senderName, deceasedName, born, died, city, survived, predeceased, body: obitBody } = opts;
  const dateLine = [born, died].filter(Boolean).join(' – ');

  return layout(`
    ${greeting(`To whom it may concern,`)}
    ${body(`The family of <strong style="color:#2f241f;">${deceasedName}</strong> is sharing this obituary through Mourning Guide. It has been prepared by ${senderName} and is ready for your records or for inclusion in a service program.`)}
    ${divider()}
    <div style="background:#faf6f2;border-radius:16px;padding:30px 28px;border:1px solid #e0d6cc;margin:4px 0 28px;">
      <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:1.4rem;color:#2f241f;">${deceasedName}</h2>
      ${dateLine ? `<p style="margin:0 0 16px;font-size:0.88rem;color:#9c8880;">${dateLine}${city ? ' · ' + city : ''}</p>` : ''}
      ${obitBody ? `<p style="margin:0 0 16px;font-size:0.95rem;color:#4a3c36;line-height:1.85;font-family:Georgia,serif;">${obitBody.replace(/\n/g, '<br>')}</p>` : ''}
      ${survived ? `<p style="margin:0 0 8px;font-size:0.88rem;color:#6b5c55;"><strong>Survived by:</strong> ${survived}</p>` : ''}
      ${predeceased ? `<p style="margin:0;font-size:0.88rem;color:#6b5c55;"><strong>Predeceased by:</strong> ${predeceased}</p>` : ''}
    </div>
    ${divider()}
    ${opts.legacyContactName && opts.legacyContactEmail
    ? `${body(`If you have any questions, please reach out to the family directly: <strong style="color:#2f241f;">${opts.legacyContactName}</strong> at <a href="mailto:${opts.legacyContactEmail}" style="color:#c57b57;text-decoration:none;">${opts.legacyContactEmail}</a>. Thank you for the care you are providing at this difficult time.`)}`
    : opts.legacyContactName
      ? `${body(`If you have any questions, please reach out to the family directly through <strong style="color:#2f241f;">${opts.legacyContactName}</strong>. Thank you for the care you are providing at this difficult time.`)}`
      : `${body(`If you have any questions, please reach out to the family directly. Thank you for the care you are providing at this difficult time.`)}`
  }
    ${sign()}
  `, `Shared via Mourning Guide on behalf of the family of ${deceasedName}.`);
}

// ── Trial expiry ──────────────────────────────────────────────────────────────

function trialExpiryHtml(firstName: string) {
  return layout(`
    ${greeting(`Dear ${firstName},`)}
    ${body(`Your 14-day free trial of Mourning Guide has come to an end.`)}
    ${body(`Everything you\'ve built — your vault, your letters, your wishes — is still here, still safe. Nothing has been lost. We just wanted to let you know that your trial period has closed.`)}
    ${pullQuote('If you\'d like to keep your guide active and ensure your family can access everything when the time comes, you can continue with a full account for $89 per year.')}
    ${body(`That\'s less than $8 a month for the peace of mind of knowing it\'s all taken care of.`)}
    ${cta('https://mourninguide.com/settings', 'Continue with Mourning Guide →')}
    ${divider()}
    ${body(`If you have questions, or if something got in the way of completing your guide during the trial, just reply to this email — we\'re here and happy to help.`)}
    ${sign()}
  `, 'Your information is safe. Come back whenever you\'re ready.');
}

// ── Payment failed ────────────────────────────────────────────────────────────

function paymentFailedHtml(firstName: string, updateUrl: string, cancelUrl: string) {
  return layout(`
    ${greeting(`Dear ${firstName},`)}
    ${body(`We weren\'t able to process your Mourning Guide renewal payment. This can happen when a card expires, a billing address changes, or a bank declines the charge — it doesn\'t always mean something is wrong on your end.`)}
    ${body(`Your guide and everything in it is still here, still safe. Nothing has been removed. We just need a moment of your attention to keep things active.`)}
    ${pullQuote('Your letters, your vault, your wishes — they\'re all waiting. Let\'s get your account sorted so they stay that way.')}
    ${cta(updateUrl, 'Update my payment method →')}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:16px 0 8px;">
      <tr>
        <td style="padding:12px 24px;border:1.5px solid #d4c5bc;border-radius:10px;">
          <a href="${cancelUrl}" style="color:#9c8880;font-family:Georgia,serif;font-size:0.88rem;text-decoration:none;">
            Or cancel my subscription
          </a>
        </td>
      </tr>
    </table>
    ${divider()}
    ${body(`If you\'re having trouble updating your payment, or if you\'d like to talk through options, just reply to this email. We\'re here.`)}
    ${sign()}
  `, 'Your information is safe. We\'re here to help.');
}

// ── Upgrade confirmation ──────────────────────────────────────────────────────

function upgradeConfirmationHtml(firstName: string) {
  return layout(`
    ${greeting(`Dear ${firstName},`)}
    ${body(`You\'re all set. Thank you for trusting us with something so important.`)}
    ${body(`Your Mourning Guide is now fully active. Your letters, your vault, your wishes — everything is in place and will be there when your family needs it most.`)}
    ${pullQuote('You\'ve done something most people never get around to. Your family is luckier than they know.')}
    ${body(`If there\'s anything you\'d like to add, update, or ask us — just reply to this email or visit your dashboard. We\'re always here.`)}
    ${cta('https://mourninguide.com/dashboard', 'Go to your guide →')}
    ${sign()}
  `);
}

// ── Activation initiated (cancel window open) ─────────────────────────────────

function activationPendingHtml(contactName: string, deceasedName: string, opts: {
  cancelUrl: string;
  windowHours: number;
  lettersCount: number;
  contactsCount: number;
}) {
  return layout(`
    ${greeting(`Dear ${contactName},`)}
    ${body(`You've begun the activation of ${deceasedName}'s Mourning Guide. Thank you for taking this on — we know it isn't a small thing.`)}
    ${body(`<strong style="color:#2f241f;">This waiting period is only about reaching out to people.</strong> To protect against mistakes, we wait ${opts.windowHours} hours before sending any letters or notifying anyone. Nothing goes out to another soul until then — but you can still see everything ${deceasedName} prepared right away.`)}
    <div style="background:#faf6f2;border-radius:14px;padding:20px 22px;border:1px solid #e8dfd6;margin:8px 0 28px;">
      <p style="margin:0 0 10px;font-weight:600;color:#2f241f;font-size:0.92rem;">Once the ${opts.windowHours} hours pass, we will:</p>
      <ul style="margin:0;padding-left:18px;color:#6b5c55;font-size:0.88rem;line-height:2;">
        <li>Deliver ${opts.lettersCount} personal ${opts.lettersCount === 1 ? 'letter' : 'letters'} to ${opts.lettersCount === 1 ? 'its recipient' : 'their recipients'}</li>
        <li>Notify ${opts.contactsCount} ${opts.contactsCount === 1 ? 'person' : 'people'}, gently and in order</li>
      </ul>
    </div>
    ${body(`<strong style="color:#2f241f;">If you activated this by mistake</strong> — if ${deceasedName} is still with us — please cancel now, and nothing will ever be sent.`)}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
      <tr><td style="padding:12px 24px;border:1.5px solid #d4c5bc;border-radius:10px;">
        <a href="${opts.cancelUrl}" style="color:#9c8880;font-family:Georgia,serif;font-size:0.9rem;text-decoration:none;">
          Cancel this activation
        </a>
      </td></tr>
    </table>
    ${divider()}
    ${body(`If you have any questions, reply to this email — we're here.`)}
    ${sign()}
  `, `We wait ${opts.windowHours} hours before contacting anyone, so nothing is ever sent by accident.`);
}

// ── Activation complete (sent to legacy contact) ──────────────────────────────

function activationCompleteHtml(contactName: string, deceasedName: string, opts: {
  lettersSent: number;
  lettersScheduled: number;
  contactsNotified: number;
  contactsScheduled: number;
  portalUrl: string | null;
}) {
  const scheduledNote = opts.lettersScheduled > 0 || opts.contactsScheduled > 0;
  return layout(`
    ${greeting(`Dear ${contactName},`)}
    ${body(`${deceasedName}'s guide is now active. Everything they prepared has begun to reach the people they loved.`)}
    <div style="background:#faf6f2;border-radius:14px;padding:20px 22px;border:1px solid #e8dfd6;margin:8px 0 24px;">
      ${opts.lettersSent > 0 ? `<p style="margin:0 0 8px;font-size:0.9rem;color:#6b5c55;">✓ ${opts.lettersSent} ${opts.lettersSent === 1 ? 'letter' : 'letters'} delivered</p>` : ''}
      ${opts.contactsNotified > 0 ? `<p style="margin:0 0 8px;font-size:0.9rem;color:#6b5c55;">✓ ${opts.contactsNotified} ${opts.contactsNotified === 1 ? 'person' : 'people'} notified</p>` : ''}
      ${opts.lettersScheduled > 0 ? `<p style="margin:0 0 8px;font-size:0.9rem;color:#9c8880;">⏳ ${opts.lettersScheduled} ${opts.lettersScheduled === 1 ? 'letter is' : 'letters are'} scheduled for later, as ${deceasedName} wished</p>` : ''}
      ${opts.contactsScheduled > 0 ? `<p style="margin:0;font-size:0.9rem;color:#9c8880;">⏳ ${opts.contactsScheduled} more will be notified over the coming hours</p>` : ''}
    </div>
    ${scheduledNote ? body(`Some messages are set to go out over the next hours and days — that pacing was chosen on purpose, so no one is overwhelmed and nothing is rushed.`) : ''}
    ${opts.portalUrl ? cta(opts.portalUrl, 'View the memorial page →') : ''}
    ${divider()}
    ${body(`If anything doesn't look right, or you need help of any kind, just reply. We're holding this with you.`)}
    ${sign()}
  `, `You carried this the way ${deceasedName} hoped you would.`);
}

// ── Renewal reminder ──────────────────────────────────────────────────────────

function renewalReminderHtml(firstName: string, renewalDate: string, manageUrl: string) {
  return layout(`
    ${greeting(`Dear ${firstName},`)}
    ${body(`A quick, friendly note: your Mourning Guide plan will renew on <strong style="color:#2f241f;">${renewalDate}</strong> at $89 for the year.`)}
    ${body(`There's nothing you need to do — we just believe in no surprises, especially where your family's security is concerned. Your guide stays active and everything remains exactly where it should be.`)}
    ${body(`If your card has changed, or you'd like to review your plan, you can do that any time.`)}
    ${cta(manageUrl, 'Manage my plan →')}
    ${divider()}
    ${body(`Questions about anything at all? Just reply — we're here.`)}
    ${sign()}
  `, 'No surprises. Just peace of mind.');
}

// ── Account deletion confirmation ─────────────────────────────────────────────

function deletionRequestHtml(firstName: string) {
  return layout(`
    ${greeting(`Dear ${firstName},`)}
    ${body(`We've received your request to delete your Mourning Guide account and all of its contents.`)}
    ${body(`We'll process this within 48 hours. Once complete, everything — your vault, letters, wishes, and contacts — will be permanently removed and cannot be recovered.`)}
    ${pullQuote('If you didn\'t mean to request this, simply reply to this email and we\'ll stop the process right away. Nothing is deleted until the 48 hours have passed.')}
    ${body(`Whatever brought you here, thank you for having trusted us with something so personal. The door is always open if you'd like to come back.`)}
    ${sign()}
  `, 'You can undo this any time in the next 48 hours — just reply.');
}

// ── Marketing subscribe confirmation ──────────────────────────────────────────

function marketingSubscribeConfirmationHtml(unsubscribeUrl: string) {
  return layout(`
    ${greeting('Hello,')}
    ${body('Thanks for subscribing to Mourning Guide updates. We\'ll send occasional notes about new features, thoughtful guidance, and product improvements — never spam.')}
    ${body('If you ever want to stop receiving these emails, you can unsubscribe instantly using the link below. Important account, billing, and security messages are separate and may still be sent if you have an account with us.')}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0;">
      <tr><td style="padding:12px 24px;border:1.5px solid #d4c5bc;border-radius:10px;">
        <a href="${unsubscribeUrl}" style="color:#9c8880;font-family:Georgia,serif;font-size:0.9rem;text-decoration:none;">
          Unsubscribe from product updates
        </a>
      </td></tr>
    </table>
    ${sign()}
  `, 'You can unsubscribe at any time.');
}

function marketingEmailFooter(unsubscribeUrl: string) {
  return `<p style="margin:0;font-size:0.72rem;color:#b8a89e;line-height:1.8;letter-spacing:0.02em;">
    <a href="https://mourninguide.com" style="color:#b8a89e;text-decoration:none;">mourninguide.com</a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="mailto:support@mourninguide.com" style="color:#b8a89e;text-decoration:none;">support@mourninguide.com</a>
    &nbsp;&nbsp;·&nbsp;&nbsp;
    <a href="${unsubscribeUrl}" style="color:#b8a89e;text-decoration:none;">Unsubscribe</a>
  </p>`;
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

export async function sendCollaboratorInvitation({
  to, inviteeName, subjectName, inviterName, acceptUrl,
}: {
  to: string;
  inviteeName: string;
  subjectName: string;
  inviterName: string;
  acceptUrl: string;
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${inviterName} invited you to help with ${subjectName}'s plan`,
    html: collaboratorInvitationHtml(inviteeName, subjectName, inviterName, acceptUrl),
  });
}

export async function sendLegacyContactInvitation({
  to, contactName, ownerName, activationUrl,
}: { to: string; contactName: string; ownerName: string; activationUrl?: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${ownerName} has chosen you as their legacy contact`,
    html: activationUrl
      ? legacyInvitationFullHtml(contactName, ownerName, activationUrl)
      : legacyInvitationHtml(contactName, ownerName),
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

export async function sendLetterDelivery({
  to, recipientName, senderName, letterBody,
}: { to: string; recipientName: string; senderName: string; letterBody: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `A letter for you from ${senderName}`,
    html: letterDeliveryHtml(recipientName, senderName, letterBody),
  });
}

export async function sendFuneralHomeObituary({
  to, senderName, deceasedName, born, died, city, survived, predeceased, body,
  legacyContactName, legacyContactEmail,
}: {
  to: string; senderName: string; deceasedName: string;
  born: string | null; died: string | null; city: string | null;
  survived: string | null; predeceased: string | null; body: string | null;
  legacyContactName?: string | null; legacyContactEmail?: string | null;
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `Obituary: ${deceasedName} — shared by the family`,
    html: funeralHomeObituaryHtml({ senderName, deceasedName, born, died, city, survived, predeceased, body, legacyContactName, legacyContactEmail }),
  });
}

export async function sendTrialExpiryEmail({
  to, firstName,
}: { to: string; firstName: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Your Mourning Guide trial has ended',
    html: trialExpiryHtml(firstName),
  });
}

export async function sendUpgradeConfirmation({
  to, firstName,
}: { to: string; firstName: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to Mourning Guide — your plan is active',
    html: upgradeConfirmationHtml(firstName),
  });
}

export async function sendPaymentFailedEmail({
  to, firstName, updateUrl, cancelUrl,
}: { to: string; firstName: string; updateUrl: string; cancelUrl: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Action needed — your Mourning Guide renewal payment failed',
    html: paymentFailedHtml(firstName, updateUrl, cancelUrl),
  });
}

export async function sendActivationPending({
  to, contactName, deceasedName, cancelUrl, windowHours, lettersCount, contactsCount,
}: {
  to: string; contactName: string; deceasedName: string; cancelUrl: string;
  windowHours: number; lettersCount: number; contactsCount: number;
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `You've started activating ${deceasedName}'s guide`,
    html: activationPendingHtml(contactName, deceasedName, { cancelUrl, windowHours, lettersCount, contactsCount }),
  });
}

export async function sendActivationComplete({
  to, contactName, deceasedName, lettersSent, lettersScheduled, contactsNotified, contactsScheduled, portalUrl,
}: {
  to: string; contactName: string; deceasedName: string;
  lettersSent: number; lettersScheduled: number; contactsNotified: number; contactsScheduled: number;
  portalUrl: string | null;
}) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: `${deceasedName}'s guide is now active`,
    html: activationCompleteHtml(contactName, deceasedName, { lettersSent, lettersScheduled, contactsNotified, contactsScheduled, portalUrl }),
  });
}

export async function sendRenewalReminder({
  to, firstName, renewalDate, manageUrl,
}: { to: string; firstName: string; renewalDate: string; manageUrl: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'Your Mourning Guide renews soon',
    html: renewalReminderHtml(firstName, renewalDate, manageUrl),
  });
}

export async function sendDeletionRequest({
  to, firstName,
}: { to: string; firstName: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'We received your account deletion request',
    html: deletionRequestHtml(firstName),
  });
}

export async function sendMarketingSubscribeConfirmation({
  to, unsubscribeUrl: unsubUrl,
}: { to: string; unsubscribeUrl: string }) {
  return resend.emails.send({
    from: FROM,
    to,
    subject: 'You\'re subscribed to Mourning Guide updates',
    html: marketingSubscribeConfirmationHtml(unsubUrl),
  });
}

/** Footer snippet for future broadcast/marketing campaigns. */
export { marketingEmailFooter };
