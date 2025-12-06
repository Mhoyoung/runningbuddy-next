"use client";

import Link from "next/link";

interface RecruitItem {
  id: string;
  title: string;
  content: string;
  time: string;
  location: string;
}

export default function RecruitCard({ item }: { item: RecruitItem }) {
  return (
    <Link
      href={`/recruit/${item.id}`}
      className="block p-4 bg-gray-100 rounded-lg shadow"
    >
      <h3 className="font-bold text-lg">{item.title}</h3>

      <p className="mt-2 text-gray-700 line-clamp-2">{item.content}</p>

      <div className="mt-3 text-sm text-gray-600">
        <p>⏱ {item.time}</p>
        <p>📍 {item.location}</p>
      </div>
    </Link>
  );
}
  