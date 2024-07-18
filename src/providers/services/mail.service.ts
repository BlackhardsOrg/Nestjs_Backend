// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { template } from 'src/utils/constants';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create a Nodemailer transporter using your email service provider's SMTP details
    this.transporter = nodemailer.createTransport({
      host: 'mail.privateemail.com', // Replace with your SMTP host
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
      console.log(`Verification email sent to ${to}`);
    } catch (error) {
      console.error(`Verification email sending failed: ${error.message}`);
      console.log(error, 'ERROR');
      throw new Error('Verification email sending failed');
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
