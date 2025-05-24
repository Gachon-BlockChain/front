"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "./ImageUploader";
import PriceNotice from "./PriceNotice";

export default function SellForm() {
  const [images, setImages] = useState<string[]>([]);
  const [price, setPrice] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 기본값으로 30일 후
  );
  
  const categories = [
    { id: "cafe", name: "카페" },
    { id: "food", name: "식품" },
    { id: "voucher", name: "상품권" },
    { id: "other", name: "기타" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>기프티콘 정보</CardTitle>
        <CardDescription>
          판매할 기프티콘의 정보를 입력해주세요.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 이미지 업로드 */}
        <ImageUploader images={images} setImages={setImages} />

        {/* 상품명 */}
        <div className="space-y-2">
          <Label htmlFor="title">상품명</Label>
          <Input id="title" placeholder="판매할 기프티콘 이름을 입력하세요" />
        </div>

        {/* 카테고리 */}
        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 가격 */}
        <div className="space-y-2">
          <Label htmlFor="price">가격</Label>
          <div className="relative">
            <Input
              id="price"
              type="number"
              placeholder="판매 가격을 입력하세요 (소숫점 2자리까지)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="no-spinner pr-14" // 👈 오른쪽 공간 확보
            />
            <div className="absolute inset-y-0 right-4 flex items-center text-gray-500">
              <span className="text-sm font-medium">POL</span>
            </div>
          </div>
        </div>

        {/* 유효기간 */}
        <div className="space-y-2">
          <Label>유효기간</Label>
          <div className="border rounded-md p-2">
            <Calendar
              mode="single"
              selected={expiryDate}
              onSelect={setExpiryDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <PriceNotice price={price}/>
        <Button className="w-full bg-blue-500 hover:bg-blue-600">
          등록하기
        </Button>
      </CardFooter>
    </Card>
  );
}
