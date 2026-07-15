import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";

function LoginForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      alert("Please enter email.");
      return;
    }

    if (!formData.password.trim()) {
      alert("Please enter password.");
      return;
    }

    try {
      setLoading(true);

      await loginUser(
        formData.email,
        formData.password
      );

      alert("Login Successful");

      navigate("/");

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="login-title">
        Welcome Back 👋
      </h2>

      <p className="login-subtitle">
        Login to your MyMediExpress account
      </p>

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() =>
                setShowPassword(!showPassword)
              }
            />

            Show Password
          </label>

          <NavLink
            to="/forgot-password"
          >
            Forgot Password?
          </NavLink>
        </div>

        <button
          className="auth-btn"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Signing In..."
            : "Login"}
        </button>

<div className="divider">
  <span>OR</span>
</div>

{/* Mobile OTP Section */}

<div className="otp-section">

  <input
    type="tel"
    placeholder="📱 Enter Mobile Number"
    className="otp-input"
  />

  <button
    type="button"
    className="otp-btn"
  >
    Send OTP
  </button>

</div>

<div className="divider">
  <span>OR</span>
</div>

<GoogleLoginButton />

<button
  type="button"
  className="guest-btn"
>
  Continue as Guest
</button>

<p className="bottom-text">

  Don't have an account?{" "}

  <NavLink to="/register">
    Create Account
  </NavLink>

</p>
      </form>
    </>
  );
}

export default LoginForm;