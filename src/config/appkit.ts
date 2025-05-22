import {  cookieStorage, createStorage } from 'wagmi';
import { polygonAmoy } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

// 1. Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID as string;

// 2. Create a metadata object - optional

// 3. Set the networks
export const networks = [polygonAmoy];

// 4. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  networks,
  projectId,
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
