import forge from "node-forge";

// 1. 이미지 → Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 2. RSA 키 생성 (테스트용. 실제 서비스에선 키 보관 주의)
export const generateRSAKeyPair = (): { publicKey: string; privateKey: string } => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
  return { publicKey, privateKey };
};

// 3. Base64 이미지 → 구매자의 공개키로 암호화
export const encryptImageForBuyer = (base64Image: string, buyerPublicKeyPem: string): string => {
  const publicKey = forge.pki.publicKeyFromPem(buyerPublicKeyPem);
  const encrypted = publicKey.encrypt(base64Image, 'RSA-OAEP');
  return forge.util.encode64(encrypted); // 문자열 저장/전송용
};

// 4. 복호화: 구매자의 개인키로 복호화
export const decryptImageByBuyer = (cipherText: string, buyerPrivateKeyPem: string): string => {
  const privateKey = forge.pki.privateKeyFromPem(buyerPrivateKeyPem);
  const decoded = forge.util.decode64(cipherText);
  const decrypted = privateKey.decrypt(decoded, 'RSA-OAEP');
  return decrypted; // base64 이미지 문자열
};