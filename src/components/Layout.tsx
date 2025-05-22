import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header />
      <main className="flex-1 px-4 py-8 max-w-6xl mx-auto">{children}</main>
      <Footer />
    </div>
  );
}
