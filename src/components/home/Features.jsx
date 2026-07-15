import "../../styles/features.css";

const features = [
  {
    icon: "💊",
    title: "Trusted Pharmacies",
    description:
      "We partner with verified pharmacies to deliver genuine medicines safely.",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    description:
      "Get medicines and groceries delivered to your doorstep quickly.",
  },
  {
    icon: "🩺",
    title: "Lab Test Booking",
    description:
      "Book lab tests online with trusted diagnostic partners.",
  },
  {
    icon: "🔒",
    title: "Secure & Reliable",
    description:
      "Your personal and medical information is protected with secure systems.",
  },
];

function Features() {
  return (
    <section className="features" id="features">
      <div className="container">
        <h2>Why Choose Medi Express?</h2>
        <p className="subtitle">
          We make healthcare simple, fast, and reliable.
        </p>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;