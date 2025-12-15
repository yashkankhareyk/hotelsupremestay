import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: "apikey",
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  requireTLS: true,
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
});

// 🔍 VERIFY SMTP ON STARTUP
transporter.verify((err) => {
  if (err) {
    console.error("❌ BREVO SMTP VERIFY FAILED:", err);
  } else {
    console.log("✅ BREVO SMTP READY");
  }
});

export default transporter;
