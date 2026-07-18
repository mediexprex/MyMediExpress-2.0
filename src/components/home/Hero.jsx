import { NavLink } from "react-router-dom";
import { HERO } from "../../utils/constants";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Clock, ChevronRight, Package, HeartPulse } from "lucide-react";
import "../../styles/hero.css";
import logo from "../../assets/logo.png";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-container">

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="hero-content"
        >
          <span className="hero-badge">
            <HeartPulse size={14} className="text-primary" /> MyMediExpress • Next-Gen Healthcare Logistics
          </span>

          <h1 className="hero-title">
            {HERO.title}
          </h1>

          <p className="hero-description">
            {HERO.subtitle}
          </p>

          <div className="hero-trust-strip">
            <div className="trust-item">
              <strong>50+</strong>
              <span>Verified Nodes</span>
            </div>
            <div className="trust-item">
              <strong>10+</strong>
              <span>Clinical Partners</span>
            </div>
            <div className="trust-item">
              <strong>24×7</strong>
              <span>Live Support</span>
            </div>
          </div>

          <div className="hero-buttons">
            <NavLink to="/order-medicine" className="btn-primary">
              💊 Order Medicines <ChevronRight size={18} />
            </NavLink>
            <NavLink to="/about" className="btn-secondary">
              About Platform
            </NavLink>
          </div>

          <div className="hero-features-new">
            <div className="feat-item">
               <ShieldCheck size={18} className="text-primary" />
               <span>Licensed Pharmacies</span>
            </div>
            <div className="feat-item">
               <Zap size={18} className="text-secondary" />
               <span>Rapid Delivery</span>
            </div>
            <div className="feat-item">
               <Clock size={18} className="text-accent" />
               <span>Order Confirmation</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="hero-image-v2"
        >
          <div className="hero-visual-main">
            <div className="visual-glow"></div>
            <div className="visual-card glass">
              <div className="visual-logo-box">
                <img src={logo} alt="MyMediExpress" />
              </div>
              <h3 className="font-black text-xl mb-4">Clinical Hub</h3>
              <p className="text-muted text-sm font-medium leading-relaxed">
                Order medicines, book lab tests and access premium AI healthcare
                services from our centralized logistics terminal.
              </p>
            </div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="float-stat s1 shadow-premium"
            >
               <Package size={20} className="text-primary" />
               <div>
                  <strong>50+</strong>
                  <span>Fulfillments</span>
               </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="float-stat s2 shadow-premium"
            >
               <ShieldCheck size={20} className="text-secondary" />
               <div>
                  <strong>Trusted</strong>
                  <span>Verification</span>
               </div>
            </motion.div>
          </div>
        </motion.div>

      </div>

      <div className="scroll-hint">
        <div className="mouse"></div>
      </div>
    </section>
  );
}

export default Hero;
