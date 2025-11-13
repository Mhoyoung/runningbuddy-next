import { db, storage } from "./config";
import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// ✅ 이미지 업로드
export async function uploadReviewImage(file: File) {
  const fileRef = ref(storage, `reviews/${Date.now()}-${file.name}`);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);
  return url;
}

// ✅ 리뷰 저장
export async function addReview(data: {
  uid: string;
  text: string;
  img: string | null;
}) {
  return await addDoc(collection(db, "reviews"), {
    ...data,
    createdAt: Timestamp.now(),
  });
}

// ✅ 리뷰 목록 가져오기
export async function getReviewList() {
  const snapshot = await getDocs(collection(db, "reviews"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a: any, b: any) => b.createdAt.seconds - a.createdAt.seconds);
}

// ✅ 리뷰 상세
export async function getReviewDetail(id: string) {
  const ref = doc(db, "reviews", id);
  const snap = await getDoc(ref);

  if (snap.exists()) return { id: snap.id, ...snap.data() };
  return null;
}
