"use client";

import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    sessionStorage.setItem("isLoggedIn", "true");
    router.push("/");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          로그인
        </button>
      </div>
    </Layout>
  );
}
