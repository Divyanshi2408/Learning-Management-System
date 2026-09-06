const nodemailer = require("nodemailer");
require("dotenv").config();

// Uses Gmail SMTP by default. In your .env set:
//   EMAIL_USER=youraddress@gmail.com
//   EMAIL_PASS=your16charAppPassword   (Gmail: Account > Security > App Passwords, NOT your normal password)
// Works with any other SMTP provider too — just change the `service`
// below to `host`/`port` for that provider if you're not using Gmail.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Generic sender, reused by password reset (and anything else later).
const sendEmail = async ({ to, subject, html }) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error(
            "EMAIL_USER / EMAIL_PASS not set in .env — cannot send email. See utils/emailService.js for setup."
        );
        throw new Error("Email service is not configured.");
    }

    await transporter.sendMail({
        from: `"DevDojo" <${process.env.EMAIL_USER}>`,
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
