import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/admin/ProtectedRoute";
import UserProtectedRoute from "../components/auth/UserProtectedRoute";

// Lazy loading components for better performance
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Services = lazy(() => import("../pages/Services"));
const MedicineDelivery = lazy(() => import("../pages/MedicineDelivery"));
const GroceryDelivery = lazy(() => import("../pages/GroceryDelivery"));
const LabTests = lazy(() => import("../pages/LabTests"));
const OrderMedicine = lazy(() => import("../pages/OrderMedicine"));
const TrackOrder = lazy(() => import("../pages/TrackOrder"));
const Contact = lazy(() => import("../pages/Contact"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("../pages/TermsConditions"));
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Register"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const MyAccount = lazy(() => import("../pages/MyAccount"));
const MyOrders = lazy(() => import("../pages/MyOrders"));
const Profile = lazy(() => import("../pages/Profile"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AIAssistant = lazy(() => import("../pages/AIAssistant"));
const AIDashboard = lazy(() => import("../features/ai-dashboard/AIDashboard"));
const MedicineReminder = lazy(() => import("../features/trackers/MedicineReminder"));
const WaterTracker = lazy(() => import("../features/trackers/WaterTracker"));
const FoodTracker = lazy(() => import("../features/trackers/FoodTracker"));
const SymptomTracker = lazy(() => import("../features/trackers/SymptomTracker"));
const ScannerOCR = lazy(() => import("../features/scanner-ocr/ScannerOCR"));
const LabReportAI = lazy(() => import("../features/scanner-ocr/LabReportAI"));
const HealthTimeline = lazy(() => import("../features/timeline/HealthTimeline"));
const BodyVisualizer3D = lazy(() => import("../features/visualizer-3d/BodyVisualizer3D"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Loading Skeleton Placeholder
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-bg-color">
    <div className="loader"></div>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* AI Routes */}
          <Route path="/ai-dashboard" element={<UserProtectedRoute><AIDashboard /></UserProtectedRoute>} />
          <Route path="/scanner-ocr" element={<UserProtectedRoute><ScannerOCR /></UserProtectedRoute>} />
          <Route path="/lab-report-ai" element={<UserProtectedRoute><LabReportAI /></UserProtectedRoute>} />
          <Route path="/medicine-reminder" element={<UserProtectedRoute><MedicineReminder /></UserProtectedRoute>} />
          <Route path="/water-tracker" element={<UserProtectedRoute><WaterTracker /></UserProtectedRoute>} />
          <Route path="/food-tracker" element={<UserProtectedRoute><FoodTracker /></UserProtectedRoute>} />
          <Route path="/symptom-tracker" element={<UserProtectedRoute><SymptomTracker /></UserProtectedRoute>} />
          <Route path="/health-timeline" element={<UserProtectedRoute><HealthTimeline /></UserProtectedRoute>} />
          <Route path="/body-3d" element={<UserProtectedRoute><BodyVisualizer3D /></UserProtectedRoute>} />

          {/* User Routes */}
          <Route path="/medicine-delivery" element={<UserProtectedRoute><MedicineDelivery /></UserProtectedRoute>} />
          <Route path="/grocery-delivery" element={<UserProtectedRoute><GroceryDelivery /></UserProtectedRoute>} />
          <Route path="/lab-tests" element={<UserProtectedRoute><LabTests /></UserProtectedRoute>} />
          <Route path="/order-medicine" element={<UserProtectedRoute><OrderMedicine /></UserProtectedRoute>} />
          <Route path="/my-account" element={<UserProtectedRoute><MyAccount /></UserProtectedRoute>} />
          <Route path="/my-orders" element={<UserProtectedRoute><MyOrders /></UserProtectedRoute>} />
          <Route path="/profile" element={<UserProtectedRoute><Profile /></UserProtectedRoute>} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
