import express from "express";
import { createTicket, getUserTickets } from "../controllers/ticket.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// All ticket routes require authentication
router.post("/", authenticate, createTicket);
router.get("/", authenticate, getUserTickets);

export default router;
