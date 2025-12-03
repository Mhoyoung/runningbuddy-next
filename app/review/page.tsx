"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/firebase/config";
import { collection, query, orderBy, limit, getDocs, startAfter } from "firebase/firestore";
import ReviewCard from "@/components/ReviewCard";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [sortType, setSortType] = useState<"latest" | "popular">("latest");
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function loadReviews(reset = false) {
    if (loading) return;
    setLoading(true);

    const reviewsRef = collection(db, "reviews");

    const q = query(
      reviewsRef,
      orderBy(sortType === "latest" ? "createdAt" : "likes", "desc"),
      ...(reset ? [] : lastDoc ? [startAfter(lastDoc)] : []),
      limit(6)
    );

    const snapshot = await getDocs(q);

    const newReviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);

    setReviews((prev) => (reset ? newReviews : [...prev, ...newReviews]));

    setLoading(false);
  }

  // 🔥 정렬 변경 시 리스트 초기화 후 다시 로드
  useEffect(() => {
    setLastDoc(null);
    loadReviews(true);
  }, [sortType]);

  // 🔥 Intersection Observer → 무한 스크롤
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadReviews();
      }
    });

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loaderRef.current, lastDoc, loading]);

  return (
    <div className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">리뷰</h1>

      {/* 🔥 정렬 버튼 */}
      <div className="flex gap-3">
        <button
          className={`px-3 py-1 rounded-md border ${
            sortType === "latest" ? "bg-black text-white" : "bg-gray-100"
          }`}
          onClick={() => setSortType("latest")}
        >
          최신순
        </button>

        <button
          className={`px-3 py-1 rounded-md border ${
            sortType === "popular" ? "bg-black text-white" : "bg-gray-100"
          }`}
          onClick={() => setSortType("popular")}
        >
          인기순
        </button>
      </div>

      {/* Masonry UI */}
      <div className="grid grid-cols-2 gap-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            id={review.id}
            likes={review.likes}
            text={review.text}
            image={review.image}
            likedBy={review.likedBy || []}
            userId={review.userId}
          />
        ))}
      </div>

      {/* 🔥 무한스크롤 감지 영역 */}
      <div ref={loaderRef} className="h-10 flex justify-center items-center">
        {loading && <p className="text-gray-500 text-sm">불러오는 중...</p>}
      </div>
    </div>
  );
}
