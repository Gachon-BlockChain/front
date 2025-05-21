import Image from "next/image";

type GifticonCard = {
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  seller: string;
  expiry: string;
};

export default function GifticonCard({
  title,
  price,
  currency,
  imageUrl,
  seller,
  expiry,
}: GifticonCard) {
  return (
    <div className="border rounded shadow hover:shadow-md transition p-4 bg-white">
      <div className="relative w-full h-32 mb-3">
        <Image
          src={imageUrl}
          alt="바코드"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 300px"
          quality={80}
        />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="text-sm text-gray-500">
        {seller} · 유효기간: {expiry.replace(/-/g, ".")}
      </p>
      <p className="text-sm text-black font-medium mt-1">
        {price} {currency}
      </p>
    </div>
  );
}
