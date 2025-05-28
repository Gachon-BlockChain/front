import forge from "node-forge";

// Image → Base64 
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// RSA key create
export const generateRSAKeyPair = (): { publicKey: string; privateKey: string } => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
  const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
  const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
  return { publicKey, privateKey };
};

// Encrypt public key
export const encryptImageBySeller = (base64Image: string, sellerPublicKeyPem: string): string => {
  const publicKey = forge.pki.publicKeyFromPem(sellerPublicKeyPem);
  const utf8Bytes = forge.util.encodeUtf8(base64Image);
  const encrypted = publicKey.encrypt(utf8Bytes, 'RSA-OAEP');
  return forge.util.encode64(encrypted);
};

// 판매자가 복호화 후 구매자 공개키로 재암호화 
export const reEncryptForBuyer = (
  sellerCipherText: string,
  sellerPrivateKeyPem: string,
  buyerPublicKeyPem: string
): string => {
  const sellerPrivateKey = forge.pki.privateKeyFromPem(sellerPrivateKeyPem);
  const decoded = forge.util.decode64(sellerCipherText);
  const decryptedUtf8Bytes = sellerPrivateKey.decrypt(decoded, 'RSA-OAEP');
  const decryptedBase64 = forge.util.decodeUtf8(decryptedUtf8Bytes);

  const buyerPublicKey = forge.pki.publicKeyFromPem(buyerPublicKeyPem);
  const utf8Bytes = forge.util.encodeUtf8(decryptedBase64);
  const reEncrypted = buyerPublicKey.encrypt(utf8Bytes, 'RSA-OAEP');
  return forge.util.encode64(reEncrypted);
};

// 구매자가 복호화 
export const decryptImageByBuyer = (cipherText: string, buyerPrivateKeyPem: string): string => {
  const privateKey = forge.pki.privateKeyFromPem(buyerPrivateKeyPem);
  const decoded = forge.util.decode64(cipherText);
  const decryptedUtf8Bytes = privateKey.decrypt(decoded, 'RSA-OAEP');
  return forge.util.decodeUtf8(decryptedUtf8Bytes);
};