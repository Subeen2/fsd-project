"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@fsd/ui";
import { useAuth } from "@fsd/features";
import { css } from "../../../styled-system/css";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await register(form);
      if (result.success) {
        router.push("/chat");
      } else {
        setError(result.error.message);
      }
    } catch {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
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
        회원가입
      </h1>
      <form
        onSubmit={handleSubmit}
        className={css({ display: "flex", flexDirection: "column", gap: "4" })}
      >
        <Input
          label="이메일"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="사용자명"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          hint="영문, 숫자, 밑줄만 사용 가능"
          required
        />
        <Input
          label="표시 이름"
          type="text"
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          required
        />
        <Input
          label="비밀번호"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        {error && (
          <p className={css({ color: "red.500", fontSize: "sm" })}>{error}</p>
        )}
        <Button type="submit" loading={loading}>
          가입하기
        </Button>
        <p
          className={css({
            textAlign: "center",
            fontSize: "sm",
            color: "gray.500",
          })}
        >
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className={css({ color: "blue.600", textDecoration: "underline" })}
          >
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}
