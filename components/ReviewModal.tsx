"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { auth } from "@/firebase/config";
import { addComment, listenComments, deleteComment, toggleLike } from "@/firebase/review";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  image: string;
  text: string;
  likes: number;
  liked: boolean;
  id: string;
  onLikeChange?: (liked: boolean, count: number) => void;
}

export default function ReviewModal({
  open,
  onClose,
  image,
  text,
  likes,
  liked,
  id,
  onLikeChange,
}: ReviewModalProps) {
  const user = auth.currentUser;

  const [likedState, setLikedState] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    return listenComments(id, setComments);
  }, [open, id]);

  // ⭐ 모달을 다시 열 때 부모 상태로 초기화
  useEffect(() => {
    if (open) {
      setLikedState(liked);
      setLikeCount(likes);
    }
  }, [open, liked, likes]);


  async function handleLike() {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const newLiked = !likedState;
    const newCount = likeCount + (newLiked ? 1 : -1);

    setLikedState(newLiked);
    setLikeCount(newCount);

    await toggleLike(id, user.uid, likedState);

    // 🔥 ReviewCard로 동기화
    onLikeChange?.(newLiked, newCount);
  }

  async function handleCommentSubmit() {
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!commentText.trim()) return;

    await addComment(id, commentText, auth.currentUser.uid);
    setCommentText("");
  }

  async function handleDeleteComment(commentId: string, commentUserId: string) {
    if (!auth.currentUser) return;

    if (auth.currentUser.uid !== commentUserId) {
      alert("삭제 권한이 없습니다.");
      return;
    }

    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    await deleteComment(id, commentId, auth.currentUser.uid);
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

          {/* ❤️ 좋아요 버튼 */}
          <button onClick={handleLike} className="flex items-center gap-2">
            {likedState ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            <span>{likeCount}</span>
          </button>

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
              <div key={c.id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p className="text-sm">{c.text}</p>
                  <span className="text-xs text-gray-400">{c.nickname}</span>
                </div>

                {auth.currentUser?.uid === c.userId && (
                  <button
                    onClick={() => handleDeleteComment(c.id, c.userId)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={onClose} className="mt-6 bg-gray-200 py-2 rounded-md">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
