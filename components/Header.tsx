"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import SlideMenu from "./SlideMenu";
import { auth, db } from "@/firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null); // 로그인한 유저 정보
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    // ✅ 로그인 상태 감지
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // ✅ Firestore에서 닉네임 불러오기
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setNickname(snap.data().nickname);
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
    window.location.href = "/"; // 로그아웃 후 홈으로
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-14 px-4 flex items-center justify-between bg-white shadow-sm z-50">
        
        {/* 로고 */}
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          RunningBuddy
        </Link>

        {/* ✅ 로그인 상태에 따라 다른 버튼 표시 */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* 닉네임 표시 */}
            <span className="text-gray-600 font-medium">안녕하세요, {nickname}님</span>

            {/* 로그아웃 */}
            <button
              className="text-red-500 text-sm font-semibold active:scale-95"
              onClick={handleLogout}
            >
              로그아웃
            </button>

            {/* 메뉴 버튼 */}
            <button
              className="text-primary font-semibold text-sm active:scale-95"
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
              className="text-primary font-semibold text-sm active:scale-95"
            >
              로그인
            </Link>

            {/* 메뉴 버튼 */}
            <button
              className="text-primary font-semibold text-sm active:scale-95"
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
