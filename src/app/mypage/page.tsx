import { Metadata } from "next";
import MyPageHeader from "./components/MyPageHeader";
import ProfileSection from "./components/ProfileSection";
import MenuSection from "./components/MenuSection";
import CurrentSales from "./components/CurrentSales";
import StatusBar from "../(home)/components/StatusBar";
import BottomNavigation from "../(home)/components/BottomNavigation";

export const metadata: Metadata = {
  title: "마이페이지 | 기프티콘 마켓",
  description: "기프티콘 마켓 마이페이지입니다.",
};

export default function MyPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <StatusBar />
      <MyPageHeader />

      <div className="flex-1 flex flex-col gap-4 p-4 pb-20">
        <ProfileSection />
        <MenuSection />
        <CurrentSales />
      </div>

      <BottomNavigation />
    </main>
  );
}
