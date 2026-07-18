import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import GoogleLoginButton from "../../components/auth/GoogleLoginButton";
import { FiMail, FiLock, FiSmartphone, FiEye, FiEyeOff } from "react-icons/fi";

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) return;
    try {
      setLoading(true);
      await loginUser(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="login-title">Welcome Back 👋</h2>
      <p className="login-subtitle">Login to your MyMediExpress account</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label><FiMail /> Email Address</label>
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
          <div className="flex justify-between items-center">
            <label><FiLock /> Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-bold text-muted hover:text-primary transition-colors"
              style={{ marginBottom: '8px', padding: 0 }}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />} {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-options flex justify-between items-center text-xs font-bold mb-4">
          <NavLink to="/forgot-password" style={{ color: 'var(--secondary-color)' }}>
            Forgot Password?
          </NavLink>
        </div>

        <button className="btn-primary w-full py-4 shadow-xl" type="submit" disabled={loading}>
          {loading ? "SIGNING IN..." : "LOGIN TO DASHBOARD"}
        </button>

        <div className="divider flex items-center gap-4 my-6 opacity-30">
          <div className="h-px flex-1 bg-border-color"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">OR SECURE LOGIN</span>
          <div className="h-px flex-1 bg-border-color"></div>
        </div>

        <div className="space-y-4">
          <div className="form-group">
             <div className="relative">
                <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  className="w-full"
                  style={{ paddingLeft: '48px' }}
                />
             </div>
          </div>
          <button type="button" className="btn-primary w-full py-3 bg-secondary-color">
            SEND OTP
          </button>
        </div>

        <div className="divider flex items-center gap-4 my-6 opacity-30">
          <div className="h-px flex-1 bg-border-color"></div>
          <span className="text-[10px] font-black uppercase tracking-widest">SOCIAL</span>
          <div className="h-px flex-1 bg-border-color"></div>
        </div>

        <GoogleLoginButton />

        <p className="bottom-text mt-8 text-center text-sm font-medium text-muted">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-primary font-black">
            Create Account
          </NavLink>
        </p>
      </form>
    </>
  );
}

export default LoginForm;
