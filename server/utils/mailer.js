import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // TLS via STARTTLS
  auth: {
    user: process.env.EMAIL_USER, // MUST be "apikey"
    pass: process.env.EMAIL_PASS, // Brevo SMTP key
  },
});

export default transporter;
