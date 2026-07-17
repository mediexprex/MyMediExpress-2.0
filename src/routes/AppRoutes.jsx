import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import UserProtectedRoute from "../components/auth/UserProtectedRoute";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";

import MedicineDelivery from "../pages/MedicineDelivery";
import GroceryDelivery from "../pages/GroceryDelivery";
import LabTests from "../pages/LabTests";

import OrderMedicine from "../pages/OrderMedicine";
import TrackOrder from "../pages/TrackOrder";
import Contact from "../pages/Contact";

import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsConditions from "../pages/TermsConditions";

import Login from "../pages/Login/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import MyAccount from "../pages/MyAccount";
import MyOrders from "../pages/MyOrders";
import Profile from "../pages/Profile";

import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";

import AIAssistant from "../pages/AIAssistant";
import AIDashboard from '../features/ai-dashboard/AIDashboard';
import MedicineReminder from '../features/trackers/MedicineReminder';
import WaterTracker from '../features/trackers/WaterTracker';
import FoodTracker from '../features/trackers/FoodTracker';
import SymptomTracker from '../features/trackers/SymptomTracker';
import ScannerOCR from '../features/scanner-ocr/ScannerOCR';
import LabReportAI from '../features/scanner-ocr/LabReportAI';
import HealthTimeline from '../features/timeline/HealthTimeline';
import BodyVisualizer3D from '../features/visualizer-3d/BodyVisualizer3D';

import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= Website ================= */}

      <Route element={<Layout />}>

        {/* ---------- Public Routes ---------- */}

        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />

        {/* ---------- Authentication ---------- */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ---------- Protected AI Routes ---------- */}

        <Route
          path="/ai-dashboard"
          element={
            <UserProtectedRoute>
              <AIDashboard />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/scanner-ocr"
          element={
            <UserProtectedRoute>
              <ScannerOCR />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/lab-report-ai"
          element={
            <UserProtectedRoute>
              <LabReportAI />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/medicine-reminder"
          element={
            <UserProtectedRoute>
              <MedicineReminder />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/water-tracker"
          element={
            <UserProtectedRoute>
              <WaterTracker />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/food-tracker"
          element={
            <UserProtectedRoute>
              <FoodTracker />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/symptom-tracker"
          element={
            <UserProtectedRoute>
              <SymptomTracker />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/health-timeline"
          element={
            <UserProtectedRoute>
              <HealthTimeline />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/body-3d"
          element={
            <UserProtectedRoute>
              <BodyVisualizer3D />
            </UserProtectedRoute>
          }
        />

        {/* ---------- Protected User Routes ---------- */}

        <Route
          path="/medicine-delivery"
          element={
            <UserProtectedRoute>
              <MedicineDelivery />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/grocery-delivery"
          element={
            <UserProtectedRoute>
              <GroceryDelivery />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/lab-tests"
          element={
            <UserProtectedRoute>
              <LabTests />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/order-medicine"
          element={
            <UserProtectedRoute>
              <OrderMedicine />
            </UserProtectedRoute>
          }
        />

        {/* ---------- User Dashboard ---------- */}

        <Route
          path="/my-account"
          element={
            <UserProtectedRoute>
              <MyAccount />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <UserProtectedRoute>
              <MyOrders />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <Profile />
            </UserProtectedRoute>
          }
        />

      </Route>

      {/* ================= Admin ================= */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default AppRoutes;