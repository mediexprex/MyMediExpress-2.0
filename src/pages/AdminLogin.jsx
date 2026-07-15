import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import { loginAdmin } from "../services/authService";

import "../styles/admin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await loginAdmin(email, password);

      navigate("/admin/dashboard");

    } catch (error) {
      console.error(error);

      switch (error.code) {
        case "auth/invalid-credential":
          alert("Invalid email or password.");
          break;

        case "auth/user-not-found":
          alert("Admin account not found.");
          break;

        case "auth/wrong-password":
          alert("Incorrect password.");
          break;

        case "auth/invalid-email":
          alert("Invalid email address.");
          break;

        case "auth/too-many-requests":
          alert("Too many login attempts. Please try again later.");
          break;

        default:
          alert("Login failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-page">

      <Card>

        <h1>Admin Login</h1>

        <p>
          Login to manage Medi Express Orders
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </form>

      </Card>

    </section>
  );
}

export default AdminLogin;