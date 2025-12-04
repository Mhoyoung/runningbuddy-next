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
      <body className="bg-gray-100 flex justify-center min-h-screen overflow-y-scroll">
        <div className="w-full max-w-[480px] bg-white shadow-2xl min-h-screen relative flex flex-col">
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>

          <Toaster
            position="bottom-center"
            containerStyle={{ bottom: 40 }}
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