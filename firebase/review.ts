import { db } from "./config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// ✅ 리뷰 작성
export async function addReview(review: {
  img: string;
  text: string;
  userId: string;
}) {
  await addDoc(collection(db, "reviews"), {
    img: review.img,
    text: review.text,
    userId: review.userId,
    createdAt: serverTimestamp(),
  });
}

// ✅ 리뷰 목록 가져오기 (최신순)
export async function getReviewList() {
  const q = query(
    collection(db, "reviews"),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  const list: any[] = [];

  querySnapshot.forEach((doc) => {
    list.push({ id: doc.id, ...doc.data() });
  });

  return list;
}
