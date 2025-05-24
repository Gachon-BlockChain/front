'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
        
import Layout from '@/components/Layout';
import { LoginForm } from "@/components/login-form";


export default function LoginPage() {
	const router = useRouter();
	const { open } = useAppKit(); // ✅ Web3Modal을 열기 위한 open() 메서드
	const { isConnected, address } = useAccount(); // ✅ 지갑 연결 상태 확인

	// ✅ 로그인 상태가 되면 자동으로 홈으로 이동
	useEffect(() => {
		if (isConnected && address) {
			router.push('/');
		}
	}, [isConnected, address, router]);

	const handleLogin = () => {
		open(); // Web3Modal 열기
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
