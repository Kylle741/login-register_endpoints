const verificationEmailTemplate = (username, verificationUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background-color:#ffffff;border-radius:12px;overflow:hidden;
                 box-shadow:0 4px 24px rgba(0,0,0,0.08);max-width:600px;width:100%;">
          <tr>
            <td align="center"
              style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%);
                     padding:40px 40px 32px;">
              <div style="width:56px;height:56px;background:#e94560;border-radius:14px;
                          display:inline-flex;align-items:center;justify-content:center;
                          font-size:28px;line-height:56px;text-align:center;color:#fff;
                          font-weight:700;margin-bottom:16px;">
                A
              </div>
              <br/>
              <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                AuthApp
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:44px 48px 32px;">
              <h1 style="margin:0 0 8px;font-size:26px;font-weight:700;color:#1a1a2e;">
                Verify your email address
              </h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                Hi <strong style="color:#1a1a2e;">${username}</strong>, welcome aboard!<br/>
                Please confirm your email address to activate your account.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center" style="background:#e94560;border-radius:8px;">
                    <a href="${verificationUrl}"
                      style="display:inline-block;padding:14px 36px;font-size:15px;
                             font-weight:600;color:#ffffff;text-decoration:none;">
                      ✓ &nbsp; Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 24px;font-size:13px;color:#9ca3af;line-height:1.6;">
                ⏱ This link expires in <strong style="color:#6b7280;">24 hours</strong>.
                If you did not create an account, ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px;"/>
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                If the button doesn't work, copy and paste this URL:
              </p>
              <p style="margin:6px 0 0;word-break:break-all;">
                <a href="${verificationUrl}" style="font-size:13px;color:#e94560;text-decoration:none;">
                  ${verificationUrl}
                </a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:24px 48px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                © ${new Date().getFullYear()} AuthApp. All rights reserved.<br/>
                This is an automated message — please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = { verificationEmailTemplate };