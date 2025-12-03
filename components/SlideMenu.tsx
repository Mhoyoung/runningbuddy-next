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

  // 애니메이션 효과를 위해 open 상태가 true일 때 visible도 true로 설정
  useEffect(() => {
    if (open) {
      setVisible(true);
      // 메뉴가 열릴 때 스크롤 막기
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible && !open) return null;

  return (
    // 1. 최상위 컨테이너: 화면 정중앙의 앱(480px) 위치에 고정
    <div 
      className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-full z-[60] pointer-events-none`}
    >
      {/* 2. 배경 (Backdrop): 앱 화면만 어둡게 덮음 */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 pointer-events-auto ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* 3. 슬라이드 패널: 앱 화면 오른쪽 끝에서 나옴 */}
      <div
        className={`absolute top-0 right-0 h-full w-[70%] bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col h-full">
          {/* 닫기 버튼 */}
          <div className="flex justify-end mb-6">
            <button onClick={onClose} className="text-2xl font-light p-2 hover:bg-gray-100 rounded-full transition">
              ✕
            </button>
          </div>

          <h2 className="text-xl font-bold mb-8 px-2">RunningBuddy</h2>

          {/* 네비게이션 메뉴 */}
          <nav className="space-y-6 flex-1 text-lg font-medium text-gray-700 px-2">
            <Link href="/" onClick={onClose} className="block hover:text-blue-500 transition">
              🏠 메인
            </Link>
            <Link href="/review" onClick={onClose} className="block hover:text-blue-500 transition">
              🏃‍♂️ 리뷰
            </Link>
            <Link href="/recruit" onClick={onClose} className="block hover:text-blue-500 transition">
              🤝 모집
            </Link>
            <Link href="/record" onClick={onClose} className="block hover:text-blue-500 transition">
              ⏱️ 기록
            </Link>
            <Link href="/mypage" onClick={onClose} className="block hover:text-blue-500 transition">
              👤 마이페이지
            </Link>
          </nav>

          {/* 하단 로그인/로그아웃 버튼 */}
          <div className="mt-auto border-t pt-6 px-2">
            {user ? (
              <button
                onClick={async () => {
                  await signOut(auth);
                  onClose();
                  window.location.href = "/";
                }}
                className="w-full text-left text-red-500 font-semibold hover:bg-red-50 p-2 rounded transition"
              >
                로그아웃
              </button>
            ) : (
              <Link
                href="/login"
                onClick={onClose}
                className="block text-blue-600 font-bold hover:bg-blue-50 p-2 rounded transition"
              >
                로그인하기
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}