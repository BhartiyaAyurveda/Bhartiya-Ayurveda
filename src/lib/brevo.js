const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export async function sendBrevoEmail({ to, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME;

  if (!apiKey || !senderEmail || !senderName) {
    throw new Error("Brevo env vars missing (BREVO_API_KEY / BREVO_SENDER_EMAIL / BREVO_SENDER_NAME)");
  }

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Brevo send failed (${res.status}): ${errBody}`);
  }
}

function otpEmailTemplate(otp) {
  const logoUrl = "https://ik.imagekit.io/e91rdkhkb/tr:w-200,h-200,f-png/logo.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light only">
  <title>One-Time Password (OTP)</title>
  <style>
    html, body { margin: 0 auto !important; padding: 0 !important; background-color: #ffffff !important; }
    * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="width:100%;background-color:#ffffff;padding:24px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:500px;width:100%;background-color:#ffffff;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#0E3320" style="background-color:#0E3320;padding:20px;border-bottom:3px solid #C59B3F;">
              <img src="${logoUrl}" alt="Logo" width="100" height="100" style="display:block;width:100px;height:100px;border:0;margin:0 auto 12px auto;" />
              <div style="font-size:13px;font-weight:900;letter-spacing:0.5px;color:#ffffff;text-transform:uppercase;line-height:1.2;">
                BHARTIYA AYURVEDA YOGA EVAM PRAKRITIK CHIKITSA PARISHAD
              </div>
              <div style="margin-top:4px;font-size:12px;font-weight:600;color:#E4BF64;line-height:1.2;font-family:'Noto Sans Devanagari',sans-serif;">
                भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
              </div>
            </td>
          </tr>

          <!-- OTP Body -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 24px;">
              <p style="margin:0 0 14px 0;font-size:15px;color:#1E293B;font-weight:600;text-align:center;">
                Your One-Time Password (OTP) is:
              </p>
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" style="margin:0 auto 16px auto;">
                <tr>
                  <td align="center" bgcolor="#F0FDF4" style="background-color:#F0FDF4;border:2px dashed #0E3320;border-radius:12px;padding:14px 28px;">
                    <span style="font-family:'Courier New',Courier,monospace;font-size:36px;font-weight:800;letter-spacing:6px;color:#0E3320;display:block;line-height:1;">
                      ${otp}
                    </span>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 20px 0;font-size:13px;color:#334155;line-height:1.5;text-align:center;">
                This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
              </p>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:16px 0;">
                <tr><td style="border-top:1px solid #E2E8F0;height:1px;"></td></tr>
              </table>
              <p style="margin:0 0 6px 0;font-size:13.5px;color:#475569;line-height:1.5;text-align:center;font-family:'Noto Sans Devanagari',sans-serif;">
                आपका वन-टाइम पासवर्ड (OTP) है: <strong style="color:#0E3320;font-size:16px;letter-spacing:1px;">${otp}</strong>
              </p>
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;text-align:center;font-family:'Noto Sans Devanagari',sans-serif;">
                यह OTP <strong>10 मिनट</strong> के लिए मान्य है। कृपया इसे किसी के साथ साझा न करें।
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#F8FAFC" style="background-color:#F8FAFC;padding:14px 20px;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:11px;color:#64748b;line-height:1.4;text-align:center;">
                This is an automated official security message from <strong>Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad</strong>. If you did not request this OTP, please ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function passwordResetEmailTemplate(resetUrl) {
  const logoUrl = "https://ik.imagekit.io/e91rdkhkb/tr:w-200,h-200,f-png/logo.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%;background-color:#ffffff;padding:24px 8px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:500px;width:100%;background-color:#ffffff;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="#0E3320" style="background-color:#0E3320;padding:20px;border-bottom:3px solid #C59B3F;">
              <img src="${logoUrl}" alt="Logo" width="100" height="100" style="display:block;width:100px;height:100px;border:0;margin:0 auto 12px auto;" />
              <div style="font-size:13px;font-weight:900;color:#ffffff;text-transform:uppercase;letter-spacing:0.5px;">BHARTIYA AYURVEDA YOGA EVAM PRAKRITIK CHIKITSA PARISHAD</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td align="center" bgcolor="#ffffff" style="background-color:#ffffff;padding:32px 24px;">
              <p style="margin:0 0 12px 0;font-size:16px;font-weight:700;color:#0E3320;text-align:center;">Password Reset Request</p>
              <p style="margin:0 0 24px 0;font-size:14px;color:#475569;text-align:center;line-height:1.6;">
                We received a request to reset your admin account password. Click the button below to set a new password. This link is valid for <strong>30 minutes</strong>.
              </p>
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td align="center" bgcolor="#0E3320" style="background-color:#0E3320;border-radius:10px;padding:14px 32px;">
                    <a href="${resetUrl}" style="font-size:14px;font-weight:700;color:#E4BF64;text-decoration:none;display:block;letter-spacing:0.5px;">Reset My Password</a>
                  </td>
                </tr>
              </table>
              <p style="margin:20px 0 0 0;font-size:12px;color:#94a3b8;text-align:center;">
                If the button doesn't work, copy and paste this URL into your browser:<br/>
                <a href="${resetUrl}" style="color:#0E3320;word-break:break-all;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#F8FAFC" style="background-color:#F8FAFC;padding:14px 20px;border-top:1px solid #E2E8F0;">
              <p style="margin:0;font-size:11px;color:#64748b;text-align:center;">
                If you did not request a password reset, please ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOtpEmail(to, otp, purpose) {
  const subject =
    purpose === "admin_login"
      ? "Admin Login OTP — Bhartiya Ayurveda Parishad"
      : "Email Verification OTP — Bhartiya Ayurveda Parishad";

  await sendBrevoEmail({ to, subject, htmlContent: otpEmailTemplate(otp) });
}

export async function sendPasswordResetEmail(to, resetUrl) {
  await sendBrevoEmail({
    to,
    subject: "Admin Password Reset — Bhartiya Ayurveda Parishad",
    htmlContent: passwordResetEmailTemplate(resetUrl),
  });
}
