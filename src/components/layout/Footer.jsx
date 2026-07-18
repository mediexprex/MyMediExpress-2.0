import { Link } from "react-router-dom";
import { HeartPulse, Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-grid">

          <div className="footer-brand">
            <div className="brand-logo">
              <HeartPulse className="text-primary" size={32} />
              <span className="brand-name">Medi<span>Express</span></span>
            </div>
            <p className="brand-desc">
              Your trusted partner for pharmaceutical fulfillment and chronological health monitoring. Synchronized with the global medical logistics network.
            </p>
            <div className="social-links">
              <a href="#" className="social-btn"><Instagram size={18} /></a>
              <a href="#" className="social-btn"><Twitter size={18} /></a>
              <a href="#" className="social-btn"><Facebook size={18} /></a>
              <a href="#" className="social-btn"><Linkedin size={18} /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Clinical Services</h4>
            <ul>
              <li><Link to="/medicine-delivery">Medicine Delivery</Link></li>
              <li><Link to="/lab-tests">Diagnostic Booking</Link></li>
              <li><Link to="/order-medicine">Submit Prescription</Link></li>
              <li><Link to="/track-order">Track Fulfillment</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4>Health AI</h4>
            <ul>
              <li><Link to="/ai-dashboard">Bio-Dashboard</Link></li>
              <li><Link to="/medicine-reminder">MedSchedule AI</Link></li>
              <li><Link to="/symptom-tracker">SymptomFlow AI</Link></li>
              <li><Link to="/body-3d">BioExplorer 3D</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Node</h4>
            <div className="contact-item">
              <Phone size={16} className="text-primary" />
              <span>+91 89859 99562</span>
            </div>
            <div className="contact-item">
              <Mail size={16} className="text-primary" />
              <span>support@mymediexpress.in</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} className="text-primary" />
              <span>Medical Logistics Hub, AP, India</span>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 MediExpress Logistics. Controlled by Central Terminal.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Protocol</Link>
            <Link to="/terms-conditions">Terms of Service</Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .main-footer {
          background-color: #0f172a;
          color: white;
          padding: 80px 0 40px;
          margin-top: auto;
          position: relative;
          z-index: 100;
        }

        .footer-container {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 25px;
        }

        .brand-name {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .brand-name span {
          color: var(--primary-color);
        }

        .brand-desc {
          color: #94a3b8;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 30px;
          max-width: 320px;
        }

        .social-links {
          display: flex;
          gap: 15px;
        }

        .social-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          color: #94a3b8;
        }

        .social-btn:hover {
          background-color: var(--primary-color);
          color: white;
          transform: translateY(-3px);
        }

        .footer-links-group h4, .footer-contact h4 {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 30px;
          color: white;
        }

        .footer-links-group ul {
          list-style: none;
          padding: 0;
        }

        .footer-links-group ul li {
          margin-bottom: 15px;
        }

        .footer-links-group ul li a {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .footer-links-group ul li a:hover {
          color: var(--primary-color);
          padding-left: 5px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
        }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #64748b;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .footer-bottom {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }
        }

        .footer-bottom-links {
          display: flex;
          gap: 30px;
        }

        .footer-bottom-links a:hover {
          color: white;
        }
      `}} />
    </footer>
  );
}

export default Footer;
