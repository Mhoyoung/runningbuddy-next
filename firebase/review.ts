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
  getDoc,
  deleteDoc,
  limit
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
// 📌 리뷰 가져오기
// ---------------------------
export async function getReviews(): Promise<Review[]> {
  const snapshot = await getDocs(collection(db, "reviews"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Review[];
}

// ---------------------------
// ❤️ 좋아요 토글
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
// 💬 댓글 기능
// ---------------------------
export async function addComment(reviewId: string, text: string, userId: string) {
  // 유저 정보 가져오기 (nickname 포함)
  const userRef = doc(db, `users/${userId}`);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.exists() ? userSnap.data() : { nickname: "익명" };

  return await addDoc(collection(db, `reviews/${reviewId}/comments`), {
    text,
    userId,
    nickname: userData.nickname ?? "익명",
    createdAt: serverTimestamp(),
  });
}

// 실시간 댓글
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

// ---------------------------
// 🗑 리뷰 삭제 (작성자만)
// ---------------------------
export async function deleteReview(reviewId: string, userId: string) {
  const ref = doc(db, "reviews", reviewId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  // 본인인가 확인
  if (data.userId !== userId) {
    throw new Error("삭제 권한이 없습니다.");
  }

  await deleteDoc(ref);
}

// ---------------------------
// 🗑 댓글 삭제 (작성자만)
// ---------------------------
export async function deleteComment(reviewId: string, commentId: string, userId: string) {
  const ref = doc(db, `reviews/${reviewId}/comments/${commentId}`);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();

  if (data.userId !== userId) {
    throw new Error("댓글 삭제 권한이 없습니다.");
  }

  await deleteDoc(ref);
}

export async function getRecentReviews() {
  const q = query(
    collection(db, "reviews"),
    orderBy("createdAt", "desc"),
    limit(3)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}