import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNavigation from "./BottomNavigation";
import FloatingActionButton from "../common/FloatingActionButton";
import FloatingWhatsApp from "../common/FloatingWhatsApp";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, scale: 0.995 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.005 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      <BottomNavigation />
      <FloatingActionButton />
      <FloatingWhatsApp />

      <style dangerouslySetInnerHTML={{ __html: `
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--bg-color);
        }

        .main-content {
          flex: 1;
        }

        @media (max-width: 992px) {
          .main-content {
            padding-bottom: 90px; /* Enhanced space for Bottom Nav + Overlay offset */
          }
        }
      `}} />
    </div>
  );
}

export default Layout;
