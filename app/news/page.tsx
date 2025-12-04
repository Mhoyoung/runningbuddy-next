"use client";

import { useEffect, useState } from "react";
import { getNewsList } from "@/firebase/news";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getNewsList();
      setNews(data);
    }
    load();
  }, []);

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 px-1">소식 / 공지 📢</h1>

      <div className="space-y-3">
        {news.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.id}`}
            className="block bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition active:scale-[0.99]"
          >
            <div className="flex justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1 leading-snug">
                  {item.title}
                </h3>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span className="font-medium text-blue-600">{item.source}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{item.date}</span>
                </div>
              </div>
              <FaChevronRight className="text-gray-300 shrink-0" size={14} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}