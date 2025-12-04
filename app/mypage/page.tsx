"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { getMyRecruits, getJoinedRecruits } from "@/firebase/recruit";
import Link from "next/link";
import Skeleton from "@/components/Skeleton";
import { FaUserCircle } from "react-icons/fa";

export default function MyPage() {
  const [user, setUser] = useState<any>(null); // 초기값 null
  const [profile, setProfile] = useState<any>(null);
  const [myRecruits, setMyRecruits] = useState<any[]>([]);
  const [joinedRecruits, setJoinedRecruits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // 로딩 시작

  useEffect(() => {
    // onAuthStateChanged는 로그인 상태가 확인되면 실행됨
    const unsub = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        // 로그인이 안 된 상태라면
        setUser(null);
        setLoading(false); // 로딩 끝
        return;
      }

      // 로그인이 된 상태라면
      setUser(currentUser);

      try {
        // 1. 프로필 가져오기
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (userSnap.exists()) setProfile(userSnap.data());

        // 2. 활동 내역 가져오기
        const [myList, joinedList] = await Promise.all([
          getMyRecruits(currentUser.uid),
          getJoinedRecruits(currentUser.uid),
        ]);

        setMyRecruits(myList);
        setJoinedRecruits(joinedList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false); // 데이터 다 가져오면 로딩 끝
      }
    });

    return () => unsub();
  }, []);

  // (Firebase가 확인하는 동안에는 무조건 로딩 화면을 보여줌)
  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-20 w-20 rounded-full mb-4"/>
        <Skeleton className="h-40 w-full rounded-xl"/>
      </div>
    );
  }

  // 로딩이 끝났는데도 user가 없으면 그때 튕겨냄
  if (!user) {
    return <div className="p-6 text-center mt-10">로그인이 필요한 서비스입니다. </div>;
  }

  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">마이페이지 </h1>

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

      {/* 참여 중인 러닝 */}
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

      {/* 내가 만든 모집 글 */}
      <section>
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
    </div>
  );
}