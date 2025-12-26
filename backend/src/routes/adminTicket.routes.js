import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeAdmin } from "../middleware/admin.middleware.js";
import { getAllTickets, updateTicketStatus, assignTicket } from "../controllers/adminTicket.controller.js";

const router = express.Router();

// All routes require authentication + admin role
router.use(authenticate, authorizeAdmin);

router.get("/", getAllTickets);
router.patch("/:ticketId/status", updateTicketStatus);
router.patch("/:ticketId/assign", assignTicket);

export default router;
