import { NavLink } from "react-router-dom";

function OrdersTable({ orders = [] }) {

  const demoOrders = [
    {
      id: "MME100001",
      date: "13 Jul 2026",
      service: "Medicine Order",
      amount: "₹850",
      status: "Completed",
    },
    {
      id: "MME100002",
      date: "12 Jul 2026",
      service: "Lab Test",
      amount: "₹1,250",
      status: "Pending",
    },
    {
      id: "MME100003",
      date: "11 Jul 2026",
      service: "Grocery",
      amount: "₹620",
      status: "Processing",
    },
  ];

  const orderList =
    orders.length > 0
      ? orders
      : demoOrders;

  return (

    <section className="orders-section">

      <div className="orders-header">

        <h3>Recent Orders</h3>

        <NavLink to="/my-orders">

          View All

        </NavLink>

      </div>

      <div style={{ overflowX: "auto" }}>

        <table className="orders-table">

          <thead>

            <tr>

              <th>Order ID</th>

              <th>Date</th>

              <th>Service</th>

              <th>Amount</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {orderList.map((order) => (

              <tr key={order.id}>

                <td>

                  <strong>

                    {order.id}

                  </strong>

                </td>

                <td>

                  {order.date}

                </td>

                <td>

                  {order.service}

                </td>

                <td>

                  {order.amount}

                </td>

                <td>

                  <span
                    className={`status ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>

                </td>

                <td>

                  <NavLink
                    to={`/track-order?id=${order.id}`}
                    className="account-btn"
                    style={{
                      padding: "8px 14px",
                      fontSize: "14px",
                    }}
                  >

                    Track

                  </NavLink>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </section>

  );

}

export default OrdersTable;