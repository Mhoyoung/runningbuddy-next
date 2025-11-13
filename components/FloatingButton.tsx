// components/FloatingButton.tsx
"use client";

import Link from "next/link";

interface Props {
  href: string;
  label?: string; // 접근성용
}
export default function FloatingButton({ href, label = "추가" }: Props) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="fixed bottom-6 right-6 rounded-full shadow-lg active:scale-95 transition
                 bg-white text-black border border-gray-300 w-14 h-14 flex items-center justify-center"
    >
      <span className="text-3xl leading-none">+</span>
    </Link>
  );
}
