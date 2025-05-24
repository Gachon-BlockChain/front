import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface ImageUploaderProps {
	imagePreviews: string[];
	setImagePreviews: (imagePreviews: string[]) => void;
	setImages: (file: File) => void;
}

export default function ImageUploader({
	imagePreviews,
	setImagePreviews,
	setImages,
}: ImageUploaderProps) {
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files); // ✅ 실제 File[]
			const previews = files.map((file) => URL.createObjectURL(file)); // ✅ string[]
			setImagePreviews([...imagePreviews, ...previews]);
			// 파일 원본도 누적
			setImages(files[files.length - 1]);
		}
	};

	return (
		<div className="space-y-2">
			<Label htmlFor="images">상품 이미지</Label>
			<div className="flex flex-wrap gap-2 mb-2">
				{imagePreviews.map((img, idx) => (
					<div
						key={idx}
						className="relative w-24 h-24 rounded border border-gray-200 overflow-hidden"
					>
						<Image
							src={img}
							alt={`상품 이미지 ${idx + 1}`}
							fill
							className="object-cover"
							sizes="96px"
							quality={80}
						/>
					</div>
				))}
				<label className="flex items-center justify-center w-24 h-24 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition-colors">
					<span className="text-2xl text-gray-500">+</span>
					<Input
						id="images"
						type="file"
						accept="image/*"
						multiple
						className="hidden"
						onChange={handleImageUpload}
					/>
				</label>
			</div>
			<p className="text-xs text-gray-500">
				최대 5장의 이미지를 업로드할 수 있습니다.
			</p>
		</div>
	);
}
