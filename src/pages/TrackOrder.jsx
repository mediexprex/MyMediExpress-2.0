import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import { getOrderById } from "../services/trackOrderService";

import "../styles/track-order.css";

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderId.trim()) {
      alert("Please enter Order ID.");
      return;
    }

    try {
      setLoading(true);
      setNotFound(false);

      const data = await getOrderById(orderId);

      if (data) {
        setOrder(data);
      } else {
        setOrder(null);
        setNotFound(true);
      }

    } catch (error) {
      console.error(error);
      alert("Unable to fetch order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="track-page">

      <div className="container">

        <Card>

          <div className="track-header">

            <FaLocationDot className="track-icon" />

            <h1>Track Your Order</h1>

            <p>
              Enter your Order ID to check the latest status.
            </p>

          </div>

          <form
            className="track-form"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              placeholder="Enter Order ID (Example: MEDI-123456789)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Searching..." : "Track Order"}
            </Button>

          </form>

          {notFound && (
            <div className="not-found">
              ❌ Order not found.
            </div>
          )}

          {order && (
            <div className="order-result">

              <h2>Order Details</h2>

              <div className="result-grid">

                <div>
                  <strong>Order ID</strong>
                  <p>{order.orderId}</p>
                </div>

                <div>
                  <strong>Status</strong>
                  <p>{order.status}</p>
                </div>

                <div>
                  <strong>Customer</strong>
                  <p>{order.customerName}</p>
                </div>

                <div>
                  <strong>Phone</strong>
                  <p>{order.phone}</p>
                </div>

                <div>
                  <strong>City</strong>
                  <p>{order.city}</p>
                </div>

                <div>
                  <strong>Pincode</strong>
                  <p>{order.pincode}</p>
                </div>

                <div>
                  <strong>Address</strong>
                  <p>{order.address}</p>
                </div>

                <div>
                  <strong>Service</strong>
                  <p>{order.service}</p>
                </div>

              </div>

            </div>
          )}

        </Card>

      </div>

    </section>
  );
}

export default TrackOrder;