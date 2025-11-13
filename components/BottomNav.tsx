"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const menus = [
    { name: "홈", href: "/" },
    { name: "소식", href: "/news" },
    { name: "모집", href: "/recruit" },
    { name: "리뷰", href: "/review" },
    { name: "기록", href: "/record" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-50">
      {menus.map((menu) => (
        <Link
          key={menu.href}
          href={menu.href}
          className={`text-sm font-medium ${
            pathname === menu.href ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {menu.name}
        </Link>
      ))}
    </nav>
  );
}
