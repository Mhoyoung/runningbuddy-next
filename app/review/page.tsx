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
import ReviewModal from "@/components/ReviewModal";
import Skeleton from "@/components/Skeleton";
import { useInView } from "react-intersection-observer"; // 👈 설치한 라이브러리

// 정렬 옵션 타입
type SortOption = "latest" | "popular";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 더 가져올 데이터가 있는지?
  const [sortOption, setSortOption] = useState<SortOption>("latest");

  // 무한 스크롤 감지용 (ref가 화면에 보이면 inView가 true가 됨)
  const { ref, inView } = useInView();

  // 🔥 데이터 불러오기 함수 (초기 로딩 & 더보기 공용)
  const fetchReviews = useCallback(async (isInit = false) => {
    if (loading) return; // 이미 로딩 중이면 중복 실행 방지
    if (!isInit && !hasMore) return; // 더 없으면 실행 안 함

    setLoading(true);

    try {
      const reviewsRef = collection(db, "reviews");
      let q;

      // 정렬 기준 설정
      const sortField = sortOption === "latest" ? "createdAt" : "likes";

      if (isInit) {
        // 1. 처음 불러올 때 (혹은 정렬 바꿨을 때)
        q = query(reviewsRef, orderBy(sortField, "desc"), limit(6));
      } else if (lastDoc) {
        // 2. 더보기 (마지막 문서 다음부터 가져오기)
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

        // 초기화면 덮어쓰기, 아니면 이어붙이기
        setReviews((prev) => (isInit ? newReviews : [...prev, ...newReviews]));
        
        // 다음 페이징을 위해 마지막 문서 저장
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        
        // 가져온 개수가 limit(6)보다 적으면 더 이상 데이터가 없는 것
        if (snapshot.docs.length < 6) setHasMore(false);
      }
    } catch (error) {
      console.error("리뷰 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading, hasMore, sortOption]);

  // 1. 정렬 옵션이 바뀌면 초기화 후 다시 로드
  useEffect(() => {
    setReviews([]);
    setLastDoc(null);
    setHasMore(true);
    fetchReviews(true);
  }, [sortOption]);

  // 2. 스크롤이 바닥에 닿으면(inView) 추가 로드
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchReviews(false);
    }
  }, [inView, hasMore, loading, fetchReviews]);

  return (
    <div className="p-4 pb-20 max-w-[480px] mx-auto min-h-screen border-x border-gray-100 shadow-sm bg-white">
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
            // 🔥 키 중복 방지 (id + index)
            key={`${review.id}-${index}`}
            id={review.id}
            image={review.image}
            text={review.text}
            likes={review.likes}
            likedBy={review.likedBy || []}
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
    </div>
  );
}