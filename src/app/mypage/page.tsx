import Layout from "@/components/Layout";
import Link from "next/link";

export default function MyPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/mypage/sold">
          <div className="p-6 bg-white rounded shadow border hover:shadow-md cursor-pointer text-center">
            <h2 className="text-lg font-semibold">판매내역</h2>
          </div>
        </Link>
        <Link href="/mypage/purchased">
          <div className="p-6 bg-white rounded shadow border hover:shadow-md cursor-pointer text-center">
            <h2 className="text-lg font-semibold">구매내역</h2>
          </div>
        </Link>
        <Link href="/mypage/onsale">
          <div className="p-6 bg-white rounded shadow border hover:shadow-md cursor-pointer text-center">
            <h2 className="text-lg font-semibold">판매중인 상품</h2>
          </div>
        </Link>
      </div>
    </Layout>
  );
}
