import { NavLink } from "react-router-dom";
import "../../styles/quickactions.css";

const actions = [
  {
    title: "Order Medicines",
    description: "Upload your prescription and get medicines delivered quickly.",
    icon: "💊",
    path: "/order-medicine",
  },
  {
    title: "Book Lab Test",
    description: "Schedule lab tests with convenient home sample collection.",
    icon: "🧪",
    path: "/lab-tests",
  },
  {
    title: "Grocery Delivery",
    description: "Order daily essentials and groceries from nearby stores.",
    icon: "🛒",
    path: "/grocery-delivery",
  },
  {
    title: "Track Order",
    description: "Check the live status of your medicine or grocery order.",
    icon: "📍",
    path: "/track-order",
  },
];

function QuickActions() {
  return (
    <section className="quick-actions">
      <div className="quick-actions-container">
        <div className="section-heading">
          <span className="section-badge">Quick Access</span>

          <h2>Everything You Need, Just One Click Away</h2>

          <p>
            Access our most popular healthcare services instantly with a single
            click.
          </p>
        </div>

        <div className="actions-grid">
          {actions.map((action) => (
            <NavLink
              key={action.title}
              to={action.path}
              className="action-card"
            >
              <div className="action-icon">
                {action.icon}
              </div>

              <h3>{action.title}</h3>

              <p>{action.description}</p>

              <span className="action-link">
                Explore →
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export default QuickActions;