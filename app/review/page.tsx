"use client";

import { useEffect, useState } from "react";
import { getReviewList } from "../../firebase/review";
import ReviewModal from "../../components/ReviewModal";
import FloatingButton from "../../components/FloatingButton";

export default function ReviewPage() {
  const [list, setList] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getReviewList();
      setList(data);
    };
    load();
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-lg font-bold mb-4">리뷰 갤러리</h2>

      {/* ✅ 3열 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {list.map((r) => (
          <div
            key={r.id}
            className="aspect-square overflow-hidden rounded-md cursor-pointer bg-gray-300"
            onClick={() => setSelected(r)}
          >
            {r.img ? (
              <img
                src={r.img}
                className="w-full h-full object-cover"
                alt=""
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {/* ✅ 모달 */}
      {selected && (
        <ReviewModal
          img={selected.img ?? ""}
          text={selected.text ?? ""}
          onClose={() => setSelected(null)}
        />
      )}

      {/* ✅ 플로팅 버튼 */}
      <FloatingButton href="/review/new" />
    </section>
  );
}
