import { Resend } from "resend";

// resend email service, check env for credentials.
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "support@noblefunded.com"; // Adjust to your verified domain

export const emailService = {
  async sendWelcomeEmail(email, name) {
    try {
      await resend.emails.send({
        from: `Noble Funded <${FROM_EMAIL}>`,
        to: email,
        subject: "Welcome to Noble Funded",
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Welcome to Noble Funded, ${name}!</h2>
            <p>We're thrilled to have you join our proprietary trading platform.</p>
            <p>You can now browse our challenge plans and start your trading journey.</p>
            <p>Log in to your dashboard to get started.</p>
            <br/>
            <p>Best regards,</p>
            <p>The Noble Funded Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  },

  async sendPasswordResetEmail(email, name, token) {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await resend.emails.send({
        from: `Noble Funded <${FROM_EMAIL}>`,
        to: email,
        subject: "Reset your password - Noble Funded",
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Hello ${name},</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the link below to set a new password:</p>
            <a href="${resetLink}" style="display:inline-block; padding: 10px 20px; background-color: #c9a84c; color: #000; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            <p>If you did not request this, you can safely ignore this email.</p>
            <br/>
            <p>Best regards,</p>
            <p>The Noble Funded Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }
  },

  async sendPurchaseConfirmationEmail(email, name, accountType, balance) {
    try {
      await resend.emails.send({
        from: `Noble Funded <${FROM_EMAIL}>`,
        to: email,
        subject: "Challenge Purchased Successfully!",
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Hello ${name},</h2>
            <p>Your payment was successful and your ${accountType.toUpperCase()} challenge (${balance}) is being set up!</p>
            <p>You will receive your MT5 credentials shortly in a separate email or directly in your dashboard.</p>
            <br/>
            <p>Best regards,</p>
            <p>The Noble Funded Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send purchase email:", error);
    }
  },

  async sendTicketReplyEmail(email, name, subject, message) {
    try {
      await resend.emails.send({
        from: `Noble Funded <${FROM_EMAIL}>`,
        to: email,
        subject: `Re: ${subject}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <p>Hello ${name},</p>
            <p>The support team has replied to your ticket:</p>
            <blockquote style="border-left: 4px solid #c9a84c; padding-left: 15px; margin: 15px 0;">
              ${message.replace(/\n/g, "<br/>")}
            </blockquote>
            <p>You can view the full conversation in your Support Dashboard.</p>
            <br/>
            <p>Best regards,</p>
            <p>The Noble Funded Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send ticket reply email:", error);
    }
  },

  async sendPayoutStatusEmail(email, name, amount, status, reason = "") {
    const isApproved = status === "approved";
    const color = isApproved ? "#22c55e" : "#ef4444";

    try {
      await resend.emails.send({
        from: `Noble Funded <${FROM_EMAIL}>`,
        to: email,
        subject: `Payout Request ${status.toUpperCase()}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Hello ${name},</h2>
            <p>Your payout request for <strong>₦${Number(amount).toLocaleString()}</strong> has been <strong style="color:${color}">${status}</strong>.</p>
            ${!isApproved && reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
            ${isApproved ? `<p>The funds are being processed and should reflect in your bank account shortly.</p>` : ""}
            <br/>
            <p>Best regards,</p>
            <p>The Noble Funded Team</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Failed to send payout status email:", error);
    }
  },
};
