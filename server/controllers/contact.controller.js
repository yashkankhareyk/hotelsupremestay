import { ContactMessage } from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendBrevoMail } from "../utils/brevoMailer.js";

// Public contact form submit
export const submitContact = asyncHandler(async (req, res) => {
  await ContactMessage.create(req.body);
  await sendBrevoMail(req.body);

  res.status(201).json({
    success: true,
    message: "Message sent successfully!",
  });
});
