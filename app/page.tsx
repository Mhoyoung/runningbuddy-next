"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentRecruits } from "@/firebase/recruit"; // ✅ 작성한 함수 가져오기
import Skeleton from "@/components/Skeleton"; // 스켈레톤 컴포넌트

export default function Home() {
  // 🔥 1. 모집 글 상태 관리 (더미 데이터 삭제됨)
  const [recentRecruits, setRecentRecruits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 2. 데이터 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getRecentRecruits();
        setRecentRecruits(data);
      } catch (error) {
        console.error("데이터 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // (리뷰와 뉴스는 아직 더미로 유지)
  const recentReviews = [
    { id: 1, img: null },
    { id: 2, img: null },
    { id: 3, img: null },
  ];

  const recentNews = [
    { id: 1, title: "서울 마라톤 안내", date: "2025-11-05" },
    { id: 2, title: "크루 연합 러닝 이벤트", date: "2025-11-03" },
    { id: 3, title: "초보 러너 팁 공개", date: "2025-11-01" },
  ];

  return (
    <div className="flex flex-col items-center px-4 py-6 pb-24 bg-gray-50 min-h-screen">

      {/* 배너 */}
      <div className="w-full rounded-xl overflow-hidden shadow-md relative h-48 group">
        <img
          src="https://images.unsplash.com/photo-1552674605-469400cc61bc?auto=format&fit=crop&q=80&w=800"
          alt="러닝 배너"
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-bold text-lg">오늘도 힘차게 달려볼까요? 🔥</p>
        </div>
      </div>

      {/* 소개 */}
      <section className="mt-7 text-center">
        <h2 className="text-2xl font-bold">RunningBuddy</h2>
        <p className="text-gray-600 mt-2 text-sm">
          함께 달리고, 함께 기록하는 러너들의 공간 🏃‍♂️
        </p>
      </section>

      {/* 🔥 최신 모집 (실제 데이터 연동) */}
      <section className="w-full mt-10">
        <div className="flex justify-between items-end mb-3 px-1">
          <h3 className="text-lg font-bold text-gray-800">최신 모집 🔥</h3>
          <Link href="/recruit" className="text-primary text-sm font-medium hover:underline">
            더보기 →
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            // 로딩 중일 때 스켈레톤 표시
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
          ) : recentRecruits.length === 0 ? (
            // 데이터가 없을 때
            <div className="text-center py-6 bg-white rounded-xl shadow-sm text-gray-400 text-sm">
              <p>아직 모집 중인 러닝이 없어요.</p>
              <Link href="/recruit/new" className="text-blue-500 font-bold underline mt-1 inline-block">
                첫 모집 글을 올려보세요!
              </Link>
            </div>
          ) : (
            // 실제 데이터 매핑
            recentRecruits.map((r) => (
              <Link
                key={r.id}
                href={`/recruit/${r.id}`}
                className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition active:scale-[0.99]"
              >
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-gray-900 line-clamp-1">{r.title}</p>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                        {r.time}
                    </span>
                </div>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                    📍 {r.location}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 최신 리뷰 (더미 데이터) */}
      <section className="w-full mt-10">
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="text-lg font-bold text-gray-800">최신 리뷰 📸</h3>
          <Link href="/review" className="text-primary text-sm font-medium hover:underline">
            더보기 →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {recentReviews.map((rev) => (
            <Link
              key={rev.id}
              href="/review"
              className="block w-full aspect-square bg-gray-200 rounded-xl hover:opacity-90 transition animate-pulse"
            ></Link>
          ))}
        </div>
      </section>

      {/* 최신 소식 (더미 데이터) */}
      <section className="w-full mt-10">
        <div className="flex justify-between items-center mb-2 px-1">
          <h3 className="text-lg font-bold text-gray-800">소식 📢</h3>
          <Link href="/news" className="text-primary text-sm font-medium hover:underline">
            더보기 →
          </Link>
        </div>

        <div className="space-y-3">
          {recentNews.map((n) => (
            <Link
              key={n.id}
              href={`/news/${n.id}`} // 나중에 news 페이지 만들면 연결
              className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold text-gray-900">{n.title}</p>
              <p className="text-gray-500 text-sm mt-1">{n.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}