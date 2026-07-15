import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

function AccountStats({ stats }) {
  const dashboardStats = stats || {
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
  };

  const cards = [
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders,
      subtitle: "All Orders",
      icon: <FaClipboardList />,
      color: "#2563eb",
    },
    {
      title: "Completed",
      value: dashboardStats.completedOrders,
      subtitle: "Successfully Delivered",
      icon: <FaCheckCircle />,
      color: "#16a34a",
    },
    {
      title: "Pending",
      value: dashboardStats.pendingOrders,
      subtitle: "Processing Orders",
      icon: <FaClock />,
      color: "#f59e0b",
    },
    {
      title: "Cancelled",
      value: dashboardStats.cancelledOrders,
      subtitle: "Cancelled Orders",
      icon: <FaTimesCircle />,
      color: "#dc2626",
    },
  ];

  return (
    <div className="dashboard-grid">
      {cards.map((card, index) => (
        <div
          className="stat-card"
          key={index}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h5>{card.title}</h5>

              <h2>{card.value}</h2>

              <span>{card.subtitle}</span>
            </div>

            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "16px",
                background: `${card.color}15`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: card.color,
                fontSize: "30px",
              }}
            >
              {card.icon}
            </div>
          </div>

          <div
            style={{
              height: "6px",
              borderRadius: "30px",
              background: "#eef2f7",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${
                  Math.min(card.value * 10, 100)
                }%`,
                height: "100%",
                background: card.color,
                borderRadius: "30px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default AccountStats;