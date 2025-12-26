import pool from "../config/db.js";

/**
 * Create a new ticket
 */
export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const result = await pool.query(
      `INSERT INTO tickets (title, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, description, userId]
    );

    res.status(201).json({
      message: "Ticket created successfully",
      ticket: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * Get all tickets of the logged-in user
 */
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT * FROM tickets WHERE created_by = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      tickets: result.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
