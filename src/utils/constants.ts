export const template = (role = 'UI/UX Designer', name: string = 'Frank') => {
  return `
  <html>
  <head>
    <style>
      .email-container {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .header,
      .footer {
        background-color: #f8f8f8;
        padding: 20px;
        text-align: center;
		width: 100%;
		
      }
      .content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .logo {
        max-width: 200px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <img
          src="https://drive.google.com/file/d/189ahKv5vTNmKyKFvASDBkai2FqwgHWfK/view?usp=sharing"
          title="logo"
          width=900
          height=200
          alt="Blackhards Logo"
          class="logo"
        />
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>
          Thank you for applying for the ${role} internship at Blackhard Games.
          We have received your application and will contact you if you are
          selected.
        </p>
        <p>Best regards,<br />Joy Chukwuma<br />HR Manager</p>
      </div>
      <div class="footer">
        <a href="https://www.blackhards.com">Visit our website</a>
      </div>
    </div>
  </body>
</html>
    `;
};
