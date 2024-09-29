// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { template } from 'src/utils/constants';

const confirmationHtml = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #ffffff;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            padding: 20px;
            box-sizing: border-box;
        }
        .header {
            background-color: #28a745;
            color: #ffffff;
            padding: 10px;
            text-align: center;
        }
        .content {
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
            margin-top: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777777;
        }
        .quote {
            font-style: italic;
            color: #28a745;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to the Blackhards Family!</h1>
        </div>
        <div class="content">
            <p>Dear Adventurer,</p>
            <p>Thank you for joining the Blackhards family. We appreciate your interest and will notify you when we go live.</p>
            <p class="quote">"All Big Adventures started from small changes and little steps"</p>
            <p>Best regards,<br>The Blackhards Family</p>
        </div>
        <div class="footer">
        <div> 
            <svg width="178" height="43" viewBox="0 0 178 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M55.6103 29V13.6H61.7923C63.3909 13.6 64.6083 13.974 65.4443 14.722C66.2949 15.4553 66.7203 16.4013 66.7203 17.56C66.7203 18.528 66.4563 19.3053 65.9283 19.892C65.4149 20.464 64.7843 20.8527 64.0363 21.058C64.9163 21.234 65.6423 21.674 66.2143 22.378C66.7863 23.0673 67.0723 23.874 67.0723 24.798C67.0723 26.0153 66.6323 27.02 65.7523 27.812C64.8723 28.604 63.6256 29 62.0123 29H55.6103ZM58.4263 20.068H61.3743C62.1663 20.068 62.7749 19.8847 63.2003 19.518C63.6256 19.1513 63.8383 18.6307 63.8383 17.956C63.8383 17.3107 63.6256 16.8047 63.2003 16.438C62.7896 16.0567 62.1663 15.866 61.3303 15.866H58.4263V20.068ZM58.4263 26.712H61.5723C62.4083 26.712 63.0536 26.5213 63.5083 26.14C63.9776 25.744 64.2123 25.194 64.2123 24.49C64.2123 23.7713 63.9703 23.2067 63.4863 22.796C63.0023 22.3853 62.3496 22.18 61.5283 22.18H58.4263V26.712ZM69.4232 29V13.16H72.2392V29H69.4232ZM78.8785 29.264C77.9399 29.264 77.1699 29.1173 76.5685 28.824C75.9672 28.516 75.5199 28.1127 75.2265 27.614C74.9332 27.1153 74.7865 26.5653 74.7865 25.964C74.7865 24.952 75.1825 24.1307 75.9745 23.5C76.7665 22.8693 77.9545 22.554 79.5385 22.554H82.3105V22.29C82.3105 21.542 82.0979 20.992 81.6725 20.64C81.2472 20.288 80.7192 20.112 80.0885 20.112C79.5165 20.112 79.0179 20.2513 78.5925 20.53C78.1672 20.794 77.9032 21.19 77.8005 21.718H75.0505C75.1239 20.926 75.3879 20.2367 75.8425 19.65C76.3119 19.0633 76.9132 18.616 77.6465 18.308C78.3799 17.9853 79.2012 17.824 80.1105 17.824C81.6652 17.824 82.8899 18.2127 83.7845 18.99C84.6792 19.7673 85.1265 20.8673 85.1265 22.29V29H82.7285L82.4645 27.24C82.1419 27.8267 81.6872 28.3107 81.1005 28.692C80.5285 29.0733 79.7879 29.264 78.8785 29.264ZM79.5165 27.064C80.3232 27.064 80.9465 26.8 81.3865 26.272C81.8412 25.744 82.1272 25.0913 82.2445 24.314H79.8465C79.0985 24.314 78.5632 24.4533 78.2405 24.732C77.9179 24.996 77.7565 25.326 77.7565 25.722C77.7565 26.1473 77.9179 26.4773 78.2405 26.712C78.5632 26.9467 78.9885 27.064 79.5165 27.064ZM93.1598 29.264C92.0451 29.264 91.0625 29.022 90.2118 28.538C89.3611 28.054 88.6865 27.3793 88.1878 26.514C87.7038 25.6487 87.4618 24.6587 87.4618 23.544C87.4618 22.4293 87.7038 21.4393 88.1878 20.574C88.6865 19.7087 89.3611 19.034 90.2118 18.55C91.0625 18.066 92.0451 17.824 93.1598 17.824C94.5531 17.824 95.7265 18.1907 96.6798 18.924C97.6331 19.6427 98.2418 20.64 98.5058 21.916H95.5358C95.3891 21.388 95.0958 20.9773 94.6558 20.684C94.2305 20.376 93.7245 20.222 93.1378 20.222C92.3605 20.222 91.7005 20.5153 91.1578 21.102C90.6151 21.6887 90.3438 22.5027 90.3438 23.544C90.3438 24.5853 90.6151 25.3993 91.1578 25.986C91.7005 26.5727 92.3605 26.866 93.1378 26.866C93.7245 26.866 94.2305 26.7193 94.6558 26.426C95.0958 26.1327 95.3891 25.7147 95.5358 25.172H98.5058C98.2418 26.404 97.6331 27.394 96.6798 28.142C95.7265 28.89 94.5531 29.264 93.1598 29.264ZM101.005 29V13.16H103.821V22.51L107.693 18.088H111.037L106.571 23.06L111.763 29H108.243L103.821 23.522V29H101.005ZM113.509 29V13.16H116.325V19.76C116.692 19.1587 117.183 18.6893 117.799 18.352C118.43 18 119.148 17.824 119.955 17.824C121.304 17.824 122.346 18.2493 123.079 19.1C123.827 19.9507 124.201 21.1973 124.201 22.84V29H121.407V23.104C121.407 22.1653 121.216 21.4467 120.835 20.948C120.468 20.4493 119.882 20.2 119.075 20.2C118.283 20.2 117.623 20.4787 117.095 21.036C116.582 21.5933 116.325 22.3707 116.325 23.368V29H113.509ZM130.656 29.264C129.717 29.264 128.947 29.1173 128.346 28.824C127.745 28.516 127.297 28.1127 127.004 27.614C126.711 27.1153 126.564 26.5653 126.564 25.964C126.564 24.952 126.96 24.1307 127.752 23.5C128.544 22.8693 129.732 22.554 131.316 22.554H134.088V22.29C134.088 21.542 133.875 20.992 133.45 20.64C133.025 20.288 132.497 20.112 131.866 20.112C131.294 20.112 130.795 20.2513 130.37 20.53C129.945 20.794 129.681 21.19 129.578 21.718H126.828C126.901 20.926 127.165 20.2367 127.62 19.65C128.089 19.0633 128.691 18.616 129.424 18.308C130.157 17.9853 130.979 17.824 131.888 17.824C133.443 17.824 134.667 18.2127 135.562 18.99C136.457 19.7673 136.904 20.8673 136.904 22.29V29H134.506L134.242 27.24C133.919 27.8267 133.465 28.3107 132.878 28.692C132.306 29.0733 131.565 29.264 130.656 29.264ZM131.294 27.064C132.101 27.064 132.724 26.8 133.164 26.272C133.619 25.744 133.905 25.0913 134.022 24.314H131.624C130.876 24.314 130.341 24.4533 130.018 24.732C129.695 24.996 129.534 25.326 129.534 25.722C129.534 26.1473 129.695 26.4773 130.018 26.712C130.341 26.9467 130.766 27.064 131.294 27.064ZM139.591 29V18.088H142.099L142.363 20.134C142.759 19.43 143.294 18.8727 143.969 18.462C144.658 18.0367 145.465 17.824 146.389 17.824V20.794H145.597C144.981 20.794 144.431 20.8893 143.947 21.08C143.463 21.2707 143.082 21.6007 142.803 22.07C142.539 22.5393 142.407 23.192 142.407 24.028V29H139.591ZM153.136 29.264C152.11 29.264 151.193 29.0147 150.386 28.516C149.58 28.0173 148.942 27.3353 148.472 26.47C148.003 25.6047 147.768 24.622 147.768 23.522C147.768 22.422 148.003 21.4467 148.472 20.596C148.942 19.7307 149.58 19.056 150.386 18.572C151.193 18.0733 152.11 17.824 153.136 17.824C153.958 17.824 154.676 17.978 155.292 18.286C155.908 18.594 156.407 19.0267 156.788 19.584V13.16H159.604V29H157.096L156.788 27.438C156.436 27.922 155.967 28.3473 155.38 28.714C154.808 29.0807 154.06 29.264 153.136 29.264ZM153.73 26.8C154.64 26.8 155.38 26.4993 155.952 25.898C156.539 25.282 156.832 24.4973 156.832 23.544C156.832 22.5907 156.539 21.8133 155.952 21.212C155.38 20.596 154.64 20.288 153.73 20.288C152.836 20.288 152.095 20.5887 151.508 21.19C150.922 21.7913 150.628 22.5687 150.628 23.522C150.628 24.4753 150.922 25.26 151.508 25.876C152.095 26.492 152.836 26.8 153.73 26.8ZM166.982 29.264C166.014 29.264 165.163 29.11 164.43 28.802C163.697 28.4793 163.11 28.0393 162.67 27.482C162.23 26.9247 161.966 26.2793 161.878 25.546H164.716C164.804 25.9713 165.039 26.338 165.42 26.646C165.816 26.9393 166.322 27.086 166.938 27.086C167.554 27.086 168.001 26.9613 168.28 26.712C168.573 26.4627 168.72 26.1767 168.72 25.854C168.72 25.3847 168.515 25.0693 168.104 24.908C167.693 24.732 167.121 24.5633 166.388 24.402C165.919 24.2993 165.442 24.1747 164.958 24.028C164.474 23.8813 164.027 23.698 163.616 23.478C163.22 23.2433 162.897 22.95 162.648 22.598C162.399 22.2313 162.274 21.784 162.274 21.256C162.274 20.288 162.655 19.474 163.418 18.814C164.195 18.154 165.281 17.824 166.674 17.824C167.965 17.824 168.991 18.1247 169.754 18.726C170.531 19.3273 170.993 20.156 171.14 21.212H168.478C168.317 20.4053 167.708 20.002 166.652 20.002C166.124 20.002 165.713 20.1047 165.42 20.31C165.141 20.5153 165.002 20.772 165.002 21.08C165.002 21.4027 165.215 21.6593 165.64 21.85C166.065 22.0407 166.63 22.2167 167.334 22.378C168.097 22.554 168.793 22.752 169.424 22.972C170.069 23.1773 170.583 23.4927 170.964 23.918C171.345 24.3287 171.536 24.9227 171.536 25.7C171.551 26.3747 171.375 26.9833 171.008 27.526C170.641 28.0687 170.113 28.494 169.424 28.802C168.735 29.11 167.921 29.264 166.982 29.264ZM175.241 29.154C174.727 29.154 174.302 28.9927 173.965 28.67C173.642 28.3473 173.481 27.9587 173.481 27.504C173.481 27.0347 173.642 26.6387 173.965 26.316C174.302 25.9933 174.727 25.832 175.241 25.832C175.754 25.832 176.172 25.9933 176.495 26.316C176.832 26.6387 177.001 27.0347 177.001 27.504C177.001 27.9587 176.832 28.3473 176.495 28.67C176.172 28.9927 175.754 29.154 175.241 29.154Z" fill="#3E4B40"/>
              <!-- <rect width="49" height="43" rx="10" fill="white"/> -->
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.7213 19.3684C20.7825 18.6681 19.4964 17.1221 18.9351 15.9813L17.789 13.6521C16.3655 10.759 13.5492 8.80589 10.3408 8.48655V8.48655C8.58165 8.31147 6.86686 8.69884 5.89748 10.1772C5.30763 11.0768 4.64985 12.1785 4.04514 13.2539C2.5189 15.9682 2.68644 18.9582 4.01269 21.7756L4.22063 22.2173C5.52164 24.9811 7.95041 27.1824 10.5 25.5V25.5L19.7213 19.3684V19.3684ZM29.2937 19.3684C28.2392 18.6725 29.462 17.0889 29.9062 15.9062L30.3716 14.667C31.6724 11.2036 34.8447 8.79339 38.5301 8.46858V8.46858C40.3818 8.30539 42.1829 8.73959 43.1934 10.2998C43.7715 11.1922 44.4084 12.2663 44.9932 13.3116C46.4916 15.9899 46.3256 18.9377 45.0223 21.7162L44.7946 22.2018C43.4933 24.976 41.0575 27.1878 38.5 25.5V25.5L35.2663 23.3096L29.2937 19.3684V19.3684ZM23.8768 15.6189L22.488 18.1645C22.2219 18.6524 22.1389 19.2193 22.2541 19.763L23.8329 27.2176C23.9422 27.7338 25.161 27.7338 25.2704 27.2176L26.8492 19.763C26.9644 19.2193 26.8814 18.6524 26.6152 18.1645L25.2265 15.6189C25.01 15.2221 24.0932 15.2221 23.8768 15.6189ZM19.751 20.8566L11.0201 26.6485C10.5649 26.9504 10.147 28.7832 10.1239 30.1164C10.1065 31.1185 10.8699 31.8903 11.5819 32.5956L11.9644 32.9744C12.6399 33.6434 13.497 34.0994 14.4292 34.2858L14.6272 34.3254C15.2019 34.4404 15.7949 34.4263 16.3636 34.2841V34.2841C17.1053 34.0987 17.9237 33.9854 18.5601 33.5617C19.79 32.7426 21.5426 31.0481 21.5313 30.5369L21.3339 21.6834C21.316 20.8807 20.4201 20.4128 19.751 20.8566ZM29.2634 20.8568L37.9942 26.6486C38.4755 26.9679 39.142 28.9991 39.2608 30.3411C39.3336 31.1632 38.7657 31.9107 38.3381 32.6166V32.6166C37.8061 33.4948 36.9173 34.0971 35.9045 34.2659L35.2989 34.3669C34.7699 34.455 34.2301 34.455 33.7011 34.3669L33.3084 34.3014C32.1215 34.1036 30.8569 33.9075 29.9043 33.1725C28.7632 32.292 27.4733 30.9768 27.4831 30.537L27.6804 21.6835C27.6983 20.8808 28.5943 20.4129 29.2634 20.8568Z" fill="#3E4B40"/>
            </svg>
        </div>
            &copy; 2024 Blackhards Family. All rights reserved.
        </div>

        
    </div>


</body>
</html>
`;
@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create a Nodemailer transporter using your email service provider's SMTP details
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com', // Replace with your SMTP host
      port: 465, // Replace with your SMTP port
      // type: 'TLS',

      secure: true, // Set to true if your SMTP server uses SSL
      auth: {
        user: process.env.MAIL_USER, // Replace with your email address
        pass: process.env.MAIL_PASS, // Replace with your email password
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    verificationToken: string,
  ): Promise<void> {
    try {
      // Construct the verification link
      const verificationLink = `${process.env.FRONTEND_HOST}/auth/login?verifyToken=${verificationToken}&email=${to}`;

      const mailOptions = {
        from: '"Blackhards Family" <no-reply@blackhards.com>', // Display name with email address
        to,
        subject: 'Account Verification',
        text: `Dear user,\n\nThank you for registering with Blackhards. Please click the following link to verify your account:\n\n${verificationLink}\n\nIf you did not create an account, please ignore this email.\n\nBest regards,\nThe Blackhards Team`,
        html: `<p>Dear user,</p><p>Thank you for registering with Blackhards. Please click the following link to verify your account:</p><p><a href="${verificationLink}">${verificationLink}</a></p><p>If you did not create an account, please ignore this email.</p><p>Best regards,<br>The Blackhards Team</p>`,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Verification email sending failed: ${error.message}`);
      throw new Error('Verification email sending failed');
    }
  }

  async sendEarlyConfirmationEmail(to: string): Promise<void> {
    try {
      const mailOptions = {
        from: '"Blackhards Family" <no-reply@blackhards.com>', // Display name with email address
        to,
        subject: 'Early Access Confirmation',
        text: `Dear Adventurer,\n\nThank you for Joining the Blackhards family. We appreciate your interest and will notify you when we go life,\n "All Big Adventures started from small changes and little steps"\n\nBest regards,\nThe Blackhards Family`,
        html: confirmationHtml,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Early access confirmation email sent to ${to}`);
    } catch (error) {
      console.error(
        `Early access confirmation email sending failed: ${error.message}`,
      );
      console.log(error, 'ERROR');
      throw new Error('Early access confirmation email sending failed');
    }
  }

  async sendNotificationEmail(
    to: string,
    message: string,
    link: string,
    notificationTitle: string = 'Auction Resulted',
  ): Promise<void> {
    try {
      // Construct the verification link

      const mailOptions = {
        from: `"${notificationTitle}(Blackhards)" <no-reply@blackhards.com>`, // Display name with email address
        to,
        subject: notificationTitle,
        text: `Dear Comrade,\n\n${message}:\n\n Here is a Link to the action: ${link}\n\nBest regards,\nThe Blackhards Team`,
        html: `<p>Dear Comrade,</p><p>${message}:</p><p>Here is a Link to the action: click<a href="${link}">Here</a></p><p>Best regards,<br>The Blackhards Team</p>`,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${to}`);
    } catch (error) {
      console.error(`Verification email sending failed: ${error.message}`);
      console.log(error, 'ERROR');
      throw new Error('Verification email sending failed');
    }
  }

  async sendInternEmail(
    name: string,
    role: string,
    email: string,
  ): Promise<void> {
    try {
      // Construct the verification link (if needed, here it's not used)
      // const verificationLink = `https://www.blackhards.com/verify?verifyToken=${verificationToken}&email=${to}`;

      const mailOptions = {
        from: '"Blackhards Family" <no-reply@blackhards.com>', // Display name with email address
        to: email,
        subject: 'Internship Application Received',
        text: `Hello ${name},\n\nThank you for applying for the ${role} internship at Blackhard Games. We have received your application and will contact you if you are selected.\n\nBest regards,\nJoy Chukwuma\nHR Manager`,
        html: template(role, name),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Internship application email sent to ${email}`);
    } catch (error) {
      console.error(
        `Internship application email sending failed: ${error.message}`,
      );
      console.log(error, 'ERROR');
      throw new Error('Internship application email sending failed');
    }
  }

  async sendResetPasswordEmail(to: string, resetLink: string): Promise<void> {
    try {
      resetLink = `${process.env.FRONTEND_HOST}/auth/reset-password?resetToken=${resetLink}&email=${to}`;
      // Create the email content
      const mailOptions = {
        from: '"Blackhards Family" <no-reply@blackhards.com>', // Display name with email address
        to,
        subject: 'Reset Password',
        text: `Dear user,\n\nWe received a request to reset your password. Please click the following link to reset your password:\n\n${resetLink}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe Blackhards Team`,
        html: `<p>Dear user,</p><p>We received a request to reset your password. Please click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request a password reset, please ignore this email.</p><p>Best regards,<br>The Blackhards Team</p>`,
      };

      // Send the email using Nodemailer
      await this.transporter.sendMail(mailOptions);

      console.log(`Reset password email sent to ${to}`);
    } catch (error) {
      console.error(`Reset password email sending failed: ${error.message}`);
      console.log(error, 'ERROR');
      throw new Error('Reset password email sending failed');
    }
  }

  async sendCreditTransferEmail(
    sender: string,
    receiver: string,
    amount: number,
  ): Promise<void> {
    try {
      const emailContent = `
        <p>Dear ${receiver},</p>
        <p>You have received a credit transfer from ${sender}.</p>
        <p>Amount: ${amount}</p>
        <p>Thank you for using our service!</p>
      `;

      // Send the credit transfer email using Nodemailer
      await this.transporter.sendMail({
        from: 'vyra@techsprinthub.com', // Replace with your email address
        to: receiver,
        subject: 'Credit Transfer Notification',
        html: emailContent,
      });

      console.log(`Credit transfer email sent to ${receiver}`);
    } catch (error) {
      console.error(`Credit transfer email sending failed: ${error.message}`);
      throw new Error('Credit transfer email sending failed');
    }
  }
}
