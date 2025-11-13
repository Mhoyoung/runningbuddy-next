"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

export default function SlideMenu({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: any;
}) {
  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    window.location.href = "/";
  };

  return (
    <>
      {/* 배경 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* 오른쪽 슬라이드 메뉴 */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 p-6
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <h2 className="text-xl font-bold mb-6">RunningBuddy</h2>

        <nav className="flex flex-col space-y-4 text-lg font-medium">
          <Link href="/" onClick={onClose}>
            메인
          </Link>
          <Link href="/intro" onClick={onClose}>
            소개
          </Link>
          <Link href="/news" onClick={onClose}>
            소식
          </Link>
          <Link href="/recruit" onClick={onClose}>
            모집
          </Link>
          <Link href="/review" onClick={onClose}>
            리뷰
          </Link>
          <Link href="/record" onClick={onClose}>
            기록
          </Link>

          {/* ✅ 로그인 상태에 따라 메뉴 변경 */}
          {user ? (
            <>
              <Link href="/mypage" onClick={onClose}>
                마이페이지
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-red-500 font-semibold"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link href="/login" onClick={onClose}>
              로그인
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
