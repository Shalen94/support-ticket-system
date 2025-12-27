import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { sendMail } from "../utils/email.js";
import logger from "../utils/logger.js";

/**
 * =========================
 * REGISTER
 * =========================
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      logger.warn("Register attempt with missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      logger.warn(`Register failed - user already exists: ${email}`);
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword]
    );

    await sendMail({
      email,
      subject: "Welcome to Support System",
      text: `Welcome ${name}, your account has been created successfully.`,
      html: `<h2>Welcome ${name}</h2><p>Your account has been created successfully.</p>`,
    });

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * LOGIN
 * =========================
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logger.warn("Login attempt with missing credentials");
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      logger.warn(`Login failed - user not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      logger.warn(`Login failed - wrong password: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    logger.info(`User logged in: ${email}`);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * FORGOT PASSWORD
 * =========================
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      logger.warn("Forgot password request without email");
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await pool.query(
      "SELECT id, name FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      logger.warn(`Forgot password - user not found: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `UPDATE users 
       SET reset_otp = $1, reset_otp_expires = $2
       WHERE id = $3`,
      [hashedOtp, expiresAt, user.id]
    );

    await sendMail({
      email,
      subject: "Your Password Reset OTP",
      text: `Hello ${user.name}, your OTP is ${otp}. It is valid for 10 minutes.`,
      html: `<h2>Hello ${user.name}</h2><h1>${otp}</h1>`,
    });

    logger.info(`Password reset OTP sent: ${email}`);

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * RESET PASSWORD
 * =========================
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      logger.warn("Reset password attempt with missing fields");
      return res
        .status(400)
        .json({ message: "Email, OTP and new password are required" });
    }

    const result = await pool.query(
      `SELECT id, reset_otp, reset_otp_expires
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      logger.warn(`Reset password - user not found: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    if (!user.reset_otp || user.reset_otp_expires < new Date()) {
      logger.warn(`Expired or invalid OTP attempt: ${email}`);
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.reset_otp);
    if (!isOtpValid) {
      logger.warn(`Invalid OTP entered: ${email}`);
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users 
       SET password = $1, reset_otp = NULL, reset_otp_expires = NULL
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    logger.info(`Password reset successful: ${email}`);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * LOGOUT
 * =========================
 */
export const logout = async (req, res) => {
  try {
    logger.info(`User logged out: ${req.user?.id || "unknown"}`);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    return res.status(500).json({ message: "Logout failed" });
  }
};
