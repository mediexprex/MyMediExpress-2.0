import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaLocationDot, FaCircleCheck, FaCircle, FaClockRotateLeft,
  FaTruckFast, FaBoxOpen, FaHouseMedical, FaFileSignature, FaUserNinja
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { listenToOrder, listenUserOrders } from "../services/orderService";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { Clock, MapPin, Package, Phone, User, ChevronRight, Activity, ShieldCheck, Zap } from "lucide-react";
import "../styles/track-order.css";

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlOrderId = queryParams.get("id");

  const statuses = [
    { label: "Pending", icon: <FaFileSignature />, desc: "Transmission Received" },
    { label: "Accepted", icon: <FaCircleCheck />, desc: "Pharmacist Verified" },
    { label: "Packed", icon: <FaBoxOpen />, desc: "Sterile Packaging" },
    { label: "Out for Delivery", icon: <FaTruckFast />, desc: "Logistics in Transit" },
    { label: "Delivered", icon: <FaHouseMedical />, desc: "Fulfillment Complete" }
  ];

  useEffect(() => {
    let unsubscribeRecent = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        unsubscribeRecent = listenUserOrders(currentUser.uid, (data) => {
          setRecentOrders(data.slice(0, 4));
        });
      }
    });

    if (urlOrderId) {
      setOrderId(urlOrderId);
      handleSearch(null, urlOrderId);
    }

    return () => {
      unsubscribeAuth();
      unsubscribeRecent();
    };
  }, [urlOrderId]);

  const handleSearch = (e, manualId = null) => {
    if (e) e.preventDefault();
    const idToSearch = manualId || orderId;

    if (!idToSearch.trim()) {
      alert("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);
    setNotFound(false);

    const unsubscribe = listenToOrder(idToSearch, (data) => {
      setLoading(false);
      if (data) {
        setOrder(data);
        setNotFound(false);
      } else {
        setOrder(null);
        setNotFound(true);
      }
    });

    return () => unsubscribe();
  };

  const getStatusIndex = (status) => {
    return statuses.findIndex(s => s.label === status);
  };

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="track-page">
      <div className="container">

        <div className="track-hero text-center mb-16">
          <div className="track-icon-badge mx-auto mb-8">
            <FaLocationDot size={32} className="text-secondary" />
          </div>
          <h1 className="text-5xl font-black mb-4">Track Order <span>Protocol</span></h1>
          <p className="text-muted text-lg max-w-xl mx-auto font-medium">Realtime synchronization with our medical logistics network.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-4">
             <div className="card glass p-8 border-none shadow-premium mb-8">
                <form className="track-form-premium" onSubmit={(e) => handleSearch(e)}>
                  <label className="text-[10px] font-black uppercase tracking-[3px] text-muted mb-4 block">Reference Identification</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="track-input"
                      placeholder="Ex: MEDI-2024-XXXX"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                    <button type="submit" disabled={loading} className="btn-search-node">
                       {loading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <ChevronRight />}
                    </button>
                  </div>
                </form>
             </div>

             {user && recentOrders.length > 0 && (
                <div className="recent-transmissions">
                   <h3 className="flex items-center gap-3 text-xs font-black uppercase tracking-[3px] text-muted mb-6 px-4">
                      <FaClockRotateLeft size={14} className="text-primary" /> Transmission History
                   </h3>
                   <div className="space-y-4">
                      {recentOrders.map(o => (
                        <motion.button
                          key={o.id}
                          whileHover={{ x: 5 }}
                          onClick={() => { setOrderId(o.orderId); handleSearch(null, o.orderId); }}
                          className="recent-card-premium card border-none shadow-sm flex items-center justify-between p-6"
                        >
                          <div className="text-left">
                            <span className="block font-black text-main text-sm">{o.orderId}</span>
                            <small className="text-[9px] font-bold text-primary uppercase">{o.orderStatus || o.status}</small>
                          </div>
                          <ChevronRight size={16} className="text-muted" />
                        </motion.button>
                      ))}
                   </div>
                </div>
             )}
          </div>

          <div className="lg:col-span-8">
             <AnimatePresence mode="wait">
                {notFound ? (
                  <motion.div key="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card glass text-center py-24 border-none shadow-premium">
                     <AlertTriangle size={64} className="mx-auto text-red-500 mb-6" />
                     <h3 className="text-2xl font-black">Node Not Identified</h3>
                     <p className="text-muted mt-2 font-medium">Unable to locate specified fulfillment protocol in our terminal.</p>
                  </motion.div>
                ) : order ? (
                  <motion.div key="order-data" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                     <div className="order-live-header card glass border-none shadow-premium p-10 relative overflow-hidden">
                        <div className="live-pulse-bg"></div>
                        <div className="flex justify-between items-start relative z-10">
                           <div>
                              <div className="badge badge-primary mb-6"><Zap size={12} /> Live Fulfillment Feed</div>
                              <h2 className="text-4xl font-black text-main">{order.orderStatus || order.status}</h2>
                              <p className="text-muted font-bold mt-2 flex items-center gap-2"><Clock size={14} /> Est. Arrival: 45-60 Mins</p>
                           </div>
                           <div className="text-right">
                              <span className="block text-[10px] font-black text-muted uppercase tracking-widest">Protocol ID</span>
                              <strong className="text-xl font-black text-main">{order.orderId}</strong>
                           </div>
                        </div>

                        <div className="timeline-horizontal mt-16">
                           <div className="timeline-track">
                              <div
                                 className="timeline-progress"
                                 style={{ width: `${(getStatusIndex(order.orderStatus || order.status) / (statuses.length - 1)) * 100}%` }}
                              />
                           </div>
                           <div className="timeline-steps">
                              {statuses.map((s, index) => {
                                const currentIndex = getStatusIndex(order.orderStatus || order.status);
                                const isCompleted = index <= currentIndex;
                                const isCurrent = index === currentIndex;

                                return (
                                  <div key={index} className={`step-node ${isCompleted ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                                    <div className="node-icon">{s.icon}</div>
                                    <span className="node-label">{s.label}</span>
                                  </div>
                                );
                              })}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card glass border-none shadow-premium p-8">
                           <h4 className="text-xs font-black uppercase tracking-[3px] text-muted mb-8 flex items-center gap-3">
                              <MapPin size={16} className="text-secondary" /> Logistic Port
                           </h4>
                           <p className="text-lg font-bold text-main leading-relaxed">{order.address}, {order.city}</p>
                           <span className="block mt-4 text-xs font-bold text-muted">PINCODE: {order.pincode}</span>
                        </div>

                        <div className="card glass border-none shadow-premium p-8">
                           <h4 className="text-xs font-black uppercase tracking-[3px] text-muted mb-8 flex items-center gap-3">
                              <FaUserNinja size={16} className="text-secondary" /> Delivery Node
                           </h4>
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-bg-color flex items-center justify-center text-secondary border border-border shadow-inner">
                                 <User size={28} />
                              </div>
                              <div>
                                 <p className="font-black text-main">Vikram Singh</p>
                                 <p className="text-xs font-bold text-primary flex items-center gap-2 mt-1"><ShieldCheck size={12} /> Verified Partner</p>
                              </div>
                           </div>
                           <button className="btn-secondary w-full mt-6 py-4 rounded-xl text-xs flex justify-center gap-3">
                              <Phone size={14} /> Contact Node
                           </button>
                        </div>
                     </div>

                     <div className="card glass border-none shadow-premium p-8">
                        <h4 className="text-xs font-black uppercase tracking-[3px] text-muted mb-8 flex items-center gap-3">
                           <Package size={16} className="text-secondary" /> Transmission Metadata
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                           <div className="meta-box">
                              <span>Service</span>
                              <strong>{order.service}</strong>
                           </div>
                           <div className="meta-box">
                              <span>Patient</span>
                              <strong>{order.customerName}</strong>
                           </div>
                           <div className="meta-box">
                              <span>Timestamp</span>
                              <strong>{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Syncing'}</strong>
                           </div>
                           <div className="meta-box">
                              <span>Verification</span>
                              <strong className="text-primary">Secured</strong>
                           </div>
                        </div>
                     </div>

                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card border-dashed border-2 py-32 text-center bg-transparent shadow-none opacity-40">
                     <Activity size={80} className="mx-auto text-muted mb-8" />
                     <h3 className="text-2xl font-black uppercase tracking-[5px]">Awaiting Signal</h3>
                     <p className="font-bold mt-4">Initiate order search or select a recent transmission from the terminal.</p>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>

        </div>

      </div>
    </motion.section>
  );
}

export default TrackOrder;
