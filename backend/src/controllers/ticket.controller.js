import pool from "../config/db.js";
import logger from "../utils/logger.js";

/**
 * Create a new ticket
 */
export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      logger.warn(
        `Create ticket failed - missing fields | User ID: ${userId}`
      );
      return res
        .status(400)
        .json({ message: "Title and description required" });
    }

    const result = await pool.query(
      `INSERT INTO tickets (title, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, userId]
    );

    logger.info(
      `Ticket created | Ticket ID: ${result.rows[0].id} | User ID: ${userId}`
    );

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: result.rows[0],
    });
  } catch (error) {
    logger.error(
      `Create ticket error | User ID: ${req.user?.id} | ${error.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get all tickets of the logged-in user
 */
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM tickets 
       WHERE created_by = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    logger.info(`User fetched tickets | User ID: ${userId}`);

    res.json({
      tickets: result.rows,
    });
  } catch (error) {
    logger.error(
      `Get user tickets error | User ID: ${req.user?.id} | ${error.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
};
