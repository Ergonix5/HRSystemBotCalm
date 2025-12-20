export const welcomeTemplate = (name: string, email: string, password: string) => ({
  to: email,
  subject: "Welcome! Your Account Credentials",
  html: `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        line-height: 1.6;
        color: #000000;
        background: #f5f5f5;
        padding: 0;
        margin: 0;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        padding: 0;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid #e5e5e5;
      }
      .logo {
        padding: 20px;
        text-align: left;
      }
      .header {
        background-color: #ffffff;
        color: #000000;
        padding: 24px;
        text-align: center;
        border-bottom: 3px solid #000000;
        font-size: 22px;
        font-weight: bold;
      }
      .content {
        background-color: #ffffff;
        padding: 30px;
        color: #000000;
      }
      .credentials {
        background-color: #f0f0f0;
        padding: 16px;
        border-left: 4px solid #000000;
        margin: 20px 0;
        border-radius: 6px;
      }
      .password {
        font-size: 18px;
        font-weight: bold;
        color: #000000;
      }
      .warning {
        color: #dc2626;
        font-weight: bold;
        margin-top: 15px;
      }
      .footer {
        text-align: center;
        padding: 20px;
        color: #666;
        font-size: 12px;
      }
      a {
        color: #2563eb;
        text-decoration: none;
      }
      strong {
        color: #000000;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img 
          src="https://res.cloudinary.com/dvjvsbkoy/image/upload/v1764223936/solid-logo_yxnnie.png"
          alt="logo"
          height="40"
          style="height: 40px;"
        >
      </div>
      <div class="header">
        Welcome!
      </div>
      <div class="content">
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your account has been successfully created. Below are your login credentials:</p>
        <div class="credentials">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> <span class="password">${password}</span></p>
        </div>
        <p class="warning">⚠️ IMPORTANT: Please change your password after your first login for security purposes.</p>
        <p>You can log in to your account using the credentials above.</p>
        <p>If you didn't create this account, you can safely ignore this email.</p>
        <p>Best regards,<br>
        The Team</p>
      </div>
      <div class="footer">
        This is an automated email. Please do not reply.
      </div>
    </div>
  </body>
</html>
`
});
