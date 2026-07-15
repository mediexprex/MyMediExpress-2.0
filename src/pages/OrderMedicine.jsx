import { useEffect, useState } from "react";

import { FaUpload } from "react-icons/fa6";

import {
  FaWhatsapp,
  FaPhoneAlt,
  FaShieldAlt,
  FaTruck,
  FaClock,
  FaCamera,
} from "react-icons/fa";

import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

import {
  createMedicineOrder,
} from "../services/orderService";

import {
  listenAuth,
} from "../services/authService";

import {
  getUserProfile,
} from "../services/userService";

import "../styles/order-medicine.css";

function OrderMedicine() {

  const phoneNumber = "918985999562";

  const whatsappMessage =
    encodeURIComponent(`Hi MyMediExpress,

I want to order medicines.

Name:
Mobile:
Address:

I will send my prescription.
`);

  const whatsappLink =
    `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  /* ==========================
      States
  ========================== */

  const [loading, setLoading] =
    useState(false);

  const [loadingProfile, setLoadingProfile] =
    useState(true);

  const [success, setSuccess] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  const [user, setUser] =
    useState(null);

  const [formData, setFormData] =
    useState({

      customerName: "",

      phone: "",

      alternatePhone: "",

      email: "",

      address: "",

      city: "",

      pincode: "",

      landmark: "",

      notes: "",

      prescription: null,

    });

  /* ==========================
      Firebase User
  ========================== */

  useEffect(() => {

    const unsubscribe =
      listenAuth(async (currentUser) => {

        setUser(currentUser);

        if (!currentUser) {

          setLoadingProfile(false);

          return;

        }

        try {

          const profile =
            await getUserProfile(
              currentUser.uid
            );

          setFormData((prev) => ({

            ...prev,

            customerName:
              profile?.name ||
              currentUser.displayName ||
              "",

            email:
              profile?.email ||
              currentUser.email ||
              "",

            phone:
              profile?.phone ||
              "",

          }));

        } catch (error) {

          console.error(
            "Profile Load Error",
            error
          );

        } finally {

          setLoadingProfile(false);

        }

      });

    return () => unsubscribe();

  }, []);

  /* ==========================
      Handle Input
  ========================== */

  const handleChange = (e) => {

    const {

      name,

      value,

      files,

    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        files
          ? files[0]
          : value,

    }));

  };

/* ==========================
    Submit Order
========================== */

const handleSubmit = async (e) => {

  e.preventDefault();

  if (!formData.customerName.trim()) {
    alert("Please enter your full name.");
    return;
  }

  if (!formData.phone.trim()) {
    alert("Please enter your mobile number.");
    return;
  }

  if (!/^[6-9]\d{9}$/.test(formData.phone)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  if (
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    alert("Please enter a valid email address.");
    return;
  }

  if (!formData.address.trim()) {
    alert("Please enter your delivery address.");
    return;
  }

  if (!formData.city.trim()) {
    alert("Please enter your city.");
    return;
  }

  if (!formData.pincode.trim()) {
    alert("Please enter your pincode.");
    return;
  }

  if (!/^\d{6}$/.test(formData.pincode)) {
    alert("Please enter a valid 6-digit pincode.");
    return;
  }

  if (!formData.prescription) {
    alert("Please upload your prescription.");
    return;
  }

  try {

    setLoading(true);

    const orderData = {

      ...formData,

      uid: user?.uid || null,

      displayName:
        user?.displayName ||
        formData.customerName,

      userEmail:
        user?.email ||
        formData.email,

      customerPhoto:
        user?.photoURL || "",

      orderSource: "Website",

    };

    const generatedOrderId =
      await createMedicineOrder(orderData);

    setOrderId(generatedOrderId);

    setSuccess(true);

    setFormData({

      customerName:
        user?.displayName ||
        "",

      phone:
        formData.phone,

      alternatePhone: "",

      email:
        user?.email ||
        "",

      address: "",

      city: "",

      pincode: "",

      landmark: "",

      notes: "",

      prescription: null,

    });

    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  } catch (error) {

    console.error(error);

    alert(
      "Unable to submit your order. Please try again."
    );

  } finally {

    setLoading(false);

  }

};
return (
  <section className="order-medicine-page">

    <div className="order-container">

      {/* Left Section */}

      <div className="order-left">

        <h1>💊 Order Medicines Online</h1>

        <p>
          Upload your prescription and we'll deliver your
          medicines safely to your doorstep.
        </p>

        <div className="order-features">

          <div className="feature-card">
            <FaShieldAlt />
            <span>100% Genuine Medicines</span>
          </div>

          <div className="feature-card">
            <FaTruck />
            <span>Fast Home Delivery</span>
          </div>

          <div className="feature-card">
            <FaClock />
            <span>Quick Order Processing</span>
          </div>

        </div>

      </div>

      {/* Right Section */}

      <div className="order-right">

        {success ? (

          <Card>

            <div className="success-box">

              <h2>✅ Order Submitted Successfully</h2>

              <p>
                Thank you for choosing
                <strong> MyMediExpress</strong>.
              </p>

              <h3>
                Order ID :
                <span>{orderId}</span>
              </h3>

              <Button
                onClick={() => {

                  setSuccess(false);

                }}
              >
                Place Another Order
              </Button>

            </div>

          </Card>

        ) : (

          <Card>

            <form
              className="order-form"
              onSubmit={handleSubmit}
            >

              <h2>Medicine Order Form</h2>

              <input
                type="text"
                name="customerName"
                placeholder="Full Name"
                value={formData.customerName}
                onChange={handleChange}
                readOnly={!!user}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
              />

              <input
                type="tel"
                name="alternatePhone"
                placeholder="Alternate Mobile"
                value={formData.alternatePhone}
                onChange={handleChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                readOnly={!!user}
              />

              <textarea
                name="address"
                placeholder="Delivery Address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />

              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
              />

              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={formData.landmark}
                onChange={handleChange}
              />

              <textarea
                name="notes"
                rows="3"
                placeholder="Additional Notes"
                value={formData.notes}
                onChange={handleChange}
              />

              <label className="upload-box">

                <FaCamera size={22} />

                <span>

                  {formData.prescription
                    ? formData.prescription.name
                    : "Upload Prescription"}

                </span>

                <input
                  type="file"
                  accept="image/*,.pdf"
                  name="prescription"
                  onChange={handleChange}
                  hidden
                />

              </label>

              <Button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Place Order"}
              </Button>

            </form>

          </Card>

        )}

      </div>

    </div>

    {/* Quick Contact */}

    <section className="quick-contact">

      <h2>Need Help?</h2>

      <p>
        Contact our healthcare support team.
      </p>

      <div className="contact-buttons">

        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="whatsapp-btn"
        >
          <FaWhatsapp />
          WhatsApp
        </a>

        <a
          href="tel:+918985999562"
          className="call-btn"
        >
          <FaPhoneAlt />
          Call Now
        </a>

      </div>

    </section>

  </section>
);

}

export default OrderMedicine;