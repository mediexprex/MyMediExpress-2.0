import { useMemo } from "react";
import { FaBell, FaCalendarAlt } from "react-icons/fa";

function AccountHeader({ user }) {

  const today = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="account-header">

      <div>

        <h1>
          My Account
        </h1>

        <p>
          Welcome back,
          <strong>
            {" "}
            {user?.name || "User"}
          </strong>
        </p>

        <p>
          Manage your medicines, lab tests, grocery
          orders and profile from one place.
        </p>

      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >

        {/* Notification */}

        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: "#eff6ff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          <FaBell />
        </div>

        {/* Date */}

        <div className="account-date">

          <FaCalendarAlt />

          <span
            style={{
              marginLeft: "10px",
            }}
          >
            {today}
          </span>

        </div>

      </div>

    </div>
  );
}

export default AccountHeader;