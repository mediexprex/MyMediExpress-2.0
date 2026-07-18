import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, User, ChevronDown, Package, LogOut,
  LayoutDashboard, Scan, FileText, Bell, Droplets,
  Utensils, Activity, History, User2, Globe, Sun, Moon, Check
} from "lucide-react";
import { listenAuth, logoutUser } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import "../../styles/navbar.css";
import logo from "../../assets/logo.png";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  const aiDropdownRef = useRef(null);
  const settingsRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    closeMenu();
  }, [location]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = listenAuth((currentUser) => setUser(currentUser));
    return unsubscribe;
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
      if (aiDropdownRef.current && !aiDropdownRef.current.contains(event.target)) setAiDropdownOpen(false);
      if (settingsRef.current && !settingsRef.current.contains(event.target)) setSettingsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setAiDropdownOpen(false);
    setSettingsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      closeMenu();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const ICON_SIZE = 20;

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <NavLink to="/" className="logo" aria-label="Home">
          <img src={logo} alt="" className="logo-image" />
          <div className="logo-text">
            <h2>MyMediExpress</h2>
            <span>Trusted Healthcare Partner</span>
          </div>
        </NavLink>

        <nav className="nav-menu" aria-label="Desktop Navigation">
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>{t('home')}</NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>{t('about')}</NavLink>
          <NavLink to="/services" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>{t('services')}</NavLink>

          <div className="profile-dropdown" ref={aiDropdownRef}>
            <button className="nav-link" onClick={() => setAiDropdownOpen(!aiDropdownOpen)} aria-expanded={aiDropdownOpen}>
              {t('aiHealth')} <ChevronDown size={14} className={`transition-transform ${aiDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {aiDropdownOpen && (
              <div className="profile-menu shadow-xl glass" role="menu">
                <NavLink to="/ai-dashboard"><LayoutDashboard size={ICON_SIZE} /> {t('aiDashboard')}</NavLink>
                <NavLink to="/scanner-ocr"><Scan size={ICON_SIZE} /> {t('medicineScanner')}</NavLink>
                <NavLink to="/lab-report-ai"><FileText size={ICON_SIZE} /> {t('labReportAI')}</NavLink>
                <NavLink to="/medicine-reminder"><Bell size={ICON_SIZE} /> {t('medicineReminder')}</NavLink>
                <NavLink to="/water-tracker"><Droplets size={ICON_SIZE} /> {t('waterTracker')}</NavLink>
                <NavLink to="/food-tracker"><Utensils size={ICON_SIZE} /> {t('foodTracker')}</NavLink>
                <NavLink to="/symptom-tracker"><Activity size={ICON_SIZE} /> {t('symptomTracker')}</NavLink>
                <NavLink to="/health-timeline"><History size={ICON_SIZE} /> {t('healthTimeline')}</NavLink>
                <NavLink to="/body-3d"><User2 size={ICON_SIZE} /> {t('body3d')}</NavLink>
              </div>
            )}
          </div>

          <NavLink to="/track-order" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>{t('trackOrder')}</NavLink>
        </nav>

        <div className="navbar-actions">
          <div className="profile-dropdown settings-dropdown" ref={settingsRef}>
            <button className="profile-btn" onClick={() => setSettingsOpen(!settingsOpen)} aria-label="Settings">
              {theme === "light" ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
              <Globe size={ICON_SIZE} />
            </button>
            {settingsOpen && (
              <div className="profile-menu shadow-xl glass" style={{ width: '200px' }} role="menu">
                <button onClick={toggleTheme}>
                  {theme === "light" ? <Moon size={ICON_SIZE} /> : <Sun size={ICON_SIZE} />}
                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                </button>
                <div className="profile-divider"></div>
                <button onClick={() => setLanguage("en")} className="justify-between">
                  <span>English</span>
                  {language === "en" && <Check size={16} className="text-primary" />}
                </button>
                <button onClick={() => setLanguage("te")} className="justify-between">
                  <span>తెలుగు</span>
                  {language === "te" && <Check size={16} className="text-primary" />}
                </button>
              </div>
            )}
          </div>

          <NavLink to="/order-medicine" className="btn-primary order-btn">💊 {t('order')}</NavLink>

          {!user ? (
            <NavLink to="/login" className="login-btn">{t('login')}</NavLink>
          ) : (
            <div className="profile-dropdown" ref={dropdownRef}>
              <button className="profile-btn" onClick={() => setDropdownOpen(!dropdownOpen)} aria-label="Profile">
                {user.photoURL ? <img src={user.photoURL} alt="" className="profile-avatar" /> : <User size={ICON_SIZE} className="profile-icon" />}
                <span className="profile-name">{user.displayName?.split(' ')[0] || "User"}</span>
                <ChevronDown size={14} className={`dropdown-arrow ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="profile-menu shadow-xl glass" role="menu">
                  <NavLink to="/my-account"><LayoutDashboard size={ICON_SIZE} /> {t('myAccount')}</NavLink>
                  <NavLink to="/my-orders"><Package size={ICON_SIZE} /> {t('myOrders')}</NavLink>
                  <NavLink to="/profile"><User size={ICON_SIZE} /> {t('profile')}</NavLink>
                  <div className="profile-divider"></div>
                  <button onClick={handleLogout} style={{ color: '#ef4444' }}>
                    <LogOut size={ICON_SIZE} /> {t('logout')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? "show-menu" : ""} glass`}>
        <NavLink to="/">{t('home')}</NavLink>
        <NavLink to="/about">{t('about')}</NavLink>
        <NavLink to="/services">{t('services')}</NavLink>

        <div className="mobile-ai-header">{t('aiHealth')}</div>
        <div className="mobile-ai-grid">
          <NavLink to="/ai-dashboard"><LayoutDashboard size={18} /> {t('aiDashboard')}</NavLink>
          <NavLink to="/scanner-ocr"><Scan size={18} /> {t('medicineScanner')}</NavLink>
          <NavLink to="/lab-report-ai"><FileText size={18} /> {t('labReportAI')}</NavLink>
          <NavLink to="/medicine-reminder"><Bell size={18} /> {t('medicineReminder')}</NavLink>
          <NavLink to="/water-tracker"><Droplets size={18} /> {t('waterTracker')}</NavLink>
          <NavLink to="/food-tracker"><Utensils size={18} /> {t('foodTracker')}</NavLink>
          <NavLink to="/symptom-tracker"><Activity size={18} /> {t('symptomTracker')}</NavLink>
          <NavLink to="/health-timeline"><History size={18} /> {t('healthTimeline')}</NavLink>
        </div>

        <div className="mobile-settings flex items-center justify-between p-4 bg-bg-color rounded-xl border border-border mt-4">
           <button onClick={toggleTheme} className="flex items-center gap-2 font-bold text-sm">
             {theme === "light" ? <Moon size={18} /> : <Sun size={18} />} {theme === "light" ? "Dark" : "Light"}
           </button>
           <div className="flex gap-4">
             <button onClick={() => setLanguage("en")} className={language === "en" ? "font-black text-primary" : "text-sm"}>EN</button>
             <button onClick={() => setLanguage("te")} className={language === "te" ? "font-black text-primary" : "text-sm"}>తెలుగు</button>
           </div>
        </div>

        {!user ? (
          <div className="mobile-ai-grid" style={{ marginTop: '16px' }}>
            <NavLink to="/login">{t('login')}</NavLink>
            <NavLink to="/register">{t('register')}</NavLink>
          </div>
        ) : (
          <div className="mobile-user-info glass mt-6">
            {user.photoURL ? <img src={user.photoURL} alt="" className="mobile-profile-avatar" /> : <User size={40} className="profile-icon" />}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{user.displayName || "User"}</h4>
              <small className="text-muted">{user.email}</small>
            </div>
            <button onClick={handleLogout} className="mobile-logout-btn" style={{ padding: '8px 12px', margin: 0, height: 'auto', width: 'auto', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', fontWeight: '700', fontSize: '12px' }}>{t('logout')}</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
