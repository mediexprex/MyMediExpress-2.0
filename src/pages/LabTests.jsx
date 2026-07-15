function LabTests() {

  const phone = "918985999562";

  const message = encodeURIComponent(
`Hi MyMediExpress,

I want to book a Lab Test.

Name:
Mobile:
Address:
Preferred Date:
Test Required:
`
  );

  return (
    <div className="page-container">

      {/* Hero */}

      <section className="service-hero">

        <h1>🧪 Lab Tests at Home</h1>

        <p>
          Book blood tests, diabetes tests, thyroid profile,
          vitamin tests and complete health checkups from
          trusted diagnostic partners.
        </p>

        <a
          href={`https://wa.me/${phone}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="service-btn"
        >
          📲 Book on WhatsApp
        </a>

      </section>

      {/* Popular Tests */}

      <section className="service-section">

        <h2>Popular Lab Tests</h2>

        <div className="service-grid">

          <div className="service-card">
            🩸
            <h3>Complete Blood Count (CBC)</h3>
            <p>General health screening</p>
          </div>

          <div className="service-card">
            💉
            <h3>Blood Sugar Test</h3>
            <p>Diabetes monitoring</p>
          </div>

          <div className="service-card">
            ❤️
            <h3>Lipid Profile</h3>
            <p>Heart health check</p>
          </div>

          <div className="service-card">
            🦋
            <h3>Thyroid Profile</h3>
            <p>T3, T4 & TSH</p>
          </div>

          <div className="service-card">
            🧬
            <h3>Vitamin D & B12</h3>
            <p>Nutritional assessment</p>
          </div>

          <div className="service-card">
            🩺
            <h3>Full Body Checkup</h3>
            <p>Complete health package</p>
          </div>

        </div>

      </section>

      {/* Why Choose */}

      <section className="service-section">

        <h2>Why Choose MyMediExpress?</h2>

        <ul className="benefits-list">
          <li>✅ Home Sample Collection</li>
          <li>✅ Trusted Diagnostic Labs</li>
          <li>✅ Affordable Pricing</li>
          <li>✅ Fast Report Delivery</li>
          <li>✅ WhatsApp Support</li>
        </ul>

      </section>

      {/* CTA */}

      <section className="service-cta">

        <h2>Need a Lab Test?</h2>

        <p>
          Book your test in less than one minute through WhatsApp.
        </p>

        <a
          href={`https://wa.me/${phone}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="service-btn"
        >
          📲 Book Lab Test Now
        </a>

      </section>

    </div>
  );
}

export default LabTests;