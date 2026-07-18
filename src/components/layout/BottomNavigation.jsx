import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Zap, ShoppingCart, Activity, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const BottomNavigation = () => {
  const { t } = useLanguage();

  return (
    <nav className="bottom-nav glass">
      <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} />
        <span>{t('home')}</span>
      </NavLink>
      <NavLink to="/ai-dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <Zap size={22} />
        <span>{t('aiHealth')}</span>
      </NavLink>

      <div className="bottom-nav-item fab-placeholder">
        {/* Placeholder for the overlapping FAB button */}
      </div>

      <NavLink to="/lab-tests" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <Activity size={22} />
        <span>Labs</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
        <User size={22} />
        <span>{t('profile')}</span>
      </NavLink>

      <style dangerouslySetInnerHTML={{ __html: `
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 72px;
          display: none;
          justify-content: space-around;
          align-items: stretch;
          z-index: 1000;
          padding-bottom: env(safe-area-inset-bottom);
          box-shadow: 0 -10px 40px rgba(0,0,0,0.06);
          border-top: 1px solid var(--border-color);
        }

        @media (max-width: 992px) {
          .bottom-nav {
            display: flex;
          }
        }

        .bottom-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 10px;
          font-weight: 700;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
          gap: 4px;
        }

        .bottom-nav-item.active {
          color: var(--primary-color);
        }

        .bottom-nav-item.active svg {
          transform: translateY(-2px);
          filter: drop-shadow(0 4px 6px rgba(16, 185, 129, 0.2));
        }

        .fab-placeholder {
          pointer-events: none;
        }
      `}} />
    </nav>
  );
};

export default BottomNavigation;
