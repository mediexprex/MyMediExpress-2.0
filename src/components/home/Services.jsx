import {
  FaPills,
  FaFlask,
  FaBasketShopping,
  FaTruckMedical,
} from "react-icons/fa6";

import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";
import Button from "../ui/Button";

import "../../styles/services.css";

const services = [
  {
    id: 1,
    icon: <FaPills />,
    title: "Medicine Delivery",
    description:
      "Upload your prescription and receive genuine medicines from licensed pharmacies with fast doorstep delivery.",
    path: "/medicine-delivery",
  },
  {
    id: 2,
    icon: <FaFlask />,
    title: "Lab Test Booking",
    description:
      "Book diagnostic tests with home sample collection from certified labs.",
    path: "/lab-tests",
  },
  {
    id: 3,
    icon: <FaBasketShopping />,
    title: "Grocery Delivery",
    description:
      "Order groceries and daily essentials from trusted local stores.",
    path: "/grocery-delivery",
  },
  {
    id: 4,
    icon: <FaTruckMedical />,
    title: "Track Order",
    description:
      "Track your medicine and grocery delivery in real time.",
    path: "/track-order",
  },
];

function Services() {
  return (
    <section className="services-section" id="services">
      <div className="services-container">

        <SectionTitle
          badge="Our Services"
          title="Healthcare Services At Your Fingertips"
          subtitle="Everything you need for your healthcare journey."
        />

        <div className="services-grid">

          {services.map((service) => (

            <Card key={service.id}>

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <Button
                to={service.path}
                size="small"
              >
                Learn More
              </Button>

            </Card>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Services;