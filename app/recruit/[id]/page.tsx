"use client";

import { useEffect, useState } from "react";
import { getRecruitDetail } from "../../../firebase/recruit";
import { useParams } from "next/navigation";

export default function RecruitDetailPage() {
  const params = useParams();
  const id = String(params.id);

  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getRecruitDetail(id);
      setPost(data);
    };

    load();
  }, [id]);

  if (!post) return <p className="p-4">불러오는 중...</p>;

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

      <p className="whitespace-pre-line mt-4">{post.content}</p>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
        <p>⏱ 시간: {post.time}</p>
        <p>📍 장소: {post.location}</p>
      </div>
    </section>
  );
}
