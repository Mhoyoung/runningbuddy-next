"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

interface SlideMenuProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export default function SlideMenu({ open, onClose, user }: SlideMenuProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden"; // 스크롤 막기
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible && !open) return null;

  return (
    // 1. 화면 정중앙(left-1/2)으로 오게 하고, 폭을 480px로 제한
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-full z-[60] pointer-events-none">
      
      {/* 2. 배경 (앱 화면만 어둡게) */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 pointer-events-auto ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 3. 메뉴 패널 (앱 화면의 오른쪽 끝에서 나옴) */}
      <div
        className={`absolute top-0 right-0 h-full w-[70%] bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-end mb-6">
            <button onClick={onClose} className="text-2xl p-2">✕</button>
          </div>

          <h2 className="text-xl font-bold mb-8">RunningBuddy</h2>

          <nav className="space-y-6 flex-1 text-lg font-medium text-gray-700">
            <Link href="/" onClick={onClose} className="block hover:text-blue-500">🏠 메인</Link>
            <Link href="/review" onClick={onClose} className="block hover:text-blue-500">🏃‍♂️ 리뷰</Link>
            <Link href="/recruit" onClick={onClose} className="block hover:text-blue-500">🤝 모집</Link>
            <Link href="/record" onClick={onClose} className="block hover:text-blue-500">⏱️ 기록</Link>
            <Link href="/mypage" onClick={onClose} className="block hover:text-blue-500">👤 마이페이지</Link>
          </nav>

          <div className="mt-auto border-t pt-6">
            {user ? (
              <button
                onClick={async () => {
                  await signOut(auth);
                  onClose();
                  window.location.href = "/";
                }}
                className="w-full text-left text-red-500 font-semibold"
              >
                로그아웃
              </button>
            ) : (
              <Link href="/login" onClick={onClose} className="block text-blue-600 font-bold">
                로그인하기
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}