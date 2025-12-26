import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import adminTicketRoutes from "./routes/adminTicket.routes.js"; 

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes); // ← add this
app.use("/api/admin/tickets", adminTicketRoutes); 

export default app;
