"use client";

import Link from "next/link";

export default function FloatingButton() {
  return (
    <Link
      href="/review/new"
      className="fixed bottom-20 right-6 bg-black text-white rounded-full w-14 h-14 flex justify-center items-center text-3xl shadow-lg hover:scale-105 transition"
    >
      +
    </Link>
  );
}
