"use client";

import { useState } from "react";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { toggleLike, deleteReview } from "@/firebase/review";
import { auth } from "@/firebase/config";
import ReviewModal from "./ReviewModal";

interface ReviewCardProps {
  id: string;
  image: string;
  text: string;
  likes: number;
  likedBy: string[];
  userId?: string; // 작성자 ID
}

export default function ReviewCard({ id, image, text, likes, likedBy, userId }: ReviewCardProps) {
  const user = auth.currentUser;
  const isOwner = user && userId && user.uid === userId; // 내 글인지 확인
  const alreadyLiked = user ? likedBy.includes(user.uid) : false;

  const [liked, setLiked] = useState(alreadyLiked);
  const [count, setCount] = useState(likes);
  const [openModal, setOpenModal] = useState(false);

  async function handleLike() {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => prev + (newLiked ? 1 : -1));

    await toggleLike(id, user.uid, liked);
  }

  // 카드 위에서 바로 삭제
  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("정말 삭제할까요?")) return;

    if (user) {
      await deleteReview(id, user.uid); 
      window.location.reload();
    }
  } // 👈 여기가 빠져 있었습니다!

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setOpenModal(true)}
      >
        {/* 카드 이미지 위에도 삭제 버튼 표시 (선택 사항) */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full z-20 hover:bg-red-500 transition"
          >
            <FaTrash size={12} />
          </button>
        )}

        <img src={image} className="w-full rounded-xl object-cover aspect-square bg-gray-100" />

        <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition p-3 flex flex-col justify-between">
          <p className="text-sm line-clamp-2">{text}</p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
            className="flex items-center gap-2"
          >
            {liked ? <FaHeart className="text-red-400" /> : <FaRegHeart />}
            <span>{count}</span>
          </button>
        </div>
      </div>

      <ReviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        image={image}
        text={text}
        likes={count}
        liked={liked}
        id={id}
        // 🔥 작성자 ID 전달
        userId={userId || ""} 
        onLikeChange={(newLiked, newCount) => {
          setLiked(newLiked);
          setCount(newCount);
        }}
      />
    </>
  );
}