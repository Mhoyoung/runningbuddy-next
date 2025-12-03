import "./globals.css";
import Header from "../components/Header";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "RunningBuddy",
  description: "러닝 커뮤니티 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50">
        <Header />
        <main className="pt-16">{children}</main>

        {/* 🔥 Toast UI 전역 적용 */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "rgba(0,0,0,0.85)",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
            },
          }}
        />
      </body>
    </html>
  );
}
