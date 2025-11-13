import { db } from "./config";
import { collection, addDoc, Timestamp, getDocs, doc, getDoc } from "firebase/firestore";

// ✅ 모집 글 저장하기
export async function addRecruit(data: {
  uid: string;
  title: string;
  content: string;
  time: string;
  location: string;
}) {
  return await addDoc(collection(db, "recruits"), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

// ✅ 모집 목록 불러오기
export async function getRecruitList() {
  const snapshot = await getDocs(collection(db, "recruits"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => b.createdAt.seconds - a.createdAt.seconds);
}

// ✅ 모집 상세 불러오기
export async function getRecruitDetail(id: string) {
  const ref = doc(db, "recruits", id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return null;
}
