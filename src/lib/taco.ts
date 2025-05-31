import {
  encrypt,
  decrypt,
  domains,
  initialize,
  conditions,
} from "@nucypher/taco";
import { ethers } from "ethers";
import {
  EIP4361AuthProvider,
  USER_ADDRESS_PARAM_DEFAULT,
} from "@nucypher/taco-auth";
import { toast } from "react-toastify";

// ❗ TAPIR ritual ID는 문서에서 확인 (또는 상수화)
const ritualId = 6;

// 🌐 네트워크 설정
const domain = domains.TESTNET;

export type MessageKit = Awaited<ReturnType<typeof encrypt>>;

export async function initTACo() {
  console.log("TACo 초기화 중...");
  initialize().catch((err) => {
    console.error("TACo 초기화 실패:", err);
    toast.error("TACo 초기화에 실패했습니다. 나중에 다시 시도해주세요.");
  });
}

export async function encryptBarcode(
  contractAddress: string,
  file: File, // 바코드 이미지
  signer: ethers.Signer,
  provider: ethers.providers.Web3Provider
): Promise<MessageKit> {
  const condition = new conditions.predefined.erc721.ERC721Ownership({
    contractAddress: contractAddress,
    parameters: [":userAddress"],
    chain: 80002, // Polygon Amoy
  });

  // 파일 → Uint8Array로 변환
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const messageKit = await encrypt(
    provider,
    domain,
    uint8Array,
    condition,
    ritualId,
    signer
  );

  return messageKit;
}

export async function decryptBarcode(
  messageKit: MessageKit,
  signer: ethers.Signer,
  provider: ethers.providers.Web3Provider,
  productName: string
): Promise<File> {
  const context =
    conditions.context.ConditionContext.fromMessageKit(messageKit);
  const authProvider = new EIP4361AuthProvider(provider, signer);
  context.addAuthProvider(USER_ADDRESS_PARAM_DEFAULT, authProvider);

  const decrypted = await decrypt(provider, domain, messageKit, context);
  // Uint8Array → Blob (image/jpeg or image/png 등 명확히 지정)
  return new File([decrypted], `${productName}.png`, { type: "image/png" });
}
