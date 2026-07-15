import { NavLink } from "react-router-dom";
import { HERO } from "../../utils/constants";
import "../../styles/hero.css";
import logo from "../../assets/logo.png";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-container">

        {/* Left Content */}

        <div className="hero-content">

          <span className="hero-badge">
            🚀 MyMediExpress • Healthcare Delivered to Your Doorstep
          </span>

          <h1 className="hero-title">
            {HERO.title}
          </h1>

          <p className="hero-description">
            {HERO.subtitle}
          </p>

          {/* Trust Strip */}

          <div className="hero-trust-strip">

            <div className="trust-item">
              <strong>50+</strong>
              <span>Happy Customers</span>
            </div>

            <div className="trust-item">
              <strong>10+</strong>
              <span>Partner Pharmacies</span>
            </div>

            <div className="trust-item">
              <strong>24×7</strong>
              <span>Customer Support</span>
            </div>

          </div>

          {/* CTA */}

          <div className="hero-buttons">

            <NavLink
              to="/order-medicine"
              className="hero-primary-btn"
            >
              💊 Order Medicines
            </NavLink>

            <NavLink
              to="/about"
              className="hero-secondary-btn"
            >
              About Us
            </NavLink>

          </div>

          {/* Features */}

          <div className="hero-features">

            <div className="feature-item">
              <span>✅</span>
              <p>Licensed Pharmacies</p>
            </div>

            <div className="feature-item">
              <span>⚡</span>
              <p>Fast Delivery</p>
            </div>

            <div className="feature-item">
              <span>🛡️</span>
              <p>100% Secure Orders</p>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="hero-image">

          <div className="hero-circle"></div>

          <div className="doctor-card">

          <div className="doctor-image">
          <img
          src={logo}
          alt="MyMediExpress"
          className="hero-logo"
          />
          </div>

            <h3>MyMediExpress</h3>

            <p>
              Order medicines, book lab tests and access healthcare
              services from the comfort of your home.
            </p>

          </div>

          <div className="floating-card card-one">
            <h4>50+</h4>
            <p>Orders Delivered</p>
          </div>

          <div className="floating-card card-two">
            <h4>Trusted</h4>
            <p>Healthcare Service</p>
          </div>

          <div className="floating-card card-three">
            <h4>24×7</h4>
            <p>Customer Support</p>
          </div>

        </div>

      </div>

      <div className="scroll-indicator">

        <span>Scroll Down</span>

        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>

      </div>

    </section>
  );
}

export default Hero;