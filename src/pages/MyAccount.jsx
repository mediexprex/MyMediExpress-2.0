import { Link } from "react-router-dom";
import {
  FaUserCircle,
  FaPills,
  FaFlask,
  FaShoppingBasket,
  FaClipboardList,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

import "./MyAccount.css";

function MyAccount() {
  return (
    <section className="myaccount-page">

      <div className="myaccount-container">

        {/* Header */}

        <div className="account-header">

          <div className="account-avatar">
            <FaUserCircle />
          </div>

          <div>

            <h2>Welcome 👋</h2>

            <h3>MyMediExpress User</h3>

            <p>Healthcare made simple.</p>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="dashboard-grid">

          <Link
            to="/order-medicine"
            className="dashboard-card"
          >
            <FaPills />

            <h4>Order Medicine</h4>

            <p>Upload prescription & order medicines.</p>

          </Link>

          <Link
            to="/lab-tests"
            className="dashboard-card"
          >
            <FaFlask />

            <h4>Book Lab Test</h4>

            <p>Book blood tests from home.</p>

          </Link>

          <Link
            to="/grocery-delivery"
            className="dashboard-card"
          >
            <FaShoppingBasket />

            <h4>Order Grocery</h4>

            <p>Daily essentials delivered fast.</p>

          </Link>

          <Link
            to="/my-orders"
            className="dashboard-card"
          >
            <FaClipboardList />

            <h4>My Orders</h4>

            <p>Track all your orders.</p>

          </Link>

        </div>

        {/* Profile Card */}

        <div className="profile-card">

          <h3>Profile Information</h3>

          <div className="profile-item">

            <FaUserCircle />

            <span>Name</span>

            <strong>MyMediExpress User</strong>

          </div>

          <div className="profile-item">

            <FaPhoneAlt />

            <span>Mobile</span>

            <strong>Not Added</strong>

          </div>

          <div className="profile-item">

            <FaMapMarkerAlt />

            <span>Address</span>

            <strong>Add your delivery address</strong>

          </div>

          <Link
            to="/profile"
            className="edit-profile-btn"
          >
            Edit Profile
          </Link>

        </div>

      </div>

    </section>
  );
}

export default MyAccount;