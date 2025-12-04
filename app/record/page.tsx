"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { getRecords } from "@/firebase/record";
import { auth } from "@/firebase/config"; 
import FloatingButton from "@/components/FloatingButton"; 
import Skeleton from "@/components/Skeleton"; // 스켈레톤 있다면 사용
import { FaRunning, FaStopwatch, FaRoad } from "react-icons/fa"; // 아이콘 추가

export default function RecordPage() {
  const [tab, setTab] = useState<"my" | "race">("my");
  const [records, setRecords] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      setUser(currentUser);
      try {
        const data = await getRecords(currentUser.uid);
        setRecords(data);
      } catch (error) {
        console.error("기록 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <div className="p-6 space-y-4"><Skeleton className="h-24 w-full rounded-xl" /><Skeleton className="h-24 w-full rounded-xl" /></div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <p className="text-gray-500 mb-4">로그인이 필요한 서비스입니다 🏃‍♂️</p>
        <button
          className="bg-black text-white px-6 py-3 rounded-xl font-bold active:scale-95 transition"
          onClick={() => router.push("/login")}
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  return (
    <section className="p-4 pb-24 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 px-1">나의 러닝 기록 </h1>

      {/* 탭 메뉴 */}
      <div className="flex bg-white p-1 rounded-xl shadow-sm mb-6">
        <button
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${
            tab === "my" ? "bg-black text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
          }`}
          onClick={() => setTab("my")}
        >
          내 기록
        </button>
        <button
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition ${
            tab === "race" ? "bg-black text-white shadow-md" : "text-gray-400 hover:bg-gray-50"
          }`}
          onClick={() => setTab("race")}
        >
          대회 조회
        </button>
      </div>

      {/* 내 기록 리스트 */}
      {tab === "my" && (
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200">
              <p>아직 저장된 기록이 없어요.</p>
              <p className="text-xs mt-1">오늘의 러닝을 기록해보세요!</p>
            </div>
          ) : (
            records.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 relative overflow-hidden"
              >
                {/* 왼쪽 색상 바 포인트 */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500" />
                
                {/* 상단 날짜 */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-50 pl-2">
                   <span className="text-gray-500 text-sm font-medium">{rec.date}</span>
                   <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">Running</span>
                </div>

                {/* 데이터 그리드 */}
                <div className="grid grid-cols-3 gap-2 pl-2">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1 flex justify-center items-center gap-1"><FaRoad/> 거리</p>
                    <p className="font-bold text-lg">{rec.distance} <span className="text-xs font-normal text-gray-500">km</span></p>
                  </div>
                  <div className="text-center border-l border-gray-100">
                    <p className="text-xs text-gray-400 mb-1 flex justify-center items-center gap-1"><FaStopwatch/> 시간</p>
                    <p className="font-bold text-lg">{rec.time}</p>
                  </div>
                  <div className="text-center border-l border-gray-100">
                    <p className="text-xs text-gray-400 mb-1 flex justify-center items-center gap-1"><FaRunning/> 페이스</p>
                    <p className="font-bold text-lg text-blue-600">{rec.pace}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <FloatingButton href="/record/new" />
        </div>
      )}

      {/* 대회 조회 (외부 링크) */}
      {tab === "race" && (
        <div className="flex flex-col items-center justify-center py-10 text-center bg-white rounded-2xl shadow-sm border border-gray-100 px-6">
          <img src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png" className="w-20 mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">공식 기록 조회</h3>
          <p className="text-gray-500 text-sm mb-6">
            마라톤 대회 공식 사이트에서<br />나의 기록을 검색할 수 있습니다.
          </p>

          <Link
            href="https://time.spct.kr/main.php"
            target="_blank"
            className="bg-black text-white w-full py-4 rounded-xl font-bold shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
          >
            기록 조회하러 가기 🔗
          </Link>
        </div>
      )}
    </section>
  );
}