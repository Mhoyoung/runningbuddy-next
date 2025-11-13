import { db } from "./config";
import { collection, addDoc, Timestamp, getDocs } from "firebase/firestore";

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

// ✅ 기록 전체 불러오기 (특정 유저)
export async function getRecords(uid: string) {
  const snapshot = await getDocs(collection(db, "records"));
  const records = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((x: any) => x.uid === uid)
    .sort((a: any, b: any) => b.createdAt.seconds - a.createdAt.seconds);

  return records;
}
