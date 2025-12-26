import pool from "../config/db.js";

/**
 * Get all tickets (Admin-only)
 */
export const getAllTickets = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM tickets ORDER BY created_at DESC`);
    res.json({ tickets: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Update ticket status (Admin-only)
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!["OPEN","IN_PROGRESS","RESOLVED","CLOSED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const result = await pool.query(
      `UPDATE tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket status updated", ticket: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Assign ticket to an admin
 */
export const assignTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body; // admin user ID

    const result = await pool.query(
      `UPDATE tickets SET assigned_to = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [assignedTo, ticketId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket assigned", ticket: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
