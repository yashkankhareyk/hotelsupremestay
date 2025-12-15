import { ContactMessage } from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import fetch from 'node-fetch';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendBrevoMail = async ({ name, email, phone, message }) => {
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY, // 🔑 API key from Brevo
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: 'Hotel Supreme Stay',
        email: 'bookings@hotelsupremestay.in',
      },
      to: [
        {
          email: 'bookings@hotelsupremestay.in',
          name: 'Bookings',
        },
      ],
      replyTo: {
        email,
        name,
      },
      subject: `📩 New Contact Message from ${name}`,
      htmlContent: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('❌ Brevo API Error:', data);
    throw new Error('Failed to send email via Brevo');
  }

  return data;
};

// Public contact form submit
export const submitContact = asyncHandler(async (req, res) => {
  await ContactMessage.create(req.body);
  await sendBrevoMail(req.body);

  res.status(201).json({
    success: true,
    message: 'Message sent successfully!',
  });
});
