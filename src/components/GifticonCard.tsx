import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

type GifticonCard = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl: string;
  seller: string;
  expiry: string;
};

export default function GifticonCard({
  id,
  title,
  price,
  currency,
  imageUrl,
  seller,
  expiry,
}: GifticonCard) {

  return (
    <Link href={`/gifticons/${id}`} className="block">
      <div className="border rounded shadow hover:shadow-md transition p-4 bg-white">
        <img
          src={imageUrl}
          alt="바코드"
          className="w-full h-32 object-contain mb-3"
        />
        <h3 className="text-black font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">
          {seller} · 유효기간: {expiry.replace(/-/g, ".")}
        </p>
        <p className="text-sm text-black font-medium mt-1">
          {price} {currency}
        </p>
      </div>
    </Link>
  );
}
