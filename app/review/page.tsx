"use client";

import { useEffect, useState } from "react";
import MasonryWrapper from "@/components/MasonryWrapper";
import ReviewCard from "@/components/ReviewCard";
import { getReviews, Review } from "@/firebase/review";
import FloatingButton from "@/components/FloatingButton";

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getReviews();
      setReviews(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-5 text-gray-500">불러오는 중...</div>;

  return (
    <div className="p-3 pb-20">
      <h2 className="text-xl font-semibold mb-4">🏃‍♀️ Running Reviews</h2>

      <MasonryWrapper>
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            id={review.id}
            image={review.image}
            text={review.text}
            likes={review.likes}
            likedBy={review.likedBy}
          />
        ))}
      </MasonryWrapper>
      <FloatingButton />
    </div>
  );
}
