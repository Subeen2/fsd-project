"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../i18n/navigation";
import { Button, Input } from "@fsd/ui";
import { useAuth } from "@fsd/features";
import { css } from "../../../styled-system/css";

export default function RegisterPage() {
  const t = useTranslations("auth");
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
      setError(t("registerError"));
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
        {t("registerTitle")}
      </h1>
      <form
        onSubmit={handleSubmit}
        className={css({ display: "flex", flexDirection: "column", gap: "4" })}
      >
        <Input
          label={t("email")}
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label={t("username")}
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          hint={t("usernameHint")}
          required
        />
        <Input
          label={t("displayName")}
          type="text"
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          required
        />
        <Input
          label={t("password")}
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
          {t("registerButton")}
        </Button>
        <p
          className={css({
            textAlign: "center",
            fontSize: "sm",
            color: "gray.500",
          })}
        >
          {t("hasAccount")}{" "}
          <Link
            href="/login"
            className={css({ color: "blue.600", textDecoration: "underline" })}
          >
            {t("loginLink")}
          </Link>
        </p>
      </form>
    </div>
  );
}
