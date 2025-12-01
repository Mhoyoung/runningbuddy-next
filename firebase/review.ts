import { db } from "./config";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

// ---------------------------
// 📌 리뷰 타입 정의
// ---------------------------
export interface Review {
  id: string;
  image: string;
  text: string;
  likes: number;
  likedBy: string[];
  userId?: string;
  createdAt?: any;
}

// ---------------------------
// 📌 리뷰 전체 가져오기
// ---------------------------
export async function getReviews(): Promise<Review[]> {
  const snapshot = await getDocs(collection(db, "reviews"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Review[];
}

// ---------------------------
// ❤️ 좋아요 기능 (토글)
// ---------------------------
export async function toggleLike(reviewId: string, userId: string, alreadyLiked: boolean) {
  const ref = doc(db, "reviews", reviewId);

  if (alreadyLiked) {
    await updateDoc(ref, {
      likedBy: arrayRemove(userId),
      likes: increment(-1),
    });
  } else {
    await updateDoc(ref, {
      likedBy: arrayUnion(userId),
      likes: increment(1),
    });
  }
}

// ---------------------------
// 💬 댓글 추가 기능
// ---------------------------
export async function addComment(reviewId: string, text: string, userId: string) {
  return await addDoc(collection(db, `reviews/${reviewId}/comments`), {
    text,
    userId,
    createdAt: serverTimestamp(),
  });
}

// ---------------------------
// 🔄 댓글 실시간 가져오기
// ---------------------------
export function listenComments(reviewId: string, callback: (comments: any[]) => void) {
  const q = query(
    collection(db, `reviews/${reviewId}/comments`),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
}
