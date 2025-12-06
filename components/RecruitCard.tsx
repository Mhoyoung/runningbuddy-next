import "./globals.css";
import Header from "../components/Header";
// import BottomNav from "../components/BottomNav"; // 👈 제거됨
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "RunningBuddy",
  description: "러닝 커뮤니티 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      {/* 1. 전체 배경 (PC 화면용) */}
      <body className="bg-gray-100 flex justify-center min-h-screen overflow-y-scroll">
        
        {/* 2. 모바일 앱 프레임 */}
        <div className="w-full max-w-[480px] bg-white shadow-2xl min-h-screen relative flex flex-col">
          
          <Header />
          
          {/* 메인 콘텐츠 */}
          {/* pt-16: 헤더 높이만큼 띄움 */}
          <main className="flex-1 pt-16">
            {children}
          </main>

          
          {/* Toast UI */}
          <Toaster
            position="bottom-center"
            containerStyle={{
              bottom: 20,
            }}
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
        </div>
      </body>
    </html>
  );
}