import fetch from "node-fetch";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendBrevoMail = async ({ name, email, phone, message }) => {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "Hotel Supreme Stay",
        email: "bookings@hotelsupremestay.in"
      },
      to: [
        {
          email: "bookings@hotelsupremestay.in",
          name: "Bookings"
        }
      ],
      replyTo: {
        email,
        name
      },
      subject: `📩 New Contact Message from ${name}`,
      htmlContent: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Brevo API Error:", data);
    throw new Error("Brevo API mail failed");
  }

  return data;
};
