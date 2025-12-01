"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { auth } from "@/firebase/auth";
import { addComment, listenComments } from "@/firebase/review";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  image: string;
  text: string;
  likes: number;
  liked: boolean;
  id: string;
}

export default function ReviewModal({ open, onClose, image, text, likes, liked, id }: ReviewModalProps) {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    return listenComments(id, setComments);
  }, [open, id]);

  async function handleCommentSubmit() {
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!commentText.trim()) return;

    await addComment(id, commentText, auth.currentUser.uid);
    setCommentText("");
  }

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg overflow-hidden w-full max-w-lg h-full md:h-auto md:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={image} className="w-full object-cover h-[300px] md:h-[350px]" />

        <div className="p-4 flex flex-col gap-4 overflow-auto">
          
          <p className="text-lg font-semibold">{text}</p>

          <div className="flex items-center gap-2">
            {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            <span>{likes}</span>
          </div>

          {/* 댓글 입력 */}
          <div className="flex gap-2">
            <input
              className="border flex-1 p-2 rounded-md"
              placeholder="댓글 입력..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-black text-white px-4 rounded-md"
            >
              등록
            </button>
          </div>

          {/* 댓글 리스트 */}
          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="border-b pb-2">
                <p className="text-sm">{c.text}</p>
                <span className="text-xs text-gray-400">익명 사용자</span>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="mt-6 bg-gray-200 py-2 rounded-md"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
