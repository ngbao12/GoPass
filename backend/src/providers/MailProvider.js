const nodemailer = require('nodemailer');
const config = require('../config');

class MailProvider {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: config.mail.host,
      port: config.mail.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    });
  }

  async sendMail(to, subject, html) {
    try {
      const info = await this.transporter.sendMail({
        from: config.mail.from,
        to,
        subject,
        html,
      });
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to GoPass!';
    const html = `
      <h1>Welcome to GoPass, ${user.name}!</h1>
      <p>Thank you for registering with us.</p>
      <p>You can now start using the platform to learn and take exams.</p>
      <p>Best regards,<br>GoPass Team</p>
    `;
    return await this.sendMail(user.email, subject, html);
  }

  async sendResetPasswordMail(user, resetToken) {
    const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;
    const subject = 'Reset Your Password - GoPass';
    const html = `
      <h1>Reset Your Password</h1>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>GoPass Team</p>
    `;
    return await this.sendMail(user.email, subject, html);
  }

  async sendPasswordChangedNotification(user) {
    const subject = 'Password Changed - GoPass';
    const html = `
      <h1>Password Changed Successfully</h1>
      <p>Hi ${user.name},</p>
      <p>Your password has been changed successfully.</p>
      <p>If you didn't make this change, please contact us immediately.</p>
      <p>Best regards,<br>GoPass Team</p>
    `;
    return await this.sendMail(user.email, subject, html);
  }

  async sendExamAssignmentNotification(user, exam, assignment) {
    const subject = `New Exam Assigned: ${exam.title}`;
    const html = `
      <h1>New Exam Assigned</h1>
      <p>Hi ${user.name},</p>
      <p>A new exam has been assigned to you:</p>
      <p><strong>${exam.title}</strong></p>
      <p>Start Time: ${assignment.startTime}</p>
      <p>End Time: ${assignment.endTime}</p>
      <p>Duration: ${exam.durationMinutes} minutes</p>
      <p>Good luck!</p>
      <p>Best regards,<br>GoPass Team</p>
    `;
    return await this.sendMail(user.email, subject, html);
  }

  async sendGradingNotification(user, exam, score) {
    const subject = `Your Exam Results: ${exam.title}`;
    const html = `
      <h1>Exam Graded</h1>
      <p>Hi ${user.name},</p>
      <p>Your exam <strong>${exam.title}</strong> has been graded.</p>
      <p>Your score: ${score.totalScore} / ${score.maxScore}</p>
      <p>You can view detailed results on the platform.</p>
      <p>Best regards,<br>GoPass Team</p>
    `;
    return await this.sendMail(user.email, subject, html);
  }

  async sendClassInvitation(user, classInfo) {
    const subject = `You've been added to class: ${classInfo.name}`;
    const html = `
      <h1>Class Invitation</h1>
      <p>Hi ${user.name},</p>
      <p>You have been added to the class: <strong>${classInfo.name}</strong></p>
      <p>Class Code: <strong>${classInfo.code}</strong></p>
      <p>You can now access the class materials and assignments.</p>
      <p>Best regards,<br>GoPass Team</p>
    `;
    return await this.sendMail(user.email, subject, html);
  }
}

module.exports = new MailProvider();
