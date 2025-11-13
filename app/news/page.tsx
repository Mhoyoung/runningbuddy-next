// app/news/page.tsx
"use client";

import { useEffect, useState } from "react";
import NewsCard from "@/components/NewsCard";
import { getNewsList, NewsItem } from "@/firebase/news";
import Link from "next/link";

export default function NewsPage() {
  const [list, setList] = useState<NewsItem[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getNewsList();
      setList(data);
    })();
  }, []);

  return (
    <section className="p-4 pb-24 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold mb-6">소식</h2>

      <div className="space-y-4">
        {list.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* 작성 버튼: 흰 배경 + 검정 글씨 */}
      <Link
        href="/news/new"
        className="fixed bottom-6 right-6 rounded-full shadow-lg active:scale-95 transition
                   bg-white text-black border border-gray-300 w-14 h-14 flex items-center justify-center"
        aria-label="소식 작성"
      >
        <span className="text-3xl leading-none">+</span>
      </Link>
    </section>
  );
}
