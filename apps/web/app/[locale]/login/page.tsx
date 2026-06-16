"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../i18n/navigation";
import { Button, Input } from "@fsd/ui";
import { useAuth } from "@fsd/features";
import { css } from "../../../styled-system/css";

export default function LoginPage() {
  const t = useTranslations("auth");
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
      setError(t("loginError"));
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
        {t("loginTitle")}
      </h1>
      <form
        onSubmit={handleSubmit}
        className={css({ display: "flex", flexDirection: "column", gap: "4" })}
      >
        <Input
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className={css({ color: "red.500", fontSize: "sm" })}>{error}</p>
        )}
        <Button type="submit" loading={loading}>
          {t("loginButton")}
        </Button>
        <p
          className={css({
            textAlign: "center",
            fontSize: "sm",
            color: "gray.500",
          })}
        >
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className={css({ color: "blue.600", textDecoration: "underline" })}
          >
            {t("registerLink")}
          </Link>
        </p>
      </form>
    </div>
  );
}
