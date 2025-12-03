import { db } from "./config";
import { 
  collection, 
  addDoc, 
  Timestamp, 
  getDocs, 
  query,     
  where,     
  orderBy    
} from "firebase/firestore";

// ✅ 기록 저장
export async function addRecord(data: {
  uid: string;
  date: string;
  distance: string;
  time: string;
  pace: string;
}) {
  return await addDoc(collection(db, "records"), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

// ✅ 기록 불러오기 
export async function getRecords(uid: string) {
  const q = query(
    collection(db, "records"),
    where("uid", "==", uid),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}