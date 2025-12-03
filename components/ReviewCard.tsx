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
  userId?: string;
}

export default function ReviewCard({ id, image, text, likes, likedBy, userId }: ReviewCardProps) {
  const user = auth.currentUser;
  const isOwner = user && user.uid === userId;
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
    setCount(prev => prev + (newLiked ? 1 : -1));

    await toggleLike(id, user.uid, liked);
  }

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("정말 삭제할까요?")) return;

    await deleteReview(id, user!.uid);
    window.location.reload();
  }

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer"
        onClick={() => setOpenModal(true)}
      >
        {isOwner && (
          <button
            onClick={handleDelete}
            className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full z-20"
          >
            <FaTrash />
          </button>
        )}

        <img src={image} className="w-full rounded-xl object-cover" />

        <div className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 transition p-3 flex justify-between flex-col">
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
        onLikeChange={(newLiked, newCount) => {
          setLiked(newLiked);
          setCount(newCount);
        }}
      />
    </>
  );
}
