import { db } from "../firebase/config";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// Fetch all orders

export const getAllOrders = async () => {
  try {

    const snapshot = await getDocs(
      collection(db, "orders")
    );

    console.log("Orders Found:", snapshot.docs.length);

    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
    }));

  } catch (error) {

    console.error("Error fetching orders:", error);
    throw error;

  }
};

// Update order status

export const updateOrderStatus = async (
  orderId,
  newStatus
) => {

  try {

    const orderRef = doc(
      db,
      "orders",
      orderId
    );

    await updateDoc(orderRef, {
      status: newStatus,
    });

    console.log(
      "Order status updated successfully."
    );

  } catch (error) {

    console.error(
      "Error updating order status:",
      error
    );

    throw error;

  }

};