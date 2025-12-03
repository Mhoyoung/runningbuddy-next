import { db } from "./config";
import { collection, addDoc, Timestamp, getDocs, doc, getDoc, deleteDoc, query, orderBy, limit } from "firebase/firestore";

// ✅ 모집 글 저장하기
export async function addRecruit(data: {
  uid: string;
  title: string;
  content: string;
  date: string;
  time: string;
  location: string;
  maxPeople: number;
}) {
  return await addDoc(collection(db, "recruits"), {
    ...data,
    createdAt: Timestamp.now(),
    participants: [data.uid],
  });
}

// ✅ 모집 목록 불러오기
export async function getRecruitList() {
  const snapshot = await getDocs(collection(db, "recruits"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => b.createdAt.seconds - a.createdAt.seconds);
}

// ✅ 2. 모집 글 삭제하기 (새로 추가!)
export async function deleteRecruit(id: string) {
  await deleteDoc(doc(db, "recruits", id));
}

// ✅ 모집 상세 불러오기
export async function getRecruitDetail(id: string) {
  const ref = doc(db, "recruits", id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return null;
}

// ✅ 메인 페이지용: 최신 3개만 가져오기
export async function getRecentRecruits() {
  const q = query(
    collection(db, "recruits"),
    orderBy("createdAt", "desc"),
    limit(3)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
