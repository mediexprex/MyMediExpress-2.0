import { db } from "../firebase/config";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth } from "../firebase/config";

const ORDER_COLLECTION = "orders";

/* ==========================================
   Generate Order ID
========================================== */

const generateOrderId = () => {

  return `MEDI-${Date.now()}`;

};

/* ==========================================
   Create Medicine Order
========================================== */

export async function createMedicineOrder(formData) {

  try {

    console.log("========== ORDER START ==========");

    const currentUser = auth.currentUser;

    const orderId = generateOrderId();

    const order = {

      /* -------------------------------
         Order Info
      -------------------------------- */

      orderId,

      service: "Medicine Delivery",

      orderType: "Medicine",

      status: "Pending",

      paymentStatus: "Pending",

      deliveryStatus: "Awaiting Confirmation",

      /* -------------------------------
         User
      -------------------------------- */

      uid: currentUser?.uid || null,

      displayName:
        currentUser?.displayName ||
        formData.customerName,

      userEmail:
        currentUser?.email ||
        formData.email,

      customerPhoto:
        currentUser?.photoURL || "",

      /* -------------------------------
         Customer Details
      -------------------------------- */

      customerName:
        formData.customerName,

      phone:
        formData.phone,

      alternatePhone:
        formData.alternatePhone || "",

      email:
        formData.email || "",

      /* -------------------------------
         Address
      -------------------------------- */

      address:
        formData.address,

      city:
        formData.city,

      pincode:
        formData.pincode,

      landmark:
        formData.landmark || "",

      /* -------------------------------
         Prescription
      -------------------------------- */

      prescriptionUrl: "",

      prescriptionFileName:
        formData.prescription
          ? formData.prescription.name
          : "",

      /* -------------------------------
         Notes
      -------------------------------- */

      notes:
        formData.notes || "",

      /* -------------------------------
         Delivery
      -------------------------------- */

      assignedTo: "",

      estimatedDelivery: "",

      trackingNumber: "",

      /* -------------------------------
         Metadata
      -------------------------------- */

      orderSource: "Website",

      createdBy:
        currentUser?.uid || "Guest",

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),

      /* -------------------------------
         History
      -------------------------------- */

      history: [

        {

          status:
            "Pending",

          message:
            "Order Submitted",

          time:
            new Date(),

        },

      ],

    };

    console.log(order);

    await addDoc(

      collection(
        db,
        ORDER_COLLECTION
      ),

      order

    );

    console.log("Order Saved");

    return orderId;

  } catch (error) {

    console.error(error);

    throw error;

  }

}