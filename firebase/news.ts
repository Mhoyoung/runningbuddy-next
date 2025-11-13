// firebase/news.ts
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;      // 표시용 날짜 (YYYY-MM-DD 등)
  img?: string | null;
  category?: "notice" | "race" | "event" | "etc";
}

const colRef = collection(db, "news");

// 목록
export async function getNewsList(): Promise<NewsItem[]> {
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      title: data.title ?? "",
      content: data.content ?? "",
      date: data.date ?? "",
      img: data.img ?? null,
      category: data.category ?? "etc",
    };
  });
}

// 단건
export async function getNewsById(id: string): Promise<NewsItem | null> {
  const ref = doc(db, "news", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return {
    id: snap.id,
    title: data.title ?? "",
    content: data.content ?? "",
    date: data.date ?? "",
    img: data.img ?? null,
    category: data.category ?? "etc",
  };
}

// 작성 (UI만 쓰는 더미/예시)
export async function addNews(input: {
  title: string;
  content: string;
  date: string;
  img?: string | null;
  category?: "notice" | "race" | "event" | "etc";
}) {
  return await addDoc(colRef, {
    ...input,
    createdAt: serverTimestamp(),
  });
}
