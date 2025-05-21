import React from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { products } from "@/constant/constData";

interface TransactionDetailProps {
  id: string;
  type: "purchase" | "sale";
}

export default function TransactionDetail({
  id,
  type,
}: TransactionDetailProps) {
  // 실제로는 API에서 가져오겠지만, 여기서는 더미 데이터에서 찾음
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="p-8 text-center">상품 정보를 찾을 수 없습니다.</div>;
  }

  // 가상의 거래 정보
  const transactionInfo = {
    transactionId: `TX-${id}-${Date.now().toString().slice(-6)}`,
    date: `2024-${
      (parseInt(id) % 12) + 1 < 10
        ? "0" + ((parseInt(id) % 12) + 1)
        : (parseInt(id) % 12) + 1
    }-${
      (parseInt(id) % 28) + 1 < 10
        ? "0" + ((parseInt(id) % 28) + 1)
        : (parseInt(id) % 28) + 1
    }`,
    time: `${(parseInt(id) % 12) + 1}:${
      parseInt(id) % 60 < 10 ? "0" + (parseInt(id) % 60) : parseInt(id) % 60
    } ${parseInt(id) % 2 === 0 ? "PM" : "AM"}`,
    status:
      parseInt(id) % 3 === 0
        ? "완료"
        : parseInt(id) % 3 === 1
        ? "진행중"
        : "취소",
    paymentMethod: parseInt(id) % 2 === 0 ? "카드 결제" : "계좌 이체",
    shippingAddress:
      type === "purchase" ? "서울특별시 강남구 테헤란로 123 아파트 456호" : "-",
    category: "식품",
    ethPrice: "0.0045 ETH",
    expiryDate: "2025/05/25",
    saleDate: "2025/03/24",
    buyerWalletAddress: "0x7A3d05C75662a6C81012D3b9d5E2F5e0bC625E68",
    buyerName: "가천대101",
  };

  return (
    <div className="flex flex-col">
      {/* 상품 정보 요약 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex gap-4">
          <div className="flex-shrink-0 relative w-[80px] h-[80px] border border-gray-200 rounded overflow-hidden">
            <Image
              src={product.image[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="80px"
              quality={80}
            />
          </div>

          <div>
            <h3 className="text-base font-medium">{product.title}</h3>
            <p className="text-[#366CFF] font-bold mt-1">
              {formatPrice(product.price)}
            </p>
            <p className="text-sm text-gray-600">{transactionInfo.ethPrice}</p>
          </div>
        </div>
      </div>

      {/* 상품 정보 상세 */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold mb-4">상품 정보</h3>

        <div className="space-y-4">
          <InfoItem label="카테고리" value={transactionInfo.category} />
          <InfoItem
            label="기프티콘 유효기간"
            value={transactionInfo.expiryDate}
          />
        </div>
      </div>

      {/* 거래 정보 상세 */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">거래 정보</h3>

        <div className="space-y-4">
          <InfoItem label="거래 ID" value={transactionInfo.transactionId} />
          <InfoItem label="거래 날짜" value={transactionInfo.date} />
          <InfoItem label="거래 시간" value={transactionInfo.time} />
          <InfoItem label="판매 일시" value={transactionInfo.saleDate} />
          <InfoItem
            label="상태"
            value={transactionInfo.status}
            highlight={true}
          />
          <InfoItem label="결제 방법" value={transactionInfo.paymentMethod} />

          {type === "purchase" && (
            <InfoItem label="배송지" value={transactionInfo.shippingAddress} />
          )}

          <InfoItem label="판매자" value={product.seller} />
          <InfoItem label="판매자 신용점수" value={product.creditScore} />

          {/* 구매자 정보 섹션 */}
          {type === "sale" && (
            <>
              <InfoItem label="구매자명" value={transactionInfo.buyerName} />
              <InfoItem
                label="구매자 지갑주소"
                value={transactionInfo.buyerWalletAddress}
                isWalletAddress={true}
              />
            </>
          )}
        </div>
      </div>

      {/* 환불/취소 정책 */}
      <div className="p-4 mt-4 bg-gray-50">
        <h3 className="text-base font-medium mb-2">환불 및 취소 정책</h3>
        <p className="text-sm text-gray-600">
          기프티콘의 특성상 거래가 완료된 후에는 환불이 불가능합니다. 단,
          판매자의 귀책사유로 인해 기프티콘 사용이 불가능한 경우, 고객센터를
          통해 문의해 주시기 바랍니다.
        </p>
      </div>

      {/* 문의 버튼 */}
      <div className="p-4">
        <button className="w-full py-3 bg-[#4AC1DB] text-white rounded-md font-medium">
          문의하기
        </button>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  highlight?: boolean;
  isWalletAddress?: boolean;
}

function InfoItem({ label, value, highlight, isWalletAddress }: InfoItemProps) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
      <span className="text-gray-500">{label}</span>
      <span
        className={`${highlight ? "font-semibold text-[#4AC1DB]" : ""} ${
          isWalletAddress ? "text-xs max-w-[200px] truncate" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
