import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/quick-order.css";

function QuickOrder() {
  const navigate = useNavigate();
  const [service, setService] = useState("");

  const handleContinue = () => {
    if (service === "medicine") {
      navigate("/order-medicine");
    } else if (service === "lab") {
      navigate("/lab-tests");
    } else if (service === "grocery") {
      navigate("/grocery-delivery");
    }
  };

  return (
    <section className="quick-order">

      <div className="quick-order-container">

        <h2>🚀 Quick Order</h2>

        <p>
          Choose the service you need and continue instantly.
        </p>

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
        >
          <option value="">Select a Service</option>
          <option value="medicine">💊 Medicines</option>
          <option value="lab">🧪 Lab Tests</option>
          <option value="grocery">🛒 Grocery Delivery</option>
        </select>

        <button
          onClick={handleContinue}
          disabled={!service}
        >
          Continue
        </button>

      </div>

    </section>
  );
}

export default QuickOrder;