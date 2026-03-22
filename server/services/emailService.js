const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const FROM =
  process.env.EMAIL_FROM || "The Leasing World <noreply@leasingworld.com>";

// Generic send helper — won't throw if SMTP not configured
async function send(to, subject, html) {
  if (!process.env.SMTP_USER || process.env.SMTP_USER.startsWith("your_")) {
    console.log(
      `[Email skipped — SMTP not configured] To: ${to} | Subject: ${subject}`,
    );
    // Explicitly log the reset link to the console for easier local testing
    if (html.includes("Reset Password")) {
      const match = html.match(/href="([^"]+)"/);
      if (match) console.log(`[Reset Link for testing]: ${match[1]}`);
    }
    return;
  }
  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html });
    console.log(`[Email sent] To: ${to} | Subject: ${subject} | MessageId: ${info.messageId}`);
  } catch (err) {
    console.error("[Email error]", err.message, "| Code:", err.code, "| Command:", err.command);
    throw err; // Let the caller know the email failed
  }
}

exports.sendPropertySubmitted = async (property, user) => {
  await send(
    user.email,
    "Property Received – Under Review",
    `<p>Hi ${user.name},</p>
     <p>Thank you for submitting <strong>${property.title}</strong>. Our team will review it and may contact you for verification.</p>
     <p>Status: <strong>Pending Review</strong></p>
     <p>– The Leasing World Team</p>`,
  );
};

exports.sendPropertyApproved = async (property, user) => {
  await send(
    user.email,
    "🎉 Your Property Has Been Approved!",
    `<p>Hi ${user.name},</p>
     <p>Great news! Your property <strong>${property.title}</strong> has been approved and is now live on The Leasing World.</p>
     <p>– The Leasing World Team</p>`,
  );
};

exports.sendPropertyRejected = async (property, user, reason) => {
  await send(
    user.email,
    "Update on Your Property Submission",
    `<p>Hi ${user.name},</p>
     <p>Unfortunately, your property <strong>${property.title}</strong> could not be approved at this time.</p>
     ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
     <p>Please contact us if you have questions.</p>
     <p>– The Leasing World Team</p>`,
  );
};

exports.sendDocumentsRequested = async (property, user) => {
  await send(
    user.email,
    "Documents Required for Your Property",
    `<p>Hi ${user.name},</p>
     <p>To proceed with the listing of <strong>${property.title}</strong>, our team requires additional ownership documents.</p>
     <p>Please log in to your account and upload the necessary documents.</p>
     <p>– The Leasing World Team</p>`,
  );
};

exports.sendPasswordReset = async (user, resetUrl) => {
  await send(
    user.email,
    "Reset Your Password – The Leasing World",
    `<p>Hi ${user.name},</p>
     <p>You requested a password reset. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
     <p style="margin:24px 0">
       <a href="${resetUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
     </p>
     <p>If you did not request this, you can safely ignore this email.</p>
     <p>– The Leasing World Team</p>`,
  );
};

exports.sendVerificationCallScheduled = async (property, user) => {
  await send(
    user.email,
    "Verification Call Scheduled",
    `<p>Hi ${user.name},</p>
     <p>A verification call has been scheduled for your property <strong>${property.title}</strong>. Our team will contact you on your registered phone number shortly.</p>
     <p>– The Leasing World Team</p>`,
  );
};
