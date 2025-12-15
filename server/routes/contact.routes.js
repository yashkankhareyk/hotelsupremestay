import express from "express";
import { submitContact } from "../controllers/contact.controller.js";
import { validate, Schemas } from "../middleware/validate.js";

const router = express.Router();

// Public contact form
router.post("/", validate(Schemas.contactCreate), submitContact);

export default router;
