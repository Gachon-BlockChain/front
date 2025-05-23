"use client";

import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleLogin = () => {
    // 메타마스크 인증 연동 예정
    router.push("/");
  };

  return (
    <>
      <div className="flex min-h-svh w-full flex-col items-center justify-center bg-gray-50 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm onLogin={handleLogin} />
        </div>
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>메타마스크 지갑을 사용하여 안전하게 로그인하세요.</p>
          <p>
            지갑이 없으시다면{" "}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              여기
            </a>
            에서 다운로드 할 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
}
