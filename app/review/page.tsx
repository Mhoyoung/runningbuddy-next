// app/review/page.tsx
"use client";

import { useState } from "react";
import ReviewModal from "../../components/ReviewModal";

type Review = {
  id: number;
  img: string | null;
  text: string;
  likes: number;
};

export default function ReviewPage() {
  const [selected, setSelected] = useState<Review | null>(null);

  // 🔥 일단은 더미 데이터 (나중에 Firebase에서 가져오도록 바꿀 예정)
  const reviews: Review[] = [
    {
      id: 1,
      img: "/sample-run-1.jpg",
      text: "반포대교 야경 보면서 10km 완주! 컨디션 최고였음 😆",
      likes: 12,
    },
    {
      id: 2,
      img: "/sample-run-2.jpg",
      text: "새 신발 신고 첫 러닝 👟 발은 편했는데 숨은 많이 찼다...",
      likes: 7,
    },
    {
      id: 3,
      img: "/sample-run-3.jpg",
      text: "새벽 한강 공기 미쳤다… 사람도 없고 너무 좋음 🌄",
      likes: 23,
    },
    {
      id: 4,
      img: "/sample-run-4.jpg",
      text: "크루랑 같이 뛴 날! 끝나고 치킨까지 완벽한 하루 🍗",
      likes: 15,
    },
    {
      id: 5,
      img: "/sample-run-5.jpg",
      text: "혼자 달려도 재밌지만, 같이 뛰면 더 재밌다.",
      likes: 5,
    },
  ];

  return (
    <section className="p-4 pb-24 bg-gray-50 min-h-screen">
      <h2 className="text-lg font-bold mb-4">리뷰 갤러리</h2>

      {/* 🔥 핀터레스트 느낌 컬럼 레이아웃 */}
      <div className="columns-2 gap-3 md:columns-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="mb-3 break-inside-avoid relative cursor-pointer group"
            onClick={() => setSelected(r)}
          >
            {/* 이미지 박스 */}
            <div className="w-full overflow-hidden rounded-xl bg-gray-200">
              {r.img ? (
                <img
                  src={r.img}
                  alt={r.text}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200" />
              )}
            </div>

            {/* 호버 오버레이 */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-3 text-white">
              <p className="text-sm max-h-12 overflow-hidden">
                {r.text}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span>♥ {r.likes}</span>
                <span>자세히 보기</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 모달 */}
      {selected && (
        <ReviewModal
          review={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
