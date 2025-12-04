"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  getRecruitDetail, 
  deleteRecruit, 
  joinRecruit,
  leaveRecruit 
} from "../../../firebase/recruit"; 
import { auth } from "../../../firebase/config";

export default function RecruitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);

  const [post, setPost] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (auth.currentUser) setCurrentUser(auth.currentUser);
      const data: any = await getRecruitDetail(id);
      setPost(data);
      if (auth.currentUser && data && data.participants) {
        if (data.participants.includes(auth.currentUser.uid)) {
          setIsJoined(true);
        }
      }
    };

    load();
  }, [id]);

  // 참여 / 취소 버튼 핸들러
  const handleJoinToggle = async () => {
    if (!currentUser) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    if (!isJoined && post.currentPeople >= post.maxPeople) {
      alert("아쉽지만 모집 인원이 꽉 찼습니다.");
      return;
    }

    if (!confirm(isJoined ? "참여를 취소하시겠습니까?" : "이 러닝에 참여하시겠습니까?")) return;

    try {
      if (isJoined) {
        await leaveRecruit(id, currentUser.uid);
        alert("참여가 취소되었습니다.");
        setIsJoined(false);
        setPost((prev: any) => ({ ...prev, currentPeople: prev.currentPeople - 1 }));
      } else {
        await joinRecruit(id, currentUser.uid);
        alert("참여 완료! 약속 장소에서 만나요 🏃‍♂️");
        setIsJoined(true);
        setPost((prev: any) => ({ ...prev, currentPeople: prev.currentPeople + 1 }));
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (confirm("정말 이 모집 글을 삭제하시겠습니까?")) {
      try {
        await deleteRecruit(id);
        alert("삭제되었습니다.");
        router.replace("/recruit");
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (!post) return <p className="p-6 text-center text-gray-500">불러오는 중...</p>;

  // 작성자 본인인지 확인
  const isMyPost = currentUser && post.uid === currentUser.uid;

  return (
    <section className="p-6 max-w-lg mx-auto pb-24 min-h-screen bg-white">
      {/* 제목 */}
      <h2 className="text-2xl font-bold mb-4 leading-tight">{post.title}</h2>

      {/* 상세 정보 카드 */}
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
          <span className={post.currentPeople >= post.maxPeople ? "text-red-500 font-bold" : ""}>
             {post.currentPeople}/{post.maxPeople}명
             {post.currentPeople >= post.maxPeople && " (마감)"}
          </span>
        </div>
      </div>

      {/* 본문 */}
      <div className="mb-10">
        <p className="font-bold text-lg mb-2">상세 내용</p>
        <p className="whitespace-pre-line text-gray-600 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* 하단 버튼 (작성자는 삭제, 남은 참여/취소) */}
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
            onClick={handleJoinToggle}
            className={`flex-1 py-3.5 rounded-xl font-bold shadow-md transition active:scale-95 ${
              isJoined 
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300" // 참여 중이면 회색 버튼
                : "bg-black text-white hover:bg-gray-800"       // 미참여면 검은 버튼
            }`}
          >
            {isJoined ? "참여 취소하기" : "참여하기"}
          </button>
        )}
      </div>
    </section>
  );
}