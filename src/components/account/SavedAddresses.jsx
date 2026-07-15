import { FaHome, FaBriefcase, FaHospital, FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function SavedAddresses({ addresses = [] }) {

  const demoAddresses = [
    {
      id: 1,
      type: "Home",
      icon: <FaHome />,
      name: "Home",
      address:
        "Door No. 12-34, Tanuku, West Godavari, Andhra Pradesh - 534211",
    },
    {
      id: 2,
      type: "Office",
      icon: <FaBriefcase />,
      name: "Office",
      address:
        "MyMediExpress Office, Tanuku, Andhra Pradesh - 534211",
    },
    {
      id: 3,
      type: "Hospital",
      icon: <FaHospital />,
      name: "Hospital",
      address:
        "Government Hospital, Tanuku, Andhra Pradesh - 534211",
    },
  ];

  const addressList =
    addresses.length > 0 ? addresses : demoAddresses;

  return (
    <section className="orders-section">

      <div className="orders-header">

        <h3>Saved Addresses</h3>

        <NavLink
          to="/saved-address"
          className="account-btn"
        >
          <FaPlus
            style={{ marginRight: "8px" }}
          />

          Add Address
        </NavLink>

      </div>

      <div className="address-grid">

        {addressList.map((item) => (

          <div
            className="address-card"
            key={item.id}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "18px",
              }}
            >

              <div
                style={{
                  width: "55px",
                  height: "55px",
                  borderRadius: "50%",
                  background: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "22px",
                }}
              >
                {item.icon}
              </div>

              <div>

                <h4>{item.name}</h4>

                <span
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                  }}
                >
                  {item.type}
                </span>

              </div>

            </div>

            <p>{item.address}</p>

            <div
              style={{
                marginTop: "22px",
                display: "flex",
                gap: "10px",
              }}
            >

              <button
                className="account-btn-outline"
              >
                Edit
              </button>

              <button
                className="account-btn"
                style={{
                  background: "#dc2626",
                }}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default SavedAddresses;