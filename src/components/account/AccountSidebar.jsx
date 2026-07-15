import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaChartPie,
  FaBoxOpen,
  FaPills,
  FaFlask,
  FaShoppingBasket,
  FaMapMarkerAlt,
  FaUserEdit,
  FaRobot,
  FaSignOutAlt,
} from "react-icons/fa";

import { logoutUser } from "../../services/authService";

function AccountSidebar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    try {
      await logoutUser();

      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Unable to logout.");
    }
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/my-account",
      icon: <FaChartPie />,
    },
    {
      title: "My Orders",
      path: "/my-orders",
      icon: <FaBoxOpen />,
    },
    {
      title: "Medicine Orders",
      path: "/order-medicine",
      icon: <FaPills />,
    },
    {
      title: "Lab Tests",
      path: "/lab-tests",
      icon: <FaFlask />,
    },
    {
      title: "Groceries",
      path: "/grocery-delivery",
      icon: <FaShoppingBasket />,
    },
    {
      title: "Saved Address",
      path: "/saved-address",
      icon: <FaMapMarkerAlt />,
    },
    {
      title: "Profile",
      path: "/profile",
      icon: <FaUserEdit />,
    },
    {
      title: "AI Assistant",
      path: "/ai-assistant",
      icon: <FaRobot />,
    },
  ];

  return (
    <aside className="account-sidebar">

      <div className="sidebar-user">

        <div className="sidebar-avatar">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <FaUserCircle size={70} />
          )}
        </div>

        <h3>
          {user?.name || "MyMediExpress User"}
        </h3>

        <p>
          {user?.email || "user@email.com"}
        </p>

      </div>

      <nav className="sidebar-menu">

        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            {item.icon}

            <span>{item.title}</span>

          </NavLink>
        ))}

      </nav>

      <div style={{ marginTop: "30px" }}>

        <button
          className="account-btn"
          style={{
            width: "100%",
            background: "#dc2626",
          }}
          onClick={handleLogout}
        >
          <FaSignOutAlt
            style={{
              marginRight: "10px",
            }}
          />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default AccountSidebar;