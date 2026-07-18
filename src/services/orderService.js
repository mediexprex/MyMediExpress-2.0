import { db, storage, auth } from "../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ORDER_COLLECTION = "orders";

/* ==========================================
   Generate Unique Order ID
   Format: MEDI-YYYYMMDD-XXXX
========================================== */
const generateOrderId = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `MEDI-${dateStr}-${randomStr}`;
};

/* ==========================================
   Create Medicine Order
========================================== */
export async function createMedicineOrder(formData) {
  try {
    const currentUser = auth.currentUser;
    const orderId = generateOrderId();

    let prescriptionURL = "";
    if (formData.prescription) {
      const storageRef = ref(storage, `prescriptions/${orderId}_${formData.prescription.name}`);
      const uploadResult = await uploadBytes(storageRef, formData.prescription);
      prescriptionURL = await getDownloadURL(uploadResult.ref);
    }

    const order = {
      orderId: orderId,
      userId: currentUser?.uid || null,
      customerName: formData.customerName,
      phone: formData.phone,
      address: formData.address,
      city: formData.city || "",
      pincode: formData.pincode || "",
      email: formData.email || currentUser?.email || "",
      medicines: [],
      prescriptionURL: prescriptionURL,
      orderStatus: "Pending", // Changed to orderStatus as requested
      status: "Pending",      // Keep legacy for compatibility
      createdAt: serverTimestamp(),
      service: "Medicine Delivery",
    };

    await addDoc(collection(db, ORDER_COLLECTION), order);
    return orderId;
  } catch (error) {
    console.error("Order Creation Error:", error);
    throw error;
  }
}

/* ==========================================
   Get User Orders (Realtime)
========================================== */
export function listenUserOrders(userId, callback) {
  const q = query(
    collection(db, ORDER_COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(orders);
  }, (error) => {
    console.error("Realtime Orders Error:", error);
  });
}

/* ==========================================
   Track Specific Order (Realtime)
========================================== */
export function listenToOrder(orderId, callback) {
  const q = query(
    collection(db, ORDER_COLLECTION),
    where("orderId", "==", orderId.trim()),
    limit(1)
  );

  return onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Track Order Error:", error);
  });
}


