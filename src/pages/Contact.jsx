import "../styles/pages.css";
import {
  FaPhone,
  FaWhatsapp,
  FaLocationDot,
  FaEnvelope,
} from "react-icons/fa6";

import "../styles/pages.css";

function Contact() {
  return (
    <section className="page-section">

      <div className="page-container">

        <h1>Contact MyMedi Express</h1>

        <p className="page-subtitle">
          We're always here to help you with medicines, lab tests and grocery
          delivery.
        </p>

        <div className="contact-grid">

          <div className="contact-card">

            <FaPhone className="contact-icon" />

            <h3>Phone Number</h3>

            <p>+91 8985999562</p>

          </div>

          <div className="contact-card">

            <FaWhatsapp className="contact-icon" />

            <h3>WhatsApp</h3>

            <a
              href="https://wa.me/918985999562"
              target="_blank"
              rel="noreferrer"
            >
              Chat with us
            </a>

          </div>

          <div className="contact-card">

            <FaLocationDot className="contact-icon" />

            <h3>Service Areas</h3>

            <p>
              Tanuku <br />
              Bhimavaram <br />
              Tadepalligudem
            </p>

          </div>

          <div className="contact-card">

            <FaEnvelope className="contact-icon" />

            <h3>Email</h3>

            <p>support@mymediexpress.in</p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Contact;