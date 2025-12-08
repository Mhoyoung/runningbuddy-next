"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { getMyRecruits, getJoinedRecruits } from "@/firebase/recruit";
import { getMyReviews } from "@/firebase/review"; // 👈 추가됨
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
import { FaUserCircle } from "react-icons/fa";
import ReviewCard from "@/components/ReviewCard"; // 👈 추가됨

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [myRecruits, setMyRecruits] = useState<any[]>([]);
  const [joinedRecruits, setJoinedRecruits] = useState<any[]>([]);
  const [myReviews, setMyReviews] = useState<any[]>([]); // 👈 리뷰 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(currentUser);

      try {
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (userSnap.exists()) setProfile(userSnap.data());

        // 🔥 3가지 데이터를 병렬로 동시에 가져옴 (모집, 참여, 리뷰)
        const [myList, joinedList, reviewList] = await Promise.all([
          getMyRecruits(currentUser.uid),
          getJoinedRecruits(currentUser.uid),
          getMyReviews(currentUser.uid), // 👈 추가됨
        ]);

        setMyRecruits(myList);
        setJoinedRecruits(joinedList);
        setMyReviews(reviewList); // 👈 저장
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-20 w-20 rounded-full mb-4"/>
        <Skeleton className="h-40 w-full rounded-xl"/>
      </div>
    );
  }

  if (!user) {
    return <div className="p-6 text-center mt-10">로그인이 필요한 서비스입니다. 🔒</div>;
  }

  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">마이페이지 👤</h1>

      {/* 프로필 카드 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center gap-5 border border-gray-100">
        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-gray-100">
           {profile?.profileImage ? (
             <img src={profile.profileImage} className="w-full h-full object-cover" alt="프로필" />
           ) : (
             <FaUserCircle className="text-gray-300 w-full h-full" />
           )}
        </div>
        <div>
          <h2 className="text-xl font-bold">{profile?.nickname || user.displayName || "러너"}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <Link href="/mypage/profile/edit" className="text-blue-500 text-sm font-bold mt-1 inline-block hover:underline">
            프로필 수정 →
          </Link>
        </div>
      </div>

      {/* 1. 참여 중인 러닝 */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          🏃‍♂️ 참여 중인 러닝 <span className="text-blue-500">{joinedRecruits.length}</span>
        </h3>
        {joinedRecruits.length === 0 ? (
          <div className="text-gray-400 text-sm bg-white p-4 rounded-xl border border-dashed text-center">
            참여 중인 모임이 없어요.
          </div>
        ) : (
          <div className="space-y-3">
            {joinedRecruits.map((item) => (
              <Link key={item.id} href={`/recruit/${item.id}`} className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:scale-95 transition">
                <p className="font-bold text-gray-800 line-clamp-1">{item.title}</p>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span>📅 {item.date}</span>
                  <span>📍 {item.location}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 2. 내가 만든 모집 글 */}
      <section className="mb-8">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          📝 내가 만든 모집 <span className="text-gray-500">{myRecruits.length}</span>
        </h3>
        {myRecruits.length === 0 ? (
          <div className="text-gray-400 text-sm bg-white p-4 rounded-xl border border-dashed text-center">
            작성한 모집 글이 없어요.
          </div>
        ) : (
          <div className="space-y-3">
            {myRecruits.map((item) => (
              <Link key={item.id} href={`/recruit/${item.id}`} className="block bg-gray-100 p-4 rounded-xl active:scale-95 transition">
                <p className="font-bold text-gray-700 line-clamp-1">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.date} • {item.currentPeople}/{item.maxPeople}명
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 🔥 3. 내가 쓴 리뷰 (새로 추가됨) */}
      <section>
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          📸 내가 쓴 리뷰 <span className="text-pink-500">{myReviews.length}</span>
        </h3>
        {myReviews.length === 0 ? (
          <div className="text-gray-400 text-sm bg-white p-4 rounded-xl border border-dashed text-center">
            작성한 리뷰가 없어요.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {myReviews.map((review, index) => (
              <ReviewCard
                key={`${review.id}-${index}`}
                id={review.id}
                image={review.image}
                text={review.text}
                likes={review.likes}
                likedBy={review.likedBy || []}
                userId={review.userId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}