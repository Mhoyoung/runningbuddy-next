"use client";

import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default function FloatingButton({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="
        fixed bottom-6 right-6 
        bg-black text-white 
        w-14 h-14 
        rounded-full 
        flex items-center justify-center
        shadow-lg 
        active:scale-95 
        transition
        z-50
      "
    >
      <FaPlus size={20} />
    </Link>
  );
}
