import type { BrowserProvider, JsonRpcSigner, Contract } from "ethers";

export type ContractContext = {
  provider: BrowserProvider;
  signer: JsonRpcSigner; // or `Signer` if generic
  nftContract: Contract;
  marketplaceContract: Contract;
};
