import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageCircle, Camera, ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    { icon: <ShoppingCart size={20} />, label: "Order", path: "/order-medicine", color: "#10B981" },
    { icon: <Camera size={20} />, label: "Scan", path: "/scanner-ocr", color: "#3B82F6" },
    { icon: <MessageCircle size={20} />, label: "AI Help", path: "/ai-assistant", color: "#A855F7" },
  ];

  return (
    <div className="fab-wrapper">
      <AnimatePresence>
        {isOpen && (
          <div className="fab-menu">
            {actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: 20 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
                className="fab-action-item"
                onClick={() => {
                  navigate(action.path);
                  setIsOpen(false);
                }}
              >
                <span className="fab-label glass">{action.label}</span>
                <div className="fab-icon-small" style={{ backgroundColor: action.color }}>
                  {action.icon}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        className={`fab-main ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Quick Actions"
      >
        {isOpen ? <X size={28} /> : <Plus size={28} />}
      </button>

      <style dangerouslySetInnerHTML={{ __html: `
        .fab-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1005;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        @media (max-width: 992px) {
          .fab-wrapper {
            bottom: 34px;
            right: 50%;
            transform: translateX(50%);
            align-items: center;
          }

          .fab-menu {
             align-items: center !important;
          }
        }

        .fab-main {
          width: 60px;
          height: 60px;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.4);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .fab-main.active {
          transform: rotate(0deg);
          background: #EF4444;
          box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
        }

        .fab-main:active {
          transform: scale(0.92);
        }

        .fab-menu {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 24px;
        }

        .fab-action-item {
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
        }

        .fab-icon-small {
          width: 52px;
          height: 52px;
          border-radius: 16px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s ease;
        }

        .fab-action-item:hover .fab-icon-small {
          transform: scale(1.1);
        }

        .fab-label {
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 800;
          color: var(--text-main);
          box-shadow: var(--shadow-sm);
        }
      `}} />
    </div>
  );
};

export default FloatingActionButton;
