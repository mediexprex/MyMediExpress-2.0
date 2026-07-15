import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllOrders,
  updateOrderStatus,
} from "../services/adminService";

import { logoutAdmin } from "../services/authService";

import "../styles/admin.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const [loggingOut, setLoggingOut] = useState(false);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await getAllOrders();

      setOrders(data);

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {

    if (!window.confirm("Logout from Admin Dashboard?"))
      return;

    try {

      setLoggingOut(true);

      await logoutAdmin();

      navigate("/admin/login", {
        replace: true,
      });

    } catch (error) {

      alert("Logout Failed.");

    } finally {

      setLoggingOut(false);

    }
  }

  async function handleStatusChange(id, status) {

    try {

      await updateOrderStatus(id, status);

      setOrders((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      );

      if (
        selectedOrder &&
        selectedOrder.id === id
      ) {
        setSelectedOrder({
          ...selectedOrder,
          status,
        });
      }

    } catch (error) {

      console.error(error);

      alert("Unable to update status.");

    }

  }

  function openOrder(order) {

    setSelectedOrder(order);

    setShowModal(true);

  }

  function closeOrder() {

    setShowModal(false);

    setSelectedOrder(null);

  }

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (o) => o.status === "Processing"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const cancelledOrders = orders.filter(
    (o) => o.status === "Cancelled"
  ).length;

  const filteredOrders = useMemo(() => {

    return orders.filter((order) => {

      const keyword = search.toLowerCase();

      const matchesSearch =
        order.customerName
          ?.toLowerCase()
          .includes(keyword) ||
        order.phone?.includes(keyword) ||
        order.city
          ?.toLowerCase()
          .includes(keyword) ||
        order.orderId
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        statusFilter === "All"
          ? true
          : order.status === statusFilter;

      return matchesSearch && matchesStatus;

    });

  }, [orders, search, statusFilter]);

  return (

    <div className="admin-dashboard">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <h1>MyMedi Express Admin CRM</h1>

          <p>
            Manage Orders, Customers &
            Deliveries
          </p>

        </div>

        <button
          className="logout-btn"
          disabled={loggingOut}
          onClick={handleLogout}
        >
          {loggingOut
            ? "Logging Out..."
            : "Logout"}
        </button>

      </div>

      {/* DASHBOARD STATS */}

      <div className="dashboard-stats">

        <div className="stat-card">
          <h2>{totalOrders}</h2>
          <span>Total Orders</span>
        </div>

        <div className="stat-card pending">
          <h2>{pendingOrders}</h2>
          <span>Pending</span>
        </div>

        <div className="stat-card processing">
          <h2>{processingOrders}</h2>
          <span>Processing</span>
        </div>

        <div className="stat-card delivered">
          <h2>{deliveredOrders}</h2>
          <span>Delivered</span>
        </div>

        <div className="stat-card cancelled">
          <h2>{cancelledOrders}</h2>
          <span>Cancelled</span>
        </div>

      </div>
      {/* SEARCH & FILTER */}

      <div className="orders-toolbar">

        <input
          type="text"
          className="search-input"
          placeholder="Search Order ID / Customer / Phone / City..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option value="All">
            All Orders
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Processing">
            Processing
          </option>

          <option value="Delivered">
            Delivered
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

      </div>

      {/* ORDERS TABLE */}

      <div className="orders-table-wrapper">

        <table className="orders-table">

          <thead>

            <tr>

              <th>Order ID</th>

              <th>Customer</th>

              <th>Phone</th>

              <th>City</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="6"
                  className="empty-row"
                >
                  Loading Orders...

                </td>

              </tr>

            ) : filteredOrders.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="empty-row"
                >
                  No Orders Found

                </td>

              </tr>

            ) : (

              filteredOrders.map((order) => (

                <tr key={order.id}>

                  <td>{order.orderId}</td>

                  <td>{order.customerName}</td>

                  <td>{order.phone}</td>

                  <td>{order.city}</td>

                  <td>

                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </td>

                  <td>

                    <button
                      className="view-btn"
                      onClick={() =>
                        openOrder(order)
                      }
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>
      {/* ORDER DETAILS MODAL */}

      {showModal && selectedOrder && (

        <div
          className="modal-overlay"
          onClick={closeOrder}
        >

          <div
            className="order-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <h2>Order Details</h2>

              <button
                className="close-btn"
                onClick={closeOrder}
              >
                ✕
              </button>

            </div>

            <div className="modal-body">

              <div className="detail-row">
                <strong>Order ID</strong>
                <span>{selectedOrder.orderId}</span>
              </div>

              <div className="detail-row">
                <strong>Customer</strong>
                <span>{selectedOrder.customerName}</span>
              </div>

              <div className="detail-row">
                <strong>Phone</strong>
                <span>{selectedOrder.phone}</span>
              </div>

              <div className="detail-row">
                <strong>Alternate Phone</strong>
                <span>
                  {selectedOrder.alternatePhone || "-"}
                </span>
              </div>

              <div className="detail-row">
                <strong>Email</strong>
                <span>
                  {selectedOrder.email || "-"}
                </span>
              </div>

              <div className="detail-row">
                <strong>Address</strong>
                <span>
                  {selectedOrder.address}
                </span>
              </div>

              <div className="detail-row">
                <strong>Landmark</strong>
                <span>
                  {selectedOrder.landmark || "-"}
                </span>
              </div>

              <div className="detail-row">
                <strong>City</strong>
                <span>{selectedOrder.city}</span>
              </div>

              <div className="detail-row">
                <strong>Pincode</strong>
                <span>{selectedOrder.pincode}</span>
              </div>

              <div className="detail-row">
                <strong>Status</strong>

                <span
                  className={`status-badge ${selectedOrder.status?.toLowerCase()}`}
                >
                  {selectedOrder.status}
                </span>

              </div>

              <div className="detail-row">
                <strong>Notes</strong>

                <span>
                  {selectedOrder.notes || "-"}
                </span>

              </div>

              <div className="detail-row">

                <strong>Prescription</strong>

                {selectedOrder.prescriptionUrl ? (

                  <a
                    href={selectedOrder.prescriptionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prescription-link"
                  >
                    View Prescription
                  </a>

                ) : (

                  <span>
                    {selectedOrder.prescriptionName ||
                      "Not Uploaded"}
                  </span>

                )}

              </div>

            </div>

            <div className="modal-footer">

              <button
                className="close-modal-btn"
                onClick={closeOrder}
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default AdminDashboard;