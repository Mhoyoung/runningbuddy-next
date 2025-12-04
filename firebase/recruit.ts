import { db } from "./config";
import { 
  collection, 
  addDoc, 
  Timestamp, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  where
} from "firebase/firestore";

// 모집 글 저장하기
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
    currentPeople: 1,         
    isClosed: false,          
  });
}

// 모집 목록 불러오기
export async function getRecruitList() {
  const snapshot = await getDocs(collection(db, "recruits"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => {
      // 안전장치: 시간이 없으면 0으로 처리해서 에러 방지
      const timeA = a.createdAt?.seconds ?? 0;
      const timeB = b.createdAt?.seconds ?? 0;
      return timeB - timeA;
    });
}

// 모집 글 삭제하기
export async function deleteRecruit(id: string) {
  await deleteDoc(doc(db, "recruits", id));
}

// 모집 상세 불러오기
export async function getRecruitDetail(id: string) {
  const ref = doc(db, "recruits", id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return null;
}

// 메인 페이지용: 최신 3개만 가져오기
export async function getRecentRecruits() {
  const q = query(
    collection(db, "recruits"),
    orderBy("createdAt", "desc"),
    limit(3)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// 모집 참여하기
export async function joinRecruit(recruitId: string, userId: string) {
  const ref = doc(db, "recruits", recruitId);
  await updateDoc(ref, {
    participants: arrayUnion(userId),
    currentPeople: increment(1),
  });
}

// 모집 참여 취소하기
export async function leaveRecruit(recruitId: string, userId: string) {
  const ref = doc(db, "recruits", recruitId);
  await updateDoc(ref, {
    participants: arrayRemove(userId),
    currentPeople: increment(-1),
  });
}

// [마이페이지] 내가 만든 모집 글 가져오기
export async function getMyRecruits(userId: string) {
  const q = query(
    collection(db, "recruits"),
    where("uid", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// [마이페이지] 내가 참여한 모집 글 가져오기
export async function getJoinedRecruits(userId: string) {
  const q = query(
    collection(db, "recruits"),
    where("participants", "array-contains", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}