'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function TransactionHeader() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const type = searchParams.get('type') || 'own';

	const handleTypeChange = (value: string) => {
		router.push(`/mypage/transaction?type=${value}`);
	};

	return (
		<header className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
			<div className="flex items-center gap-2">
				<Link
					href="/mypage"
					className="p-1"
				>
					<ChevronLeft size={24} />
				</Link>
				<h1 className="text-lg font-semibold">
					{type === 'own' ? '보유 중인 NFT 내역' : '판매 내역'}
				</h1>
			</div>

			<Select
				defaultValue={type}
				onValueChange={handleTypeChange}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="유형 선택" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="own">보유 중인 NFT 내역</SelectItem>
					<SelectItem value="sale">판매 내역</SelectItem>
				</SelectContent>
			</Select>
		</header>
	);
}
