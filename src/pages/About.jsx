import {
  FaHeart,
  FaTruckMedical,
  FaUserDoctor,
  FaShieldHeart,
  FaClock,
  FaPhoneVolume,
} from "react-icons/fa6";

import logo from "../assets/logo.png";

import "../styles/about.css";

function About() {
  return (
    <section className="about-page">

      {/* Hero Section */}

      <div className="about-hero">

        <img
          src={logo}
          alt="MyMediExpress Logo"
          className="about-logo"
        />

        <h1>About MyMediExpress</h1>

        <p>
          Your trusted healthcare partner delivering medicines,
          lab tests and essential healthcare services directly
          to your doorstep with speed, reliability and care.
        </p>

      </div>

      {/* About Company */}

      <div className="about-section">

        <h2>Who We Are</h2>

        <p>
          <strong>MyMediExpress</strong> is a modern healthcare
          delivery platform committed to making healthcare
          accessible, affordable and convenient for everyone.

          We connect customers with trusted pharmacies,
          diagnostic laboratories and healthcare providers to
          ensure timely delivery of medicines and health
          services.

          Our goal is to simplify healthcare by providing
          technology-driven solutions with exceptional customer
          support.
        </p>

      </div>

      {/* Mission & Vision */}

      <div className="about-grid">

        <div className="about-card">

          <FaHeart className="about-icon" />

          <h3>Our Mission</h3>

          <p>
            To provide quick, reliable and affordable healthcare
            services while improving people's lives through
            technology and trusted medical partnerships.
          </p>

        </div>

        <div className="about-card">

          <FaShieldHeart className="about-icon" />

          <h3>Our Vision</h3>

          <p>
            To become India's most trusted healthcare delivery
            platform by offering seamless medicine delivery,
            diagnostics and digital healthcare services.
          </p>

        </div>

      </div>

      {/* Why Choose */}

      <div className="about-section">

        <h2>Why Choose MyMediExpress?</h2>

        <div className="features-grid">

          <div className="feature-box">
            <FaTruckMedical />
            <span>Fast Medicine Delivery</span>
          </div>

          <div className="feature-box">
            <FaUserDoctor />
            <span>Trusted Healthcare Partners</span>
          </div>

          <div className="feature-box">
            <FaClock />
            <span>Quick Order Processing</span>
          </div>

          <div className="feature-box">
            <FaPhoneVolume />
            <span>Dedicated Customer Support</span>
          </div>

        </div>

      </div>

      {/* Services */}

      <div className="about-section">

        <h2>Our Healthcare Services</h2>

        <div className="features-grid">

          <div className="feature-box">
            💊
            <span>Medicine Delivery</span>
          </div>

          <div className="feature-box">
            🧪
            <span>Lab Test Booking</span>
          </div>

          <div className="feature-box">
            🤖
            <span>AI Health Assistant</span>
          </div>

          <div className="feature-box">
            📦
            <span>Healthcare Home Delivery</span>
          </div>

        </div>

      </div>

      {/* Values */}

      <div className="about-section">

        <h2>Our Core Values</h2>

        <div className="about-grid">

          <div className="about-card">
            ❤️
            <h3>Care</h3>
            <p>
              Every customer deserves compassionate and reliable
              healthcare support.
            </p>
          </div>

          <div className="about-card">
            ⚡
            <h3>Speed</h3>
            <p>
              Fast delivery and quick response whenever you need
              healthcare assistance.
            </p>
          </div>

          <div className="about-card">
            🔒
            <h3>Trust</h3>
            <p>
              Secure, transparent and dependable healthcare
              services.
            </p>
          </div>

          <div className="about-card">
            🌍
            <h3>Accessibility</h3>
            <p>
              Bringing quality healthcare closer to every family.
            </p>
          </div>

        </div>

      </div>

      {/* CTA */}

      <div className="about-cta">

        <h2>Your Health, Our Priority ❤️</h2>

        <p>
          Thank you for choosing MyMediExpress.
          We are committed to delivering quality healthcare
          services with trust, technology and care.
        </p>

      </div>

    </section>
  );
}

export default About;