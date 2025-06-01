import {
  ThresholdMessageKit,
  encrypt,
  decrypt,
  domains,
  initialize,
  conditions,
} from "@nucypher/taco";
import { BigNumber, ethers } from "ethers";
import {
  EIP4361AuthProvider,
  USER_ADDRESS_PARAM_DEFAULT,
} from "@nucypher/taco-auth";
import { toast } from "react-toastify";

// ❗ TAPIR ritual ID는 문서에서 확인 (또는 상수화)
const ritualId = 6;

// 🌐 네트워크 설정
const domain = domains.TESTNET;

export async function initTACo() {
  console.log("TACo 초기화 중...");
  initialize().catch((err) => {
    console.error("TACo 초기화 실패:", err);
    toast.error("TACo 초기화에 실패했습니다. 나중에 다시 시도해주세요.");
  });
}

export async function encryptBarcode(
  contractAddress: string,
  tokenId: bigint,
  file: File, // 바코드 이미지
  signer: ethers.Signer,
  provider: ethers.providers.Web3Provider
): Promise<ThresholdMessageKit> {
  const condition = new conditions.predefined.erc721.ERC721Ownership({
    contractAddress: contractAddress,
    parameters: [tokenId], // tokenId은 bigint로 타입변환해야함. 그냥 주면 객체 에러 str변환시 str에러 뜸
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
  messageKit: ThresholdMessageKit,
  signer: ethers.Signer,
  provider: ethers.providers.Web3Provider,
  productName: string
): Promise<File> {
  console.log("TACo 복호화 시작...");
  const context =
    conditions.context.ConditionContext.fromMessageKit(messageKit);

  console.log("Context:", context);
  const authProvider = new EIP4361AuthProvider(provider, signer);
  context.addAuthProvider(USER_ADDRESS_PARAM_DEFAULT, authProvider);

  const decrypted = await decrypt(provider, domain, messageKit, context);
  console.log("복호화 완료:", decrypted);
  // Uint8Array → Blob (image/jpeg or image/png 등 명확히 지정)
  return new File([decrypted], `${productName}.webp`, { type: "image/webp" });
}

export async function loadMessageKit(
  url: string
): Promise<ThresholdMessageKit> {
  try {
    const response = await fetch(url);
    console.log("암호화 데이터 로드 성공:", response);
    const buffer = await response.arrayBuffer();
    console.log("암호화 데이터 버퍼:", buffer);
    const bytes = new Uint8Array(buffer);
    console.log("암호화 데이터 바이트:", bytes);
    return ThresholdMessageKit.fromBytes(bytes); // ✅ 역직렬화
  } catch (err) {
    console.error("🔴 암호화 데이터 로드 실패:", err);
    toast.error("암호 파일을 불러오는 데 실패했습니다.");
    throw new Error("암호화 데이터 로드 실패");
  }
}
