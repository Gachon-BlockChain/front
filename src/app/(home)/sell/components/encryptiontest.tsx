'use client';

import React, { useState } from 'react';
import {
	fileToBase64,
	generateRSAKeyPair,
	encryptImageBySeller,
	reEncryptForBuyer,
    decryptImageByBuyer 
} from '@/lib/encryption';

const EncryptTest = () => {
	const [base64, setBase64] = useState('');
	const [encrypted, setEncrypted] = useState('');
	const [decrypted, setDecrypted] = useState('');

	const [keys] = useState(() => generateRSAKeyPair());

	const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const base64Image = await fileToBase64(file);
		setBase64(base64Image);

		const encryptedData = encryptImageBySeller(base64Image, keys.publicKey);
		setEncrypted(encryptedData);

		const decryptedData = decryptImageByBuyer(encryptedData, keys.privateKey);
		setDecrypted(decryptedData);
	};

	return (
		<div className="mt-8 border rounded-lg p-4 space-y-4 bg-gray-50">
			<h2 className="text-lg font-semibold">🔐 암호화 테스트</h2>
			<input type="file" accept="image/*" onChange={handleFile} />

			{base64 && (
				<div className="space-y-2 text-sm text-gray-700 break-all">
					<p>✅ 원본(base64): {base64.slice(0, 100)}...</p>
					<p>🔒 암호화: {encrypted.slice(0, 100)}...</p>
					<p>🔓 복호화: {decrypted.slice(0, 100)}...</p>
				</div>
			)}
		</div>
	);
};

export default EncryptTest;