"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function MyPage() {
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ 로그인 감지
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // 로그인 안 되어 있으면 로그인 페이지로 이동
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);

      // ✅ Firestore에서 프로필 정보 불러오기
      const ref = doc(db, "users", currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setNickname(data.nickname);
        setEmail(data.email);
        setCreatedAt(
          data.createdAt?.toDate
            ? data.createdAt.toDate().toLocaleDateString()
            : ""
        );
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );

  return (
    <section className="p-6 mt-12">
      <h1 className="text-3xl font-bold mb-6">마이페이지</h1>

      <div className="bg-white shadow p-6 rounded-xl space-y-4">

        {/* 프로필 사진 자리 */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-200" />
        </div>

        {/* 닉네임 */}
        <div>
          <p className="text-sm text-gray-500">닉네임</p>
          <p className="text-lg font-semibold">{nickname}</p>
        </div>

        {/* 이메일 */}
        <div>
          <p className="text-sm text-gray-500">이메일</p>
          <p className="text-lg font-semibold">{email}</p>
        </div>

        {/* 가입 날짜 */}
        <div>
          <p className="text-sm text-gray-500">가입 날짜</p>
          <p className="text-lg font-semibold">{createdAt}</p>
        </div>

       <button
         className="w-full py-3 bg-primary text-white rounded-lg font-semibold active:scale-95"
         onClick={() => (window.location.href = "/mypage/edit")}
        >
         프로필 수정
        </button>
      </div>
    </section>
  );
}
