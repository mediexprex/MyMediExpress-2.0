import { motion } from "framer-motion";

import "./Login.css";

import LoginAnimation from "./LoginAnimation";
import GlassCard from "./GlassCard";
import LoginForm from "./LoginForm";

import { formVariants } from "../../animations/loginVariants";

function Login() {
  return (
    <section className="login-page">

      {/* Animated Background */}
      <LoginAnimation />

      {/* Login Card */}
      <motion.div
        className="login-wrapper"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
        }}
      >
        <GlassCard>

          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <LoginForm />
          </motion.div>

        </GlassCard>
      </motion.div>

    </section>
  );
}

export default Login;