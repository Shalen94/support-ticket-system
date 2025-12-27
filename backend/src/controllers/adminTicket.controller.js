import pool from "../config/db.js";
import logger from "../utils/logger.js";

/**
 * Get all tickets (Admin-only)
 */
export const getAllTickets = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tickets ORDER BY created_at DESC`
    );

    logger.info(`Admin fetched all tickets | Admin ID: ${req.user?.id}`);

    res.json({ tickets: result.rows });
  } catch (error) {
    logger.error(`Get all tickets error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update ticket status (Admin-only)
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!["OPEN", "IN_PROGRESS", "RESOLVED", "COMPLETED", "CLOSED"].includes(status)) {
      logger.warn(
        `Invalid ticket status attempt | Status: ${status} | Admin ID: ${req.user?.id}`
      );
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE tickets 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, ticketId]
    );

    if (result.rows.length === 0) {
      logger.warn(
        `Ticket not found while updating status | Ticket ID: ${ticketId}`
      );
      return res.status(404).json({ message: "Ticket not found" });
    }

    logger.info(
      `Ticket status updated | Ticket ID: ${ticketId} | New Status: ${status} | Admin ID: ${req.user?.id}`
    );

    res.json({
      message: "Ticket status updated",
      ticket: result.rows[0],
    });
  } catch (error) {
    logger.error(`Update ticket status error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Assign ticket to an admin
 */
export const assignTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    const result = await pool.query(
      `UPDATE tickets 
       SET assigned_to = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [assignedTo, ticketId]
    );

    if (result.rows.length === 0) {
      logger.warn(
        `Ticket not found while assigning | Ticket ID: ${ticketId}`
      );
      return res.status(404).json({ message: "Ticket not found" });
    }

    logger.info(
      `Ticket assigned | Ticket ID: ${ticketId} | Assigned To: ${assignedTo} | Admin ID: ${req.user?.id}`
    );

    res.json({
      message: "Ticket assigned",
      ticket: result.rows[0],
    });
  } catch (error) {
    logger.error(`Assign ticket error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
