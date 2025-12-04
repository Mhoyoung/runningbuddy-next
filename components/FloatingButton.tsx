"use client";

import Link from "next/link";
import { FaPlus } from "react-icons/fa";

interface FloatingButtonProps {
  href: string;
}

export default function FloatingButton({ href }: FloatingButtonProps) {
  return (
    // 1. 투명한 컨테이너를 화면 중앙(앱 너비 480px)에 고정
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 z-50 pointer-events-none flex justify-end">
      
      {/* 2. 실제 버튼 (클릭 가능하도록 pointer-events-auto) */}
      <Link href={href} className="pointer-events-auto">
        <button className="w-14 h-14 bg-black text-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition">
          <FaPlus />
        </button>
      </Link>
      
    </div>
  );
}