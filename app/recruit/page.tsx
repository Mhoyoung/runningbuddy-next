"use client";

import { useEffect, useState } from "react";
import FloatingButton from "../../components/FloatingButton";
import RecruitCard from "../../components/RecruitCard";
import { getRecruitList } from "../../firebase/recruit";

export default function RecruitPage() {
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await getRecruitList();
      setList(data);
    };
    load();
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4">모집</h2>

      <div className="space-y-3">
        {list.map((item) => (
          <RecruitCard key={item.id} item={item} />
        ))}
      </div>

      <FloatingButton href="/recruit/new" />
    </section>
  );
}
