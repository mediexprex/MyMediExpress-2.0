import React, { useEffect, useState } from "react";
import { listenUserOrders } from "../services/orderService";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import "../styles/my-orders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribeOrders = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        unsubscribeOrders = listenUserOrders(currentUser.uid, (data) => {
          setOrders(data);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeOrders();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Fetching your healthcare orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h2>Authentication Required</h2>
        <p>Please login to view and track your orders.</p>
        <Link to="/login" className="btn-primary mt-4">Login Now</Link>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <header className="page-header">
          <h1>📦 My Orders</h1>
          <p className="subtitle">Realtime tracking of your medical fulfillments</p>
        </header>

        {orders.length === 0 ? (
          <div className="no-orders card">
            <p>You haven't placed any orders yet.</p>
            <Link to="/order-medicine" className="btn-primary mt-4">Order Medicine</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card card">
                <div className="order-header">
                  <div className="id-group">
                    <span className="label">Order ID</span>
                    <span className="order-id">{order.orderId}</span>
                  </div>
                  <div className={`order-status status-${(order.orderStatus || order.status).toLowerCase().replace(/ /g, '-')}`}>
                    {order.orderStatus || order.status}
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-info">
                    <div className="info-item">
                      <strong>Patient:</strong> {order.customerName}
                    </div>
                    <div className="info-item">
                      <strong>Date:</strong> {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Processing...'}
                    </div>
                    <div className="info-item">
                      <strong>Location:</strong> {order.address}, {order.city}
                    </div>
                  </div>

                  <div className="order-actions">
                    {order.prescriptionURL && (
                      <a href={order.prescriptionURL} target="_blank" rel="noreferrer" className="btn-secondary text-sm">
                        Prescription
                      </a>
                    )}
                    <Link to={`/track-order?id=${order.orderId}`} className="btn-primary text-sm">
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
