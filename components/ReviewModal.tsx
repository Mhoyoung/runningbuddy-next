"use client";

export default function ReviewModal({
  img,
  text,
  onClose,
}: {
  img: string;
  text: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-4 w-full max-w-sm shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-lg overflow-hidden mb-3 bg-gray-200">
          {img ? (
            <img src={img} alt={text} className="w-full h-auto" />
          ) : (
            <div className="w-full h-48 bg-gray-200" />
          )}
        </div>

        <p className="text-gray-700 whitespace-pre-line">{text}</p>

        <button
          className="mt-4 bg-primary text-white w-full py-2 rounded-lg font-semibold"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
