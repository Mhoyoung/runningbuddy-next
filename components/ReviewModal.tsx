"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { auth } from "@/firebase/config";
import { addComment, listenComments, deleteComment, toggleLike, deleteReview } from "@/firebase/review"; // ✅ deleteReview 추가

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  image: string;
  text: string;
  likes: number;
  liked: boolean;
  id: string;
  userId: string; // ✅ 작성자 ID 추가 (필수)
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
  userId, // ✅ 받아오기
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

  useEffect(() => {
    if (open) {
      setLikedState(liked);
      setLikeCount(likes);
    }
  }, [open, liked, likes]);

  // 좋아요 핸들러
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
    onLikeChange?.(newLiked, newCount);
  }

  // 댓글 등록 핸들러
  async function handleCommentSubmit() {
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!commentText.trim()) return;

    await addComment(id, commentText, auth.currentUser.uid);
    setCommentText("");
  }

  // 댓글 삭제 핸들러
  async function handleDeleteComment(commentId: string, commentUserId: string) {
    if (!auth.currentUser) return;
    if (auth.currentUser.uid !== commentUserId) {
      alert("삭제 권한이 없습니다.");
      return;
    }
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    await deleteComment(id, commentId, auth.currentUser.uid);
  }

  // 🔥 리뷰 삭제 핸들러 (새로 추가됨)
  async function handleDeleteReview() {
    if (!confirm("정말 이 리뷰를 삭제하시겠습니까? (되돌릴 수 없습니다)")) return;

    try {
      if (auth.currentUser) {
      await deleteReview(id, auth.currentUser.uid);
    }
      alert("리뷰가 삭제되었습니다.");
      onClose(); // 모달 닫기
      window.location.reload(); // 리스트 갱신을 위해 새로고침
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  }

  if (!open) return null;

  // ✅ 내가 쓴 리뷰인지 확인
  const isMyReview = user && userId === user.uid;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl overflow-hidden w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 🔥 삭제 버튼 (우측 상단, 내가 쓴 글일 때만) */}
        {isMyReview && (
          <button
            onClick={handleDeleteReview}
            className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-red-500 transition z-10"
            title="리뷰 삭제"
          >
            <FaTrash size={14} />
          </button>
        )}

        {/* 이미지 영역 */}
        <div className="bg-black flex items-center justify-center bg-gray-100">
           <img src={image} className="w-full h-auto max-h-[300px] object-contain" />
        </div>

        <div className="p-5 flex flex-col gap-4 overflow-y-auto flex-1">
          <p className="text-gray-800 leading-relaxed font-medium">{text}</p>

          <div className="flex items-center justify-between border-b pb-4">
             {/* 좋아요 버튼 */}
             <button onClick={handleLike} className="flex items-center gap-2 group">
              {likedState ? (
                <FaHeart className="text-red-500 text-xl transition scale-110" />
              ) : (
                <FaRegHeart className="text-gray-400 text-xl group-hover:text-red-400 transition" />
              )}
              <span className="font-bold text-gray-700">{likeCount}</span>
            </button>
          </div>

          {/* 댓글 리스트 */}
          <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
            {comments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">첫 댓글을 남겨보세요 👋</p>
            ) : (
                comments.map((c) => (
                <div key={c.id} className="flex justify-between items-start gap-2 bg-gray-50 p-2 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                         <span className="text-xs font-bold text-gray-600">{c.nickname}</span>
                         <span className="text-[10px] text-gray-400">
                            {new Date(c.createdAt?.seconds * 1000).toLocaleDateString()}
                         </span>
                      </div>
                      <p className="text-sm text-gray-800">{c.text}</p>
                    </div>

                    {auth.currentUser?.uid === c.userId && (
                    <button
                        onClick={() => handleDeleteComment(c.id, c.userId)}
                        className="text-gray-400 hover:text-red-500 p-1"
                    >
                        <FaTrash size={12} />
                    </button>
                    )}
                </div>
                ))
            )}
          </div>

          {/* 댓글 입력창 */}
          <div className="flex gap-2 pt-2">
            <input
              className="border border-gray-200 bg-gray-50 flex-1 p-3 rounded-xl text-sm outline-none focus:border-black transition"
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            />
            <button
              onClick={handleCommentSubmit}
              className="bg-black text-white px-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition"
            >
              등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}