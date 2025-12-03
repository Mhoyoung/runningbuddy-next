"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc 
} from "firebase/firestore";
import ReviewCard from "@/components/ReviewCard";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [myReviews, setMyReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      // Firestore에서 사용자 정보 가져오기
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        setNickname(data.nickname || "사용자");
        setProfileImage(data.profileImage || null);
      }

      // 🔥 내가 쓴 리뷰 가져오기
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("userId", "==", currentUser.uid));
      const reviewSnap = await getDocs(q);

      setMyReviews(
        reviewSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading)
    return (
      <div className="p-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <Skeleton className="w-40 h-4 mt-4" />
        <p className="mt-6 text-gray-400">잠시만요...</p>
      </div>
    );

  if (!user)
    return (
      <p className="p-6 text-center text-gray-600">
        로그인이 필요합니다.
      </p>
    );

  return (
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">마이페이지</h2>

      <div className="flex items-center gap-4">
        <img
          src={profileImage ?? "/placeholder.png"}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <p className="font-semibold text-lg">{nickname}</p>
          <Link href="/mypage/profile" className="text-sm text-blue-500 underline">
            프로필 수정 →
          </Link>
        </div>
      </div>

      <hr className="border-gray-200" />

      <div>
        <h3 className="text-lg font-semibold">📌 내가 쓴 리뷰</h3>
        {myReviews.length === 0 ? (
          <p className="text-gray-500 text-sm mt-2">아직 작성한 리뷰가 없습니다 😶</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {myReviews.map((review) => (
              <ReviewCard
                key={review.id}
                id={review.id}
                likes={review.likes}
                text={review.text}
                image={review.image}
                likedBy={review.likedBy || []}
                userId={review.userId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
