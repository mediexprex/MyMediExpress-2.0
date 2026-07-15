import { motion } from "framer-motion";

import logo from "../../assets/login/logo.svg";
import medicineBox from "../../assets/login/medicine-box.png";

import {
  logoVariants,
  boxVariants,
  backgroundVariants,
} from "../../animations/loginVariants";

function LoginAnimation() {
  return (
    <div className="login-animation">

      {/* Animated Background Circles */}

      <motion.div
        className="bg-circle bg-circle-1"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.div
        className="bg-circle bg-circle-2"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      />

      <motion.div
        className="bg-circle bg-circle-3"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Logo */}

      <motion.div
        className="login-logo"
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src={logo}
          alt="MyMediExpress Logo"
        />
      </motion.div>

      {/* Medicine Box */}

      <motion.div
        className="medicine-box"
        variants={boxVariants}
        initial="hidden"
        animate="visible"
      >
        <img
          src={medicineBox}
          alt="Medicine Box"
        />
      </motion.div>

    </div>
  );
}

export default LoginAnimation;