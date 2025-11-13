import Link from "next/link";

export default function RaceListPage() {
  const raceList = [
    { id: 1, name: "2025 서울 마라톤", date: "2025-03-18" },
    { id: 2, name: "2025 부산 런페스티벌", date: "2025-09-05" },
  ];

  return (
    <section className="p-4 pb-24 bg-gray-50 min-h-screen">
      <h2 className="text-xl font-bold mb-6">대회 기록</h2>

      <div className="space-y-4">
        {raceList.map((r) => (
          <Link
            key={r.id}
            href={`/record/race/${r.id}`}
            className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <p className="text-lg font-semibold">{r.name}</p>
            <p className="text-gray-500 text-sm">{r.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
