"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SlideMenu from "./SlideMenu";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    // ✅ 로그인 상태 감지
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // 🚀 1. 일단 Auth 정보나 기본값으로 즉시 설정 (로딩 딜레이 없이 보여줌)
        // (회원가입 직후에는 displayName이 없을 수 있으므로 '러너'를 기본값으로 사용)
        setNickname(currentUser.displayName || "러너");

        // 🚀 2. Firestore에서 닉네임 확인 후 업데이트 (더 정확한 정보)
        try {
          const ref = doc(db, "users", currentUser.uid);
          const snap = await getDoc(ref);

          if (snap.exists()) {
            const data = snap.data();
            // DB에 저장된 닉네임이 있다면 그걸로 교체
            if (data.nickname) {
              setNickname(data.nickname);
            }
          }
        } catch (error) {
          console.error("닉네임 불러오기 실패:", error);
        }
      } else {
        setNickname("");
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ 로그아웃 기능
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/"; // 로그아웃 후 홈으로 새로고침 이동
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-14 px-4 flex items-center justify-between bg-white shadow-sm z-50">
        
        {/* 로고 */}
        <Link href="/" className="text-xl font-extrabold tracking-tight text-gray-900">
          RunningBuddy
        </Link>

        {/* ✅ 로그인 상태에 따라 다른 버튼 표시 */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* 닉네임 표시 */}
            <span className="text-gray-600 text-sm font-medium">
              안녕하세요, <span className="text-black font-bold">{nickname}</span>님
            </span>

            {/* 로그아웃 (선택 사항: 메뉴 안에도 있으므로 여기서 뺄 수도 있음) */}
            <button
              className="text-red-500 text-sm font-bold hover:text-red-600 transition"
              onClick={handleLogout}
            >
              로그아웃
            </button>

            {/* 메뉴 버튼 */}
            <button
              className="text-black font-bold text-sm"
              onClick={() => setOpen(true)}
            >
              메뉴
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {/* 로그인 버튼 */}
            <Link
              href="/login"
              className="text-blue-600 font-bold text-sm"
            >
              로그인
            </Link>

            {/* 메뉴 버튼 */}
            <button
              className="text-black font-bold text-sm"
              onClick={() => setOpen(true)}
            >
              메뉴
            </button>
          </div>
        )}
      </header>

      {/* 슬라이드 메뉴 */}
      <SlideMenu open={open} onClose={() => setOpen(false)} user={user} />
    </>
  );
}