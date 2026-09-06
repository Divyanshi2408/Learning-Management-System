const nodemailer = require("nodemailer");
require("dotenv").config();

// Uses Brevo (formerly Sendinblue) SMTP relay. In your .env set:
//   BREVO_SMTP_USER=your Brevo login email (from Brevo dashboard > SMTP & API > SMTP)
//   BREVO_SMTP_KEY=your Brevo SMTP key (NOT your Brevo account password — a separate generated key)
//   EMAIL_FROM=an email address verified as a sender in Brevo (Senders, Domains & Dedicated IPs)
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // Brevo uses STARTTLS on 587, not implicit TLS
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

// Generic sender, reused by password reset (and anything else later).
const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
        console.error(
            "BREVO_SMTP_USER / BREVO_SMTP_KEY not set in .env — cannot send email. See utils/emailService.js for setup."
        );
        throw new Error("Email service is not configured.");
    }

    await transporter.sendMail({
        from: `"DevDojo" <${process.env.EMAIL_FROM || process.env.BREVO_SMTP_USER}>`,
        to,
        subject,
        html,
    });
};

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
    await sendEmail({
        to: toEmail,
        subject: "Reset your DevDojo password",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
                <h2 style="color:#1d4ed8;">Reset your password</h2>
                <p>We received a request to reset your DevDojo account password. Click the button below to choose a new one. This link expires in 1 hour.</p>
                <p style="text-align:center; margin: 24px 0;">
                    <a href="${resetUrl}" style="background:#2563eb;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">
                        Reset Password
                    </a>
                </p>
                <p>If you didn't request this, you can safely ignore this email — your password will stay the same.</p>
                <p style="color:#6b7280;font-size:12px;">If the button doesn't work, copy and paste this link: <br/>${resetUrl}</p>
            </div>
        `,
    });
};

module.exports = { sendEmail, sendPasswordResetEmail };
