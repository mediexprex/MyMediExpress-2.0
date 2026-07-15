import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { googleLogin } from "../../services/authService";

function GoogleLoginButton() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      await googleLogin();

      alert("Google Login Successful");

      navigate("/");
    } catch (error) {
      console.error(error);

      switch (error.code) {
        case "auth/popup-closed-by-user":
          alert("Google sign in was cancelled.");
          break;

        case "auth/popup-blocked":
          alert("Popup blocked. Please allow popups and try again.");
          break;

        case "auth/network-request-failed":
          alert("Network error. Please check your internet connection.");
          break;

        default:
          alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="google-btn"
      onClick={handleGoogleLogin}
      disabled={loading}
    >
      <FcGoogle size={24} />

      <span>
        {loading
          ? "Signing In..."
          : "Continue with Google"}
      </span>
    </button>
  );
}

export default GoogleLoginButton;