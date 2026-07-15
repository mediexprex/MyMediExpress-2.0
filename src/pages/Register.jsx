import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  registerUser,
} from "../services/authService";

import GoogleLoginButton from "../components/auth/GoogleLoginButton";

import "../styles/auth.css";

function Register() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email.");
      return;
    }

    if (!formData.password.trim()) {
      alert("Please enter your password.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    try {

      setLoading(true);

      await registerUser(
        formData.name,
        formData.email,
        formData.password
      );

      alert("Account created successfully!");

      navigate("/");

    } catch (error) {

      console.error(error);

      switch (error.code) {

        case "auth/email-already-in-use":
          alert("Email is already registered.");
          break;

        case "auth/invalid-email":
          alert("Invalid email address.");
          break;

        case "auth/weak-password":
          alert("Password is too weak.");
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

          <h1>Create Account</h1>

          <p>
            Join MyMediExpress today
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </div>

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
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Confirm Password</label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

            </div>

            <div className="auth-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  onChange={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                />

                Show Password

              </label>

            </div>

            <button
              type="submit"
              className="auth-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

            <div className="divider">
              <span>OR</span>
            </div>

            <GoogleLoginButton />

            <p className="bottom-text">

              Already have an account?{" "}

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

export default Register;