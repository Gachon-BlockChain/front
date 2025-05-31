'use client';

import { wagmiAdapter, projectId } from '../config/appkit';
import { createAppKit } from '@reown/appkit/react';
import { polygonAmoy } from '@reown/appkit/networks';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';
import { initTACo } from '@/lib/taco';

const queryClient = new QueryClient();

if (!projectId) {
	throw new Error('projectId is required');
}

const metadata = {
	name: 'S2dency',
	description: 'AppKit Example',
	url: 'https://reown.com/appkit', // origin must match your domain & subdomain
	icons: ['https://assets.reown.com/reown-profile-pic.png'],
};

const modal = createAppKit({
	adapters: [wagmiAdapter],
	projectId,
	networks: [polygonAmoy], // default network가 있어야함
	defaultNetwork: polygonAmoy,
	features: {
		analytics: true,
		socials: ['google', 'facebook', 'discord'],
	},
	themeMode: 'dark',
}); // export를 안하더라도 useAppKit() 내부적으로 사용됨

function AppkitContextProvider({
	children,
	cookies,
}: {
	children: ReactNode;
	cookies: string | null;
}) {
	const initialState = cookieToInitialState(
		wagmiAdapter.wagmiConfig as Config,
		cookies
	);
	useEffect(() => {
		initTACo();
	}, []);

	return (
		<WagmiProvider
			config={wagmiAdapter.wagmiConfig as Config}
			initialState={initialState}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</WagmiProvider>
	);
}

export default AppkitContextProvider;
