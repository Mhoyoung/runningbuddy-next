"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// ✅ deleteRecruit 함수 추가 (경로가 ../../../ 인지 확인해주세요)
import { getRecruitDetail, deleteRecruit } from "../../../firebase/recruit"; 
import { auth } from "../../../firebase/config";

export default function RecruitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [post, setPost] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // 1. 현재 로그인한 유저 확인
    if (auth.currentUser) {
      setCurrentUser(auth.currentUser);
    }

    // 2. 글 데이터 불러오기
    const load = async () => {
      const data = await getRecruitDetail(id);
      setPost(data);
    };

    load();
  }, [id]);

  // 🔥 삭제 버튼 클릭 시 실행
  const handleDelete = async () => {
    if (confirm("정말 이 모집 글을 삭제하시겠습니까?")) {
      try {
        await deleteRecruit(id); // Firebase에서 삭제
        alert("삭제되었습니다.");
        router.replace("/recruit"); // 리스트 페이지로 이동
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (!post) return <p className="p-6 text-center text-gray-500">불러오는 중...</p>;

  // ✅ 내가 쓴 글인지 확인 (내 uid와 글쓴이 uid 비교)
  const isMyPost = currentUser && post.uid === currentUser.uid;

  return (
    <section className="p-6 max-w-lg mx-auto pb-24 min-h-screen bg-white">
      {/* 제목 영역 */}
      <h2 className="text-2xl font-bold mb-4 leading-tight">{post.title}</h2>

      {/* 📅 상세 정보 카드 (날짜, 시간, 장소, 인원) */}
      <div className="bg-gray-50 p-5 rounded-xl mb-8 border border-gray-100 shadow-sm space-y-3 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span className="font-bold w-12 text-gray-900">일시</span>
          <span>{post.date} {post.time}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold w-12 text-gray-900">장소</span>
          <span>{post.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold w-12 text-gray-900">인원</span>
          <span>최대 {post.maxPeople || 4}명</span>
        </div>
      </div>

      {/* 본문 내용 */}
      <div className="mb-10">
        <p className="font-bold text-lg mb-2">상세 내용</p>
        <p className="whitespace-pre-line text-gray-600 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* 🔘 버튼 영역 (fixed 제거하고 margin-top 추가) */}
      <div className="mt-10 pt-6 border-t border-gray-100 flex gap-3">
        {isMyPost ? (
          <button
            onClick={handleDelete}
            className="flex-1 bg-gray-100 text-red-500 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition active:scale-95"
          >
            삭제하기
          </button>
        ) : (
          <button
            onClick={() => alert("참여 기능은 준비 중입니다! 👋")}
            className="flex-1 bg-black text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-gray-800 transition active:scale-95"
          >
            참여하기
          </button>
        )}
      </div>
    </section> // section 닫는 태그 바로 위에 위치
  );
}