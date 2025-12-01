"use client";

import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toggleLike } from "@/firebase/review";
import { auth } from "@/firebase/auth";
import ReviewModal from "./ReviewModal";

interface ReviewCardProps {
  id: string;
  image: string;
  text: string;
  likes: number;
  likedBy: string[];
}

export default function ReviewCard({ id, image, text, likes, likedBy }: ReviewCardProps) {
  const user = auth.currentUser;
  const alreadyLiked = user ? likedBy.includes(user.uid) : false;

  const [liked, setLiked] = useState(alreadyLiked);
  const [count, setCount] = useState(likes);
  const [openModal, setOpenModal] = useState(false);

  async function handleLike() {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLiked(!liked);
    setCount((prev) => prev + (liked ? -1 : 1));

    await toggleLike(id, user.uid, liked);
  }

  return (
    <>
      <div
        className="relative rounded-xl overflow-hidden cursor-pointer transition duration-200"
        onClick={() => setOpenModal(true)}
      >
        <img src={image} className="w-full rounded-xl object-cover" />

        {/* Hover Layer */}
        <div className="absolute inset-0 bg-black/50 text-white opacity-0 hover:opacity-100 transition p-3 flex justify-between flex-col">
          <p className="text-sm line-clamp-2">{text}</p>

          <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className="flex items-center gap-2">
            {liked ? <FaHeart className="text-red-400" /> : <FaRegHeart />}
            <span>{count}</span>
          </button>
        </div>
      </div>

      {/* 모달 */}
      <ReviewModal 
        open={openModal}
        onClose={() => setOpenModal(false)}
        image={image}
        text={text}
        likes={count}
        liked={liked}
        id={id}
      />
    </>
  );
}
