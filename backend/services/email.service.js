import nodemailer from "nodemailer";

// Create transporter using Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
  port: parseInt(process.env.EMAIL_PORT) || 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "support@noblefunded.com";
const FROM_NAME = "Noble Funded";

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message };
  }
}

export const emailService = {
  async sendWelcomeEmail(email, name) {
    return sendEmail({
      to: email,
      subject: "Welcome to Noble Funded",
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #c9a84c, #f0c96a); padding: 20px; text-align: center;">
            <h1 style="color: #070b11; margin: 0;">Noble Funded</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #333;">Welcome to Noble Funded, ${name}!</h2>
            <p>We're thrilled to have you join our proprietary trading platform.</p>
            <p>You can now browse our challenge plans and start your trading journey.</p>
            <p>Log in to your dashboard to get started.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The Noble Funded Team</strong></p>
          </div>
          <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Noble Funded. All rights reserved.
          </div>
        </div>
      `,
    });
  },

  async sendPasswordResetEmail(email, name, token) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    return sendEmail({
      to: email,
      subject: "Reset your password - Noble Funded",
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #c9a84c, #f0c96a); padding: 20px; text-align: center;">
            <h1 style="color: #070b11; margin: 0;">Noble Funded</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the link below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="display:inline-block; padding: 12px 24px; background-color: #c9a84c; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Reset Password</a>
            </div>
            <p>If you did not request this, you can safely ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The Noble Funded Team</strong></p>
          </div>
          <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Noble Funded. All rights reserved.
          </div>
        </div>
      `,
    });
  },

  async sendPurchaseConfirmationEmail(email, name, accountType, balance) {
    return sendEmail({
      to: email,
      subject: "Challenge Purchased Successfully!",
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #c9a84c, #f0c96a); padding: 20px; text-align: center;">
            <h1 style="color: #070b11; margin: 0;">Noble Funded</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p>Your payment was successful and your <strong>${accountType.toUpperCase()}</strong> challenge (${balance}) is being set up!</p>
            <p>You will receive your MT5 credentials shortly in a separate email or directly in your dashboard.</p>
            <p>Start trading and good luck!</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The Noble Funded Team</strong></p>
          </div>
          <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Noble Funded. All rights reserved.
          </div>
        </div>
      `,
    });
  },

  async sendMT5CredentialsEmail(email, name, mt5Login, mt5Password, server) {
    return sendEmail({
      to: email,
      subject: "Your MT5 Trading Account is Ready!",
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #c9a84c, #f0c96a); padding: 20px; text-align: center;">
            <h1 style="color: #070b11; margin: 0;">Noble Funded</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p>Your MT5 trading account has been created! Here are your credentials:</p>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0;"><strong>Login ID:</strong> ${mt5Login}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> ${mt5Password}</p>
              <p style="margin: 5px 0;"><strong>Server:</strong> ${server}</p>
            </div>
            <p><strong>Important:</strong> Please change your password after your first login.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The Noble Funded Team</strong></p>
          </div>
          <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Noble Funded. All rights reserved.
          </div>
        </div>
      `,
    });
  },

  async sendTicketReplyEmail(email, name, subject, message) {
    return sendEmail({
      to: email,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #c9a84c, #f0c96a); padding: 20px; text-align: center;">
            <h1 style="color: #070b11; margin: 0;">Noble Funded</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <p>Hello ${name},</p>
            <p>The support team has replied to your ticket:</p>
            <blockquote style="border-left: 4px solid #c9a84c; padding-left: 15px; margin: 20px 0; font-style: italic;">
              ${message.replace(/\n/g, "<br/>")}
            </blockquote>
            <p>You can view the full conversation in your Support Dashboard.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The Noble Funded Team</strong></p>
          </div>
          <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Noble Funded. All rights reserved.
          </div>
        </div>
      `,
    });
  },

  async sendPayoutStatusEmail(email, name, amount, status, reason = "") {
    const isApproved = status === "approved";
    const color = isApproved ? "#22c55e" : "#ef4444";
    const statusText = isApproved ? "Approved" : "Rejected";

    return sendEmail({
      to: email,
      subject: `Payout Request ${statusText}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #c9a84c, #f0c96a); padding: 20px; text-align: center;">
            <h1 style="color: #070b11; margin: 0;">Noble Funded</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p>Your payout request for <strong>₦${Number(amount).toLocaleString()}</strong> has been <strong style="color:${color}">${statusText}</strong>.</p>
            ${!isApproved && reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
            ${isApproved ? `<p>The funds are being processed and should reflect in your bank account shortly.</p>` : ""}
            <br/>
            <p>Best regards,</p>
            <p><strong>The Noble Funded Team</strong></p>
          </div>
          <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Noble Funded. All rights reserved.
          </div>
        </div>
      `,
    });
  },

  async sendChallengePassedEmail(email, name, challengeId, profitAmount) {
    return sendEmail({
      to: email,
      subject: "🎉 Congratulations! You Passed Your Challenge!",
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #22c55e, #4ade80); padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">🎉 Challenge Passed!</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #333;">Congratulations ${name}!</h2>
            <p>You have successfully passed your trading challenge!</p>
            <div style="background: #f0fdf4; border: 2px solid #22c55e; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 5px 0; font-size: 14px; color: #666;">Challenge ID</p>
              <p style="margin: 5px 0; font-size: 18px; font-weight: bold; color: #333;">${challengeId}</p>
              <p style="margin: 15px 0 5px; font-size: 14px; color: #666;">Profit Earned</p>
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #22c55e;">₦${Number(profitAmount).toLocaleString()}</p>
            </div>
            <p>You can now request a payout for your profits. Go to your dashboard to submit a payout request.</p>
            <br/>
            <p>Keep up the great work!</p>
            <p><strong>The Noble Funded Team</strong></p>
          </div>
          <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Noble Funded. All rights reserved.
          </div>
        </div>
      `,
    });
  },

  async sendChallengeFailedEmail(email, name, challengeId, reason) {
    return sendEmail({
      to: email,
      subject: "Challenge Ended - Action Required",
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #f87171); padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Challenge Ended</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p>Unfortunately, your trading challenge has been ended.</p>
            <div style="background: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; font-size: 14px; color: #666;">Challenge ID</p>
              <p style="margin: 5px 0 15px; font-size: 16px; font-weight: bold; color: #333;">${challengeId}</p>
              <p style="margin: 5px 0; font-size: 14px; color: #666;">Reason</p>
              <p style="margin: 0; font-size: 16px; color: #ef4444; font-weight: 600;">${reason}</p>
            </div>
            <p>Don't give up! You can purchase a new challenge and try again. Use what you've learned to improve your strategy.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The Noble Funded Team</strong></p>
          </div>
          <div style="padding: 20px; background: #f5f5f5; text-align: center; font-size: 12px; color: #666;">
            © ${new Date().getFullYear()} Noble Funded. All rights reserved.
          </div>
        </div>
      `,
    });
  },
};
