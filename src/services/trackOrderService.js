import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export const getOrderById = async (orderId) => {
  const q = query(
    collection(db, "orders"),
    where("orderId", "==", orderId.trim())
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].data();
};