type VerificationEmailInput = {
  email: string;
  username: string;
  verificationUrl: string;
};

type EmailSendResult = {
  provider: "resend" | "fallback";
  from: string;
  to: string;
  messageId?: string;
};

export async function sendVerificationEmail({
  email,
  username,
  verificationUrl,
}: VerificationEmailInput): Promise<EmailSendResult> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim() || "";
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    "";
  const subject = "Verify your email for Yotei Profile";
  const text = [
    `Hi ${username},`,
    "",
    "Verify your email to unlock all Yotei features.",
    verificationUrl,
    "",
    "If you did not create this account, you can ignore this email.",
  ].join("\n");

  const html = `
    <div style="background:#07080d;padding:32px;font-family:Inter,Arial,Helvetica,sans-serif;color:#f8faff;">
      <div style="max-width:560px;margin:0 auto;border-radius:24px;padding:28px;border:1px solid rgba(255,255,255,0.08);background:linear-gradient(180deg,#151523 0%,#090a10 100%);">
        <div style="display:inline-block;padding:8px 12px;border-radius:999px;border:1px solid rgba(255,110,168,0.22);background:rgba(255,110,168,0.08);color:#ffd9ea;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;">
          Yotei Identity
        </div>
        <h1 style="margin:20px 0 10px;font-size:32px;line-height:1;letter-spacing:-0.06em;color:#ffffff;">
          Verify your email
        </h1>
        <p style="margin:0 0 18px;color:#b8c4dc;font-size:15px;line-height:1.7;">
          Hi ${escapeHtml(username)}, verify your email to unlock all Yotei features and keep your account secure.
        </p>
        <a href="${verificationUrl}" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 18px;border-radius:16px;text-decoration:none;background:linear-gradient(135deg,#8776ff 0%,#ff6ea8 100%);color:#ffffff;font-weight:800;">
          Verify email
        </a>
        <p style="margin:18px 0 0;color:#8f9ab3;font-size:13px;line-height:1.7;word-break:break-word;">
          If the button does not work, open this link:<br />
          <span>${escapeHtml(verificationUrl)}</span>
        </p>
      </div>
    </div>
  `;

  if (!resendApiKey) {
    const message = `[Yotei email verification fallback] RESEND_API_KEY missing. ${email} -> ${verificationUrl}`;

    if (process.env.NODE_ENV !== "production") {
      console.warn(message);
      return {
        provider: "fallback",
        from: fromEmail || "not-configured",
        to: email,
      };
    }

    throw new Error(
      "RESEND_API_KEY is not configured in production. Verification email was not sent."
    );
  }

  if (!fromEmail) {
    throw new Error(
      "EMAIL_FROM or RESEND_FROM_EMAIL is not configured. Verification email was not sent."
    );
  }

  console.info("[Yotei email] Sending verification email...", {
    provider: "resend",
    to: email,
    from: fromEmail,
    verificationUrlPreview: redactVerificationUrl(verificationUrl),
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject,
      text,
      html,
    }),
  });

  const rawBody = await response.text();
  const parsedBody = tryParseJson(rawBody);

  if (!response.ok) {
    console.error("[Yotei email] Resend send failed.", {
      status: response.status,
      body: parsedBody ?? rawBody,
      to: email,
      from: fromEmail,
    });

    throw new Error(
      `Resend verification email failed (${response.status}): ${extractProviderErrorMessage(
        parsedBody,
        rawBody
      )}`
    );
  }

  const messageId = getResendMessageId(parsedBody);

  console.info("[Yotei email] Verification email sent.", {
    provider: "resend",
    to: email,
    from: fromEmail,
    messageId: messageId || "unknown",
  });

  return {
    provider: "resend",
    from: fromEmail,
    to: email,
    messageId: messageId || undefined,
  };
}

function getResendMessageId(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const id = (value as Record<string, unknown>).id;
  return typeof id === "string" && id.trim() ? id.trim() : null;
}

function extractProviderErrorMessage(parsedBody: unknown, rawBody: string) {
  if (parsedBody && typeof parsedBody === "object" && !Array.isArray(parsedBody)) {
    const record = parsedBody as Record<string, unknown>;
    const message =
      record.message || record.error || record.name || record.statusCode || null;

    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  return rawBody || "Unknown provider error";
}

function tryParseJson(value: string) {
  if (!value.trim()) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function redactVerificationUrl(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}?token=[redacted]`;
  } catch {
    return "[invalid verification URL]";
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
