'use client';

import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

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
