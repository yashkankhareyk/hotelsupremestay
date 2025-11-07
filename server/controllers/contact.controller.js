import { ContactMessage } from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import transporter from "../utils/mailer.js";

const sendMail = async ({ name, email, phone, message }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.TO_EMAIL,
    subject: `📩 New Contact Message from ${name}`,
    text: `Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}

Message:
${message}
`
  };

  await transporter.sendMail(mailOptions);
};

export const sendContactMail = asyncHandler(async (req, res) => {
  await sendMail(req.body);
  res.status(200).json({ success: true, message: "Message sent successfully!" });
});

export const submitContact = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.create(req.body);
  await sendMail(req.body);
  res.status(201).json({ success: true, id: msg._id });
});