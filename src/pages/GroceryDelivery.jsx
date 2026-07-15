function GroceryDelivery() {

  const phone = "918985999562";

  const message = encodeURIComponent(`Hi MyMediExpress,

I want to order Groceries.

Name:
Mobile:
Address:
Required Items:
Preferred Delivery Time:
`);

  return (
    <div className="page-container">

      {/* Hero */}

      <section className="service-hero">

        <h1>🛒 Grocery Delivery</h1>

        <p>
          Fresh groceries, vegetables, fruits, dairy products,
          household essentials and daily needs delivered to
          your doorstep quickly and safely.
        </p>

        <a
          href={`https://wa.me/${phone}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="service-btn"
        >
          📲 Order on WhatsApp
        </a>

      </section>

      {/* Categories */}

      <section className="service-section">

        <h2>Available Categories</h2>

        <div className="service-grid">

          <div className="service-card">
            🥦
            <h3>Fresh Vegetables</h3>
            <p>Farm fresh vegetables delivered daily.</p>
          </div>

          <div className="service-card">
            🍎
            <h3>Fresh Fruits</h3>
            <p>Seasonal fruits with quality assurance.</p>
          </div>

          <div className="service-card">
            🥛
            <h3>Dairy Products</h3>
            <p>Milk, Curd, Butter, Paneer and more.</p>
          </div>

          <div className="service-card">
            🍚
            <h3>Rice & Groceries</h3>
            <p>Rice, Oils, Pulses and daily essentials.</p>
          </div>

          <div className="service-card">
            🧴
            <h3>Home Essentials</h3>
            <p>Cleaning products & household items.</p>
          </div>

          <div className="service-card">
            🍪
            <h3>Snacks & Beverages</h3>
            <p>Biscuits, Juices, Soft drinks and more.</p>
          </div>

        </div>

      </section>

      {/* Benefits */}

      <section className="service-section">

        <h2>Why Choose MyMediExpress?</h2>

        <ul className="benefits-list">
          <li>✅ Same Day Delivery (Selected Areas)</li>
          <li>✅ Fresh & Quality Products</li>
          <li>✅ Affordable Prices</li>
          <li>✅ Trusted Local Stores</li>
          <li>✅ WhatsApp Ordering</li>
        </ul>

      </section>

      {/* CTA */}

      <section className="service-cta">

        <h2>Need Groceries?</h2>

        <p>
          Send your grocery list on WhatsApp and we'll help you
          arrange fast doorstep delivery.
        </p>

        <a
          href={`https://wa.me/${phone}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="service-btn"
        >
          🛒 Order Groceries Now
        </a>

      </section>

    </div>
  );
}

export default GroceryDelivery;