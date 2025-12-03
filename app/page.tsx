"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecentRecruits } from "@/firebase/recruit";
import { getRecentReviews } from "@/firebase/review"; // ✅ 리뷰 함수 가져오기
import Skeleton from "@/components/Skeleton";

export default function Home() {
  const [recentRecruits, setRecentRecruits] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]); // ✅ 리뷰 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 🔥 모집글과 리뷰 데이터를 동시에 가져오기 (Promise.all)
        const [recruitsData, reviewsData] = await Promise.all([
          getRecentRecruits(),
          getRecentReviews(),
        ]);
        
        setRecentRecruits(recruitsData);
        setRecentReviews(reviewsData);
      } catch (error) {
        console.error("데이터 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const recentNews = [
    { id: 1, title: "서울 마라톤 접수 안내", date: "2025-11-05" },
    { id: 2, title: "크루 연합 러닝 이벤트", date: "2025-11-03" },
    { id: 3, title: "초보 러너 팁 공개", date: "2025-11-01" },
  ];

  return (
    <div className="flex flex-col items-center px-4 py-6 pb-24 bg-gray-50 min-h-screen">
      
      {/* 배너 */}
      <div className="w-full rounded-xl overflow-hidden shadow-md relative h-48 group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1552674605-469400cc61bc?auto=format&fit=crop&q=80&w=800"
          alt="러닝 배너"
          className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <p className="text-white font-bold text-lg drop-shadow-md">오늘도 힘차게 달려볼까요? 🔥</p>
        </div>
      </div>

      {/* 소개 */}
      <section className="mt-6 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">RunningBuddy</h2>
        <p className="text-gray-500 mt-1 text-sm font-medium">
          함께 달리고, 함께 기록하는 러너들의 공간 🏃‍♂️
        </p>
      </section>

      {/* 🔥 최신 모집 */}
      <section className="w-full mt-8">
        <div className="flex justify-between items-end mb-3 px-1">
          <h3 className="text-lg font-bold text-gray-800">최신 모집 🔥</h3>
          <Link href="/recruit" className="text-primary text-sm font-medium hover:underline">
            더보기 →
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            [1, 2].map((i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
          ) : recentRecruits.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300 text-gray-400 text-sm">
              <p>아직 모집 중인 러닝이 없어요.</p>
              <Link href="/recruit/new" className="text-blue-500 font-bold underline mt-1 inline-block">
                첫 모집 글 올리기
              </Link>
            </div>
          ) : (
            recentRecruits.map((r) => (
              <Link
                key={r.id}
                href={`/recruit/${r.id}`}
                className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition active:scale-[0.99]"
              >
                <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-gray-900 line-clamp-1 text-base">{r.title}</p>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full shrink-0">
                        {r.time}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>📍 {r.location}</span>
                    <span className="text-gray-300">|</span>
                    <span>{r.maxPeople}명 모집</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 🔥 최신 리뷰 (진짜 데이터 연동됨) */}
      <section className="w-full mt-8">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-lg font-bold text-gray-800">최신 리뷰 📸</h3>
          <Link href="/review" className="text-primary text-sm font-medium hover:underline">
            더보기 →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {loading ? (
             [1, 2, 3].map(i => <Skeleton key={i} className="aspect-square w-full rounded-xl" />)
          ) : recentReviews.length === 0 ? (
             <div className="col-span-3 text-center py-6 bg-gray-100 rounded-xl text-gray-400 text-xs">
                아직 등록된 리뷰가 없습니다 📷
             </div>
          ) : (
            recentReviews.map((rev) => (
              <Link
                key={rev.id}
                href="/review"
                className="relative block w-full aspect-square bg-gray-200 rounded-xl overflow-hidden group"
              >
                <img 
                  src={rev.image} 
                  alt="Review" 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300" 
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 pt-4">
                  <p className="text-white text-xs font-bold flex items-center gap-1">
                     ♥ {rev.likes}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* 소식 (더미) */}
      <section className="w-full mt-8">
        <div className="flex justify-between items-center mb-3 px-1">
          <h3 className="text-lg font-bold text-gray-800">소식 📢</h3>
          <Link href="/news" className="text-primary text-sm font-medium hover:underline">
            더보기 →
          </Link>
        </div>

        <div className="space-y-3">
          {recentNews.map((n) => (
            <div
              key={n.id}
              className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                  <span className="text-xs text-gray-400">{n.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}