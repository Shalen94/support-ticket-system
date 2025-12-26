import { useState } from "react";
import { forgotPassword } from "../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);

      setMessage(
        res.data.message ||
          "OTP has been sent to your registered email address."
      );

      // 👇 Redirect after short delay (better UX)
      setTimeout(() => {
        navigate("/reset-password", {
          state: { email }, // optional but useful
        });
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-card" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        <p className="subtitle">
          Enter your email to receive a one-time password (OTP)
        </p>

        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}

        <input
          type="email"
          placeholder="Registered email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <div className="links">
          <Link to="/">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
