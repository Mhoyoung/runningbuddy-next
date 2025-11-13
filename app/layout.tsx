import "./globals.css";
import Header from "../components/Header";

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
      </body>
    </html>
  );
}
