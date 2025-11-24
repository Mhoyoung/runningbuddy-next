// components/ReviewModal.tsx
"use client";

type Review = {
  id: number;
  img: string | null;
  text: string;
  likes: number;
};

export default function ReviewModal({
  review,
  onClose,
}: {
  review: Review;
  onClose: () => void;
}) {
  const dummyComments = [
    { id: 1, author: "러너1", text: "와 분위기 너무 좋다!" },
    { id: 2, author: "러너2", text: "다음에 같이 뛰어요 🙌" },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      {/* 바깥 클릭 시 닫기 */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      ></div>

      {/* 모달 박스 */}
      <div className="relative bg-white rounded-xl max-w-4xl w-[95%] h-[80vh] md:h-[70vh] shadow-xl flex flex-col md:flex-row overflow-hidden z-50">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 text-xl leading-none bg-white"
        >
          ×
        </button>

        {/* 왼쪽: 큰 이미지 */}
        <div className="md:w-2/3 w-full bg-black flex items-center justify-center">
          {review.img ? (
            <img
              src={review.img}
              alt={review.text}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="w-full h-full bg-gray-300" />
          )}
        </div>

        {/* 오른쪽: 텍스트 + 댓글 */}
        <div className="md:w-1/3 w-full flex flex-col p-4">
          {/* 글 내용 */}
          <div className="flex-1 overflow-y-auto pr-1">
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {review.text}
            </p>

            <div className="mt-3 text-sm text-gray-500">
              ♥ {review.likes}명이 좋아합니다
            </div>

            <div className="h-[1px] bg-gray-200 my-4" />

            {/* 댓글 리스트 (더미) */}
            <h3 className="text-sm font-semibold mb-2">댓글</h3>
            <div className="space-y-2 text-sm">
              {dummyComments.map((c) => (
                <div key={c.id} className="border-b border-gray-100 pb-2">
                  <p className="font-semibold text-gray-700">{c.author}</p>
                  <p className="text-gray-600">{c.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 댓글 입력 */}
          <div className="mt-3">
            <textarea
              className="w-full border rounded-lg px-3 py-2 text-sm resize-none h-16"
              placeholder="댓글을 남겨보세요 (기능은 나중에 연결 예정)"
            />
            <button
              className="mt-2 w-full border border-gray-300 rounded-lg py-2 text-sm font-semibold"
            >
              댓글 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
