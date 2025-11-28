export class EmailTemplates {
  
  // API Key Reveal Email Template

static apiKeyRevealTemplate(code: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LocalMind – API Key Verification</title>
      </head>
      <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:linear-gradient(135deg,#111827,#4b5563);">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 12px 35px rgba(0,0,0,0.25); border:1px solid #e5e7eb;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#111827; padding:24px 32px; text-align:left;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="left">
                          <div style="display:inline-block; padding:6px 12px; border-radius:999px; border:1px solid #4b5563; color:#e5e7eb; font-size:11px; letter-spacing:1px; text-transform:uppercase;">
                            LocalMind Security
                          </div>
                          <div style="margin-top:10px; font-size:22px; font-weight:bold; letter-spacing:0.5px; color:#f9fafb;">
                            API Key Verification Code
                          </div>
                          <div style="margin-top:4px; font-size:13px; color:#9ca3af;">
                            A secure step to keep your workspace protected.
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Accent Bar (now blue) -->
                    <div style="margin-top:18px; width:100%; height:4px; border-radius:999px; background:linear-gradient(90deg,#3b82f6,#6366f1,#0ea5e9);"></div>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:32px 32px 28px; background-color:#f9fafb;">
                    <p style="color:#4b5563; font-size:14px; line-height:1.7; margin:0 0 18px;">
                      You requested to reveal your API key in LocalMind. Enter the verification code below in the app to continue.
                    </p>

                    <!-- Code Box -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding:16px 0 8px;">
                          <div style="
                            background:radial-gradient(circle at top, #111827 0%, #020617 55%, #000000 100%);
                            padding:22px 28px;
                            border-radius:14px;
                            display:inline-block;
                            border:1px solid rgba(148,163,184,0.35);
                          ">
                            <div style="font-size:11px; color:#9ca3af; letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; text-align:center;">
                              Your one-time code
                            </div>
                            <span style="font-size:32px; font-weight:bold; letter-spacing:10px; color:#f9fafb; font-family:'Courier New', monospace; text-align:center; display:inline-block;">
                              ${code}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>

                    <!-- Status / Info -->
                    <p style="color:#6b7280; font-size:13px; line-height:1.6; margin:18px 0 6px;">
                      <strong>Expires in 5 minutes.</strong> For your security, this code can only be used once.
                    </p>

                    <p style="color:#9ca3af; font-size:12px; line-height:1.6; margin:6px 0 0;">
                      If this wasn’t you, you can safely ignore this email. We recommend reviewing your password and API keys in your LocalMind account settings.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f3f4f6; padding:16px 32px; text-align:center; border-top:1px solid #e5e7eb;">
                    <p style="color:#9ca3af; font-size:11px; margin:0 0 4px;">
                      Do not share this code with anyone. LocalMind support will never ask for it.
                    </p>
                    <p style="color:#9ca3af; font-size:11px; margin:0;">
                      © ${new Date().getFullYear()} LocalMind. All rights reserved.
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
}


  static passwordResetTemplate(code: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: #EF4444; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset Request</h1>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                      You requested to reset your password. Use the verification code below:
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px 0;">
                          <div style="background-color: #FEF2F2; padding: 20px; border-radius: 8px; display: inline-block;">
                            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #EF4444; font-family: 'Courier New', monospace;">
                              ${code}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                      <strong>This code will expire in 5 minutes.</strong>
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="background-color: #F9FAFB; padding: 20px 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} LocalMind. All rights reserved.
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
  }
}

