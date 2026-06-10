"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@fsd/ui";
import { useAuth } from "@fsd/features";
import { css } from "../../../styled-system/css";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/chat");
      } else {
        setError(result.error.message);
      }
    } catch {
      setError("로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css({ maxW: "sm", mx: "auto", mt: "8" })}>
      <h1
        className={css({
          fontSize: "2xl",
          fontWeight: "bold",
          mb: "6",
          textAlign: "center",
        })}
      >
        로그인
      </h1>
      <form
        onSubmit={handleSubmit}
        className={css({ display: "flex", flexDirection: "column", gap: "4" })}
      >
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className={css({ color: "red.500", fontSize: "sm" })}>{error}</p>
        )}
        <Button type="submit" loading={loading}>
          로그인
        </Button>
        <p
          className={css({
            textAlign: "center",
            fontSize: "sm",
            color: "gray.500",
          })}
        >
          계정이 없으신가요?{" "}
          <Link
            href="/register"
            className={css({ color: "blue.600", textDecoration: "underline" })}
          >
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}
