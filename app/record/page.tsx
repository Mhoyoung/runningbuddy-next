"use client";

import { useEffect, useState } from "react";
import FloatingButton from "../../components/FloatingButton";
import Link from "next/link";
import { getRecords } from "../../firebase/record";
import { auth } from "../../firebase/config";
import { useRouter } from "next/navigation";

export default function RecordPage() {
  const [tab, setTab] = useState<"my" | "race">("my");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      // ✅ 로그인 안 했으면 로그인 페이지로 리다이렉트
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      const data = await getRecords(user.uid);
      setRecords(data);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <section className="p-4 text-center">
        <p>불러오는 중...</p>
      </section>
    );
  }

  return (
    <section className="p-4">
      {/* ✅ 탭 */}
      <div className="flex mb-4 border-b">
        <button
          className={`flex-1 py-2 text-center ${
            tab === "my" ? "font-bold border-b-2 border-primary" : "text-gray-500"
          }`}
          onClick={() => setTab("my")}
        >
          내 기록
        </button>

        <button
          className={`flex-1 py-2 text-center ${
            tab === "race" ? "font-bold border-b-2 border-primary" : "text-gray-500"
          }`}
          onClick={() => setTab("race")}
        >
          대회 기록 조회
        </button>
      </div>

      {/* ✅ 내 기록 */}
      {tab === "my" && (
        <div className="space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="p-4 bg-gray-100 rounded-lg shadow flex justify-between"
            >
              <div>
                <p className="font-semibold">{rec.date}</p>
                <p className="text-gray-500">
                  {rec.distance} • {rec.time}
                </p>
              </div>
              <p className="text-gray-700">{rec.pace}</p>
            </div>
          ))}

          {/* ✅ + 버튼 */}
          <FloatingButton href="/record/new" />
        </div>
      )}

      {/* ✅ 대회 기록 조회 */}
      {tab === "race" && (
        <div className="flex flex-col items-center mt-10 px-6 text-center">
          <p className="text-gray-700 mb-6">
            공식 사이트에서 대회 기록을 조회할 수 있어요.
          </p>

          <Link
            href="https://time.spct.kr/main.php"
            target="_blank"
            className="
              bg-white text-black !text-black w-full 
              py-4 rounded-lg font-bold shadow-md 
              active:scale-95 transition
            "
          >
            공식 대회 기록 조회하기 →
          </Link>
        </div>
      )}
    </section>
  );
}
