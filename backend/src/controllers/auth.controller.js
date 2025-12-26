import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { generateToken } from "../utils/jwt.js";
import { sendMail } from "../utils/email.js";

/**
 * =========================
 * REGISTER
 * =========================
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword]
    );

    // Optional welcome email (nice touch)
    await sendMail({
      email,
      subject: "Welcome to Support System",
      text: `Welcome ${name}, your account has been created successfully.`,
      html: `<h2>Welcome ${name}</h2><p>Your account has been created successfully.</p>`,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
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
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

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
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * =========================
 * FORGOT PASSWORD (EMAIL)
 * =========================
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await pool.query(
      "SELECT id, name FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // always 6 digits
  console.log("Generated OTP:", otp); // debug
  console.log(typeof otp, otp.length);      // string 6
  console.log(typeof user.id, user.id.length); // string 36? (UUID)
  

    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

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
      html: `
        <h2>Hello ${user.name}</h2>
        <p>Your OTP for password reset is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
      `,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
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
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    if (!user.reset_otp || user.reset_otp_expires < new Date()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    const isOtpValid = await bcrypt.compare(otp, user.reset_otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE users 
       SET password = $1, reset_otp = NULL, reset_otp_expires = NULL
       WHERE id = $2`,
      [hashedPassword, user.id]
    );

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* 
Log OUT 
*/

export const logout = async (req, res) => {
  try {
    // If later you use refresh tokens → invalidate here
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
