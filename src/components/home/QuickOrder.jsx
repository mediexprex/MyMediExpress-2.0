import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Pill, FlaskConical, ShoppingCart, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/quick-order.css";

function QuickOrder() {
  const navigate = useNavigate();
  const [service, setService] = useState("");

  const handleContinue = () => {
    if (service === "medicine") navigate("/order-medicine");
    else if (service === "lab") navigate("/lab-tests");
    else if (service === "grocery") navigate("/grocery-delivery");
  };

  return (
    <section className="quick-order">
      <div className="quick-order-container">

        <div className="quick-header text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="quick-icon-box mx-auto mb-6"
          >
            <Zap size={32} />
          </motion.div>
          <h2 className="text-4xl font-black mb-4">Quick <span>Transmission</span></h2>
          <p className="text-muted font-medium">Select a fulfillment node to initiate instant clinical support.</p>
        </div>

        <div className="quick-interface card glass p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { id: 'medicine', icon: <Pill />, label: 'Medicines', color: 'var(--primary-color)' },
              { id: 'lab', icon: <FlaskConical />, label: 'Lab Tests', color: 'var(--secondary-color)' },
              { id: 'grocery', icon: <ShoppingCart />, label: 'Groceries', color: 'var(--accent-color)' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setService(item.id)}
                className={`node-selector ${service === item.id ? 'active' : ''}`}
                style={{ '--node-color': item.color }}
              >
                <div className="node-icon">{item.icon}</div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <button
            className="btn-primary w-full py-6 text-sm"
            onClick={handleContinue}
            disabled={!service}
          >
            {service ? `INITIALIZE ${service.toUpperCase()} PROTOCOL` : 'SELECT SERVICE NODE'} <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}

export default QuickOrder;
