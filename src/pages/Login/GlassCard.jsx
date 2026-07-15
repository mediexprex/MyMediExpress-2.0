import { motion } from "framer-motion";
import { cardVariants } from "../../animations/loginVariants";

function GlassCard({ children }) {
  return (
    <motion.div
      className="glass-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="glass-overlay"></div>

      <div className="glass-content">
        {children}
      </div>
    </motion.div>
  );
}

export default GlassCard;