"use client";

import { useState } from "react";

export default function ReviewDetailPage({ params }: any) {
  // 지금은 더미 데이터 (나중에 Firestore 데이터로 대체)
  const mockPost = {
    id: params.id,
    img: "/no-image.png", // 나중에 실제 업로드한 이미지로 대체
    text: "오늘 반포대교에서 러닝하고 왔어요! 너무 힘들었지만 보람 있었음!",
    likes: 12,
    comments: [
      { id: 1, writer: "runner01", text: "와 멋지네요!" },
      { id: 2, writer: "fastman", text: "저도 반포 갑니다!" },
    ],
  };

  const [like, setLike] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <section className="p-4 pb-24">
      {/* 사진 */}
      <div className="w-full">
        <img
          src={mockPost.img}
          alt=""
          className="w-full rounded-xl object-cover"
        />
      </div>

      {/* 글 영역 */}
      <div className="mt-4">
        <p className="text-gray-800 whitespace-pre-line">
          {mockPost.text}
        </p>
      </div>

      {/* 좋아요 */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setLike(!like)}
          className="text-2xl active:scale-90 transition"
        >
          {like ? "❤️" : "🤍"}
        </button>
        <span className="text-gray-600">{mockPost.likes + (like ? 1 : 0)} 좋아요</span>
      </div>

      {/* 댓글 리스트 */}
      <div className="mt-6 space-y-4">
        {mockPost.comments.map((c) => (
          <div key={c.id} className="bg-gray-100 p-3 rounded-xl">
            <p className="text-sm font-bold">{c.writer}</p>
            <p className="text-gray-700">{c.text}</p>
          </div>
        ))}
      </div>

      {/* 댓글 입력 */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-3 flex items-center gap-3">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="댓글 입력..."
          className="flex-1 border rounded-xl px-3 py-2"
        />
        <button className="bg-primary text-white px-4 py-2 rounded-xl active:scale-95">
          등록
        </button>
      </div>
    </section>
  );
}
