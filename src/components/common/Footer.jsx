import { NavLink } from "react-router-dom";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaArrowUp,
} from "react-icons/fa";

import "../../styles/footer.css";

function Footer() {

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Company */}

        <div className="footer-column">

          <h2>💙 MyMediExpress</h2>

          <p>
            Your trusted healthcare partner for medicines,
            lab tests and grocery delivery. Fast, reliable
            and secure doorstep services.
          </p>

        </div>

        {/* Quick Links */}

        <div className="footer-column">

          <h3>Quick Links</h3>

          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/contact">Contact</NavLink>

        </div>

        {/* Services */}

        <div className="footer-column">

          <h3>Our Services</h3>

          <NavLink to="/order-medicine">
            💊 Medicines
          </NavLink>

          <NavLink to="/lab-tests">
            🧪 Lab Tests
          </NavLink>

          <NavLink to="/grocery-delivery">
            🛒 Grocery Delivery
          </NavLink>

          <NavLink to="/track-order">
            📦 Track Order
          </NavLink>

        </div>

        {/* Contact */}

        <div className="footer-column">

          <h3>Contact Us</h3>

          <a href="tel:+918985999562">
            <FaPhoneAlt />
            <span>8985999562</span>
          </a>

          <a
            href="https://wa.me/918985999562"
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>

          <a
            href="https://instagram.com/mymediexpress"
            target="_blank"
            rel="noreferrer"
          >
            <FaInstagram />
            <span>Instagram</span>
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
          >
            <FaFacebookF />
            <span>Facebook</span>
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
          >
            <FaLinkedinIn />
            <span>LinkedIn</span>
          </a>

        </div>

      </div>

      {/* Bottom */}

      <div className="footer-bottom">

        <p>
          © 2026 <strong>MyMediExpress</strong>. All Rights Reserved.
        </p>

        <button
          className="back-top"
          onClick={scrollTop}
        >
          <FaArrowUp />
        </button>

      </div>

    </footer>
  );
}

export default Footer;