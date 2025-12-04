"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import ReviewCard from "@/components/ReviewCard";
import Skeleton from "@/components/Skeleton";
import { useInView } from "react-intersection-observer";
import FloatingButton from "@/components/FloatingButton"; 

// 정렬 옵션 타입
type SortOption = "latest" | "popular";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>("latest");

  const { ref, inView } = useInView();

  const fetchReviews = useCallback(async (isInit = false) => {
    if (loading) return;
    if (!isInit && !hasMore) return;

    setLoading(true);

    try {
      const reviewsRef = collection(db, "reviews");
      let q;
      const sortField = sortOption === "latest" ? "createdAt" : "likes";

      if (isInit) {
        q = query(reviewsRef, orderBy(sortField, "desc"), limit(6));
      } else if (lastDoc) {
        q = query(
          reviewsRef,
          orderBy(sortField, "desc"),
          startAfter(lastDoc),
          limit(6)
        );
      } else {
        setLoading(false);
        return;
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
      } else {
        const newReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews((prev) => (isInit ? newReviews : [...prev, ...newReviews]));
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        if (snapshot.docs.length < 6) setHasMore(false);
      }
    } catch (error) {
      console.error("리뷰 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading, hasMore, sortOption]);

  useEffect(() => {
    setReviews([]);
    setLastDoc(null);
    setHasMore(true);
    fetchReviews(true);
  }, [sortOption]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchReviews(false);
    }
  }, [inView, hasMore, loading, fetchReviews]);

  return (
    <div className="p-4 pb-24 max-w-[480px] mx-auto min-h-screen border-x border-gray-100 shadow-sm bg-white relative">
      {/* 상단 헤더 & 정렬 버튼 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">러닝 리뷰 🏃‍♂️</h1>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="p-2 border rounded-lg text-sm bg-white shadow-sm"
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순 (좋아요)</option>
        </select>
      </div>

      {/* 리뷰 리스트 */}
      <div className="grid grid-cols-2 gap-4">
        {reviews.map((review, index) => (
          <ReviewCard
            key={`${review.id}-${index}`}
            id={review.id}
            image={review.image}
            text={review.text}
            likes={review.likes}
            likedBy={review.likedBy || []}
            userId={review.userId}
          />
        ))}
      </div>

      {/* 로딩 스켈레톤 & 무한 스크롤 트리거 */}
      <div ref={ref} className="mt-6">
        {loading && (
          <div className="grid grid-cols-2 gap-4">
             <Skeleton className="h-40 w-full rounded-xl" />
             <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        )}
      </div>

      {!hasMore && reviews.length > 0 && (
        <p className="text-center text-gray-400 mt-6 text-sm">
          모든 리뷰를 다 봤어요! 🎉
        </p>
      )}

      {/* 글쓰기 버튼 추가 */}
      <FloatingButton href="/review/new" />
    </div>
  );
}