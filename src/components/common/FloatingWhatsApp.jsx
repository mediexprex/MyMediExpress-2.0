import { FaWhatsapp } from "react-icons/fa";
import "../../styles/floatingWhatsapp.css";

function FloatingWhatsApp() {

  const phone = "918985999562";

  const message = encodeURIComponent(
    "Hi MyMediExpress,\n\nI need assistance."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      className="floating-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp className="whatsapp-icon" />

      <span>Chat with us</span>
    </a>
  );
}

export default FloatingWhatsApp;