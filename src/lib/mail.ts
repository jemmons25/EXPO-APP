// Magic-link delivery. If SMTP is configured, send a real email;
// otherwise log the link to the server console (dev mode).

export async function sendMagicLink(email: string, url: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (!SMTP_HOST) {
    console.log(`\n[CardDrop] Magic link for ${email}:\n${url}\n`);
    return { delivered: false as const, devUrl: url };
  }

  // Lazy import so nodemailer stays optional.
  const nodemailer = await import("nodemailer").catch(() => null);
  if (!nodemailer) {
    console.log(`\n[CardDrop] nodemailer not installed. Magic link for ${email}:\n${url}\n`);
    return { delivered: false as const, devUrl: url };
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });

  await transport.sendMail({
    from: SMTP_FROM ?? "CardDrop <no-reply@carddrop.app>",
    to: email,
    subject: "Your CardDrop sign-in link",
    text: `Click to sign in to CardDrop:\n\n${url}\n\nThis link expires in 15 minutes.`,
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px 16px">
        <h2 style="margin:0 0 16px">Sign in to CardDrop</h2>
        <p style="color:#555">Click the button below to sign in. This link expires in 15 minutes.</p>
        <a href="${url}" style="display:inline-block;background:#6366f1;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600">Sign in</a>
        <p style="color:#999;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
      </div>`,
  });

  return { delivered: true as const };
}
