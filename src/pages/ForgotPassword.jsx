import { useState } from "react";
import { NavLink } from "react-router-dom";

import { resetPassword } from "../services/authService";

import "../styles/auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(email);

      alert(
        "Password reset email has been sent successfully."
      );

      setEmail("");

    } catch (error) {

      console.error(error);

      switch (error.code) {

        case "auth/user-not-found":
          alert("No account found with this email.");
          break;

        case "auth/invalid-email":
          alert("Please enter a valid email.");
          break;

        default:
          alert(error.message);

      }

    } finally {

      setLoading(false);

    }
  };

  return (
    <section className="auth-page">

      <div className="auth-container">

        <div className="auth-card">

          <h1>Forgot Password</h1>

          <p>
            Enter your registered email address to receive a password reset link.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

            <p className="bottom-text">

              Remember your password?{" "}

              <NavLink to="/login">
                Login
              </NavLink>

            </p>

          </form>

        </div>

      </div>

    </section>
  );
}

export default ForgotPassword;