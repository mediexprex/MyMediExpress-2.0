import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaChevronDown,
  FaBoxOpen,
  FaUser,
  FaSignOutAlt,
  FaRobot,
  FaHeartbeat,
  FaCapsules,
  FaTint,
  FaUtensils,
  FaStethoscope,
  FaHistory,
  FaMale,
  FaClipboardList,
  FaFileMedical,
} from "react-icons/fa";
import {
  listenAuth,
  logoutUser,
} from "../../services/authService";
import "../../styles/navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const aiDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = listenAuth((currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target)) {
        setAiDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setAiDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      closeMenu();
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Logout failed.");
    }
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <NavLink to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="MyMediExpress" className="logo-image" />
          <div className="logo-text">
            <h2>MyMediExpress</h2>
            <span>Your Trusted Healthcare Partner</span>
          </div>
        </NavLink>

        {/* Desktop Menu */}
        <nav className="nav-menu">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>About</NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Services</NavLink>

          {/* AI Health Dropdown */}
          <div className="profile-dropdown" ref={aiDropdownRef}>
            <button className="nav-link flex items-center gap-1" onClick={() => setAiDropdownOpen(!aiDropdownOpen)}>
              AI Health <FaChevronDown className={`text-xs transition-transform ${aiDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {aiDropdownOpen && (
              <div className="profile-menu ai-menu shadow-xl border border-slate-100">
                <NavLink to="/ai-dashboard" onClick={closeMenu}><FaRobot /> AI Dashboard</NavLink>
                <NavLink to="/scanner-ocr" onClick={closeMenu}><FaCapsules /> Medicine Scanner</NavLink>
                <NavLink to="/lab-report-ai" onClick={closeMenu}><FaFileMedical /> Lab Report AI</NavLink>
                <NavLink to="/medicine-reminder" onClick={closeMenu}><FaClipboardList /> Medicine Reminder</NavLink>
                <NavLink to="/water-tracker" onClick={closeMenu}><FaTint /> Water Tracker</NavLink>
                <NavLink to="/food-tracker" onClick={closeMenu}><FaUtensils /> Food Tracker</NavLink>
                <NavLink to="/symptom-tracker" onClick={closeMenu}><FaStethoscope /> Symptom Tracker</NavLink>
                <NavLink to="/health-timeline" onClick={closeMenu}><FaHistory /> Health Timeline</NavLink>
                <NavLink to="/body-3d" onClick={closeMenu}><FaMale /> 3D Body</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/track-order" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>Track Order</NavLink>
        </nav>

        {/* Right Side */}
        <div className="navbar-actions">
          <NavLink to="/order-medicine" className="order-btn">💊 Order</NavLink>
          {!user ? (
            <>
              <NavLink to="/login" className="login-btn">Login</NavLink>
              <NavLink to="/register" className="register-btn">Register</NavLink>
            </>
          ) : (
            <div className="profile-dropdown" ref={dropdownRef}>
              <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.photoURL ? <img src={user.photoURL} alt="Profile" className="profile-avatar" /> : <FaUserCircle className="profile-icon" />}
                <span className="profile-name">{user.displayName || "User"}</span>
                <FaChevronDown className={`dropdown-arrow ${dropdownOpen ? "rotate" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="profile-menu">
                  <NavLink to="/my-account" onClick={closeMenu}><FaUser /> Dashboard</NavLink>
                  <NavLink to="/my-orders" onClick={closeMenu}><FaBoxOpen /> My Orders</NavLink>
                  <NavLink to="/profile" onClick={closeMenu}><FaUserCircle /> Profile</NavLink>
                  <button onClick={handleLogout}><FaSignOutAlt /> Logout</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "show-menu" : ""}`}>
        <NavLink to="/" onClick={closeMenu}>Home</NavLink>
        <NavLink to="/about" onClick={closeMenu}>About</NavLink>
        <NavLink to="/services" onClick={closeMenu}>Services</NavLink>

        <div className="mobile-ai-header px-4 py-2 bg-slate-50 font-bold text-blue-600">AI Health Services</div>
        <NavLink to="/ai-dashboard" onClick={closeMenu}>🤖 AI Dashboard</NavLink>
        <NavLink to="/scanner-ocr" onClick={closeMenu}>💊 Medicine Scanner</NavLink>
        <NavLink to="/lab-report-ai" onClick={closeMenu}>📄 Lab Report AI</NavLink>
        <NavLink to="/medicine-reminder" onClick={closeMenu}>⏰ Medicine Reminder</NavLink>
        <NavLink to="/water-tracker" onClick={closeMenu}>💧 Water Tracker</NavLink>
        <NavLink to="/food-tracker" onClick={closeMenu}>🍎 Food Tracker</NavLink>
        <NavLink to="/symptom-tracker" onClick={closeMenu}>🩺 Symptom Tracker</NavLink>
        <NavLink to="/health-timeline" onClick={closeMenu}>📅 Health Timeline</NavLink>
        <NavLink to="/body-3d" onClick={closeMenu}>🧍 3D Body</NavLink>

        <NavLink to="/track-order" onClick={closeMenu}>Track Order</NavLink>
        <NavLink to="/order-medicine" className="mobile-order-btn" onClick={closeMenu}>💊 Order Medicines</NavLink>

        {!user ? (
          <>
            <NavLink to="/login" className="mobile-login-btn" onClick={closeMenu}>Login</NavLink>
            <NavLink to="/register" className="mobile-register-btn" onClick={closeMenu}>Register</NavLink>
          </>
        ) : (
          <>
            <div className="mobile-user-info">
              {user.photoURL ? <img src={user.photoURL} alt="Profile" className="mobile-profile-avatar" /> : <FaUserCircle className="mobile-profile-icon" />}
              <div>
                <h4>{user.displayName || "User"}</h4>
                <small>{user.email}</small>
              </div>
            </div>
            <NavLink to="/my-account" onClick={closeMenu}>👤 Dashboard</NavLink>
            <NavLink to="/my-orders" onClick={closeMenu}>📦 My Orders</NavLink>
            <NavLink to="/profile" onClick={closeMenu}>⚙ Profile</NavLink>
            <button className="mobile-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;