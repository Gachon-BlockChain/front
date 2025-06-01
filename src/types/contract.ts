import type { Contract, ethers, Signer } from "ethers";

export type ContractContext = {
  provider: ethers.providers.Web3Provider; // or `JsonRpcProvider` if generic
  signer: Signer; // or `Signer` if generic
  nftContract: Contract;
  marketplaceContract: Contract;
};
