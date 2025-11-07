import express from "express";
import { sendContactMail } from "../controllers/contact.controller.js";
import { validate, Schemas } from "../middleware/validate.js";

const router = express.Router();

router.post("/", validate(Schemas.contactCreate), sendContactMail);

export default router;
