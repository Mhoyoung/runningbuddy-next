// components/NewsCard.tsx
"use client";

import Link from "next/link";
import { NewsItem } from "@/firebase/news";

interface Props {
  item: NewsItem;
}

export default function NewsCard({ item }: Props) {
  return (
    <Link
      href={`/news/${item.id}`}
      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
    >
      <div className="w-full h-36 rounded-lg overflow-hidden bg-gray-200 mb-3">
        {item.img ? (
          <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <h3 className="font-semibold text-lg">{item.title}</h3>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.content}</p>
      <p className="text-gray-400 text-xs mt-2">{item.date}</p>
    </Link>
  );
}
