import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";

interface LoginFormProps extends React.ComponentProps<"div"> {
  onLogin?: () => void;
}

export function LoginForm({ className, onLogin, ...props }: LoginFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onLogin) {
      onLogin();
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="px-4 py-6">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-24 h-24 relative">
            <Image
              src="/MetaMask/MetaMask/MetaMask-icon-fox.svg"
              alt="MetaMask Logo"
              fill
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl mb-1">로그인</CardTitle>
          <CardDescription>
            메타마스크를 통해 계정에 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="flex flex-col gap-6 w-auto">
              <Button
                type="submit"
                className="mx-auto px-8 bg-white text-[#F6851B] border border-[#F6851B] hover:bg-[#F6851B] hover:text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Image
                  src="/MetaMask/MetaMask/MetaMask-icon-fox.svg"
                  alt="MetaMask Icon"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                메타마스크로 로그인
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              계정이 없으신가요?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
