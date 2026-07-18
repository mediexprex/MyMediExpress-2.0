import { useEffect, useState } from "react";
import {
  Upload, Phone, ShieldCheck, Truck, Clock,
  Camera, MessageSquare, CheckCircle2, AlertCircle, FileText,
  ArrowRight, Sparkles, Navigation, MapPin, Mail, User, X, ChevronRight, Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createMedicineOrder } from "../services/orderService";
import { listenAuth } from "../services/authService";
import { getUserProfile } from "../services/userService";
import "../styles/order-medicine.css";

function OrderMedicine() {
  const phoneNumber = "918985999562";
  const whatsappMessage = encodeURIComponent(`Hi MyMediExpress, \n\nI want to order medicines.`);
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const unsubscribe = listenAuth(async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) return;
      try {
        const profile = await getUserProfile(currentUser.uid);
        setFormData((prev) => ({
          ...prev,
          customerName: profile?.name || currentUser.displayName || "",
          email: profile?.email || currentUser.email || "",
          phone: profile?.phone || "",
        }));
      } catch (error) { console.error(error); }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.prescription) {
       alert("Clinical order validation requires a prescription payload.");
       return;
    }
    try {
      setLoading(true);
      const generatedOrderId = await createMedicineOrder({
        ...formData,
        uid: user?.uid || null,
        displayName: user?.displayName || formData.customerName,
        userEmail: user?.email || formData.email,
        orderSource: "Portal",
      });
      setOrderId(generatedOrderId);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      alert("Order Transmission Failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="order-medicine-page">
      <div className="page-container">
        <div className="order-grid">

          <div className="order-intro">
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
               <div className="badge badge-primary mb-6"><Sparkles size={14} /> Healthcare Logistics</div>
               <h1 className="text-main tracking-tight">Rapid Medicine <br/><span>Fulfillment</span></h1>
               <p className="text-muted mt-6 text-lg max-w-md">
                  Upload your clinical prescription for high-speed pharmaceutical delivery protocols and doorstep fulfillment.
               </p>
            </motion.header>

            <div className="feature-stack mt-16 space-y-6">
              {[
                { icon: <ShieldCheck className="text-primary" />, label: "Certified Compounds", desc: "100% genuine medicines from licensed pharmacies." },
                { icon: <Truck className="text-secondary" />, label: "Cold-Chain Logistics", desc: "Safe handling of temperature-sensitive items." },
                { icon: <Clock className="text-accent" />, label: "Express Processing", desc: "Order confirmation within 15 minutes." }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="feature-card-premium card flex items-center gap-6 p-8"
                >
                  <div className="feature-icon-box">{f.icon}</div>
                  <div>
                    <h4 className="font-bold text-main">{f.label}</h4>
                    <p className="text-xs text-muted mt-1">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="order-form-container">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-box card text-center glass border-none shadow-premium"
                >
                  <div className="success-icon-wrapper">
                     <CheckCircle2 size={48} className="text-primary" />
                  </div>
                  <h2 className="text-3xl font-black mb-4">Transmission Successful</h2>
                  <p className="text-muted mb-8">Order <strong>#{orderId}</strong> is now in the fulfillment queue. Syncing with logistics nodes...</p>

                  <div className="flex flex-col gap-4">
                    <button className="btn-primary w-full" onClick={() => window.location.href = `/track-order?id=${orderId}`}>Track Protocol</button>
                    <button className="btn-secondary w-full" onClick={() => setSuccess(false)}>Commence New Order</button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card glass shadow-premium border-none p-10 md:p-14"
                >
                  <form className="order-form" onSubmit={handleSubmit}>
                    <div className="form-header text-center mb-12">
                       <h2 className="text-3xl font-black mb-2">Order Manifest</h2>
                       <p className="text-[10px] font-bold text-muted uppercase tracking-[3px]">Secure Digital Transmission</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="form-group">
                          <label><User size={14}/> Full Name</label>
                          <input type="text" name="customerName" placeholder="Patient Name" value={formData.customerName} onChange={handleChange} required />
                       </div>
                       <div className="form-group">
                          <label><Phone size={14}/> Contact Node</label>
                          <input type="tel" name="phone" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} required />
                       </div>
                    </div>

                    <div className="form-group mt-8">
                       <label><MapPin size={14}/> Logistic Coordinates</label>
                       <textarea name="address" placeholder="Full Clinical Delivery Address" rows="3" value={formData.address} onChange={handleChange} required />
                    </div>

                    <div className="grid grid-cols-2 gap-8 mt-8">
                       <div className="form-group">
                          <label><Navigation size={14}/> Sector</label>
                          <input type="text" name="city" placeholder="City / Region" value={formData.city} onChange={handleChange} required />
                       </div>
                       <div className="form-group">
                          <label><MapPin size={14}/> Index Code</label>
                          <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
                       </div>
                    </div>

                    <label className="upload-zone mt-10">
                      <div className="upload-content">
                        {formData.prescription ? (
                          <div className="file-active">
                            <FileText size={40} className="text-primary mb-4" />
                            <p className="font-bold text-main">{formData.prescription.name}</p>
                            <button type="button" className="remove-file" onClick={(e) => { e.preventDefault(); setFormData({...formData, prescription: null}); }}><X size={14} /></button>
                          </div>
                        ) : (
                          <>
                            <div className="upload-icon-box"><Camera size={32} /></div>
                            <span className="upload-label">Attach Prescription Payload</span>
                            <p className="upload-hint">PDF, JPG, PNG (Max 10MB)</p>
                          </>
                        )}
                      </div>
                      <input type="file" accept="image/*,.pdf" name="prescription" onChange={handleChange} hidden />
                    </label>

                    <button className="btn-primary w-full mt-12 py-6 shadow-premium" type="submit" disabled={loading}>
                      {loading ? "TRANSMITTING..." : "EXECUTE ORDER"} <ChevronRight size={18} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.section
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="clinical-support-box mt-32 p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="support-glass-bg"></div>
          <MessageSquare className="support-bg-icon" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-6">Clinical Support <br/><span>Live Interface</span></h2>
            <p className="text-slate-300 text-xl mb-12 font-medium leading-relaxed">Direct synchronization with our healthcare logistics team for pharmaceutical support and order verification.</p>

            <div className="flex flex-wrap justify-center gap-8">
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="support-btn whatsapp">
                <MessageSquare size={22} fill="white" /> WHATSAPP FEED
              </a>
              <a href="tel:+918985999562" className="support-btn phone">
                <Phone size={22} fill="white" /> DIRECT LINE
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

export default OrderMedicine;
