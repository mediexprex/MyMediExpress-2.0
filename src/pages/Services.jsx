import {
  FaPills,
  FaFlask,
  FaBasketShopping,
  FaTruckMedical,
  FaClock,
  FaShieldHeart,
} from "react-icons/fa6";

import "../styles/pages.css";

function Services() {
  const services = [
    {
      icon: <FaPills />,
      title: "Medicine Delivery",
      description:
        "Upload your prescription and get genuine medicines delivered to your doorstep from trusted pharmacies.",
    },
    {
      icon: <FaFlask />,
      title: "Lab Test Booking",
      description:
        "Book diagnostic lab tests with home sample collection and receive digital reports quickly.",
    },
    {
      icon: <FaBasketShopping />,
      title: "Grocery Delivery",
      description:
        "Order groceries, fruits, vegetables, dairy products and daily essentials with fast local delivery.",
    },
    {
      icon: <FaTruckMedical />,
      title: "Healthcare Assistance",
      description:
        "Helping customers connect with nearby pharmacies and healthcare partners whenever required.",
    },
    {
      icon: <FaClock />,
      title: "Fast Delivery",
      description:
        "Quick order processing and timely doorstep delivery across our service areas.",
    },
    {
      icon: <FaShieldHeart />,
      title: "Trusted Service",
      description:
        "Reliable, secure and customer-friendly healthcare delivery platform built for your convenience.",
    },
  ];

  return (
    <section className="page-section">
      <div className="page-container">

        <div className="page-header">
          <h1>Our Services</h1>

          <p>
            MyMediExpress is your trusted healthcare partner,
            providing medicines, lab tests and grocery delivery
            through one simple platform.
          </p>
        </div>

        <div className="services-page-grid">
          {services.map((service, index) => (
            <div
              className="service-page-card"
              key={index}
            >
              <div className="service-page-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>
            </div>
          ))}
        </div>

        <div className="page-info-box">
          <h2>Why Choose MyMediExpress?</h2>

          <ul>
            <li>✔ Genuine Medicines</li>
            <li>✔ Fast Doorstep Delivery</li>
            <li>✔ Certified Diagnostic Labs</li>
            <li>✔ Daily Grocery Essentials</li>
            <li>✔ Easy WhatsApp Ordering</li>
            <li>✔ Secure & Reliable Service</li>
          </ul>
        </div>

      </div>
    </section>
  );
}

export default Services;