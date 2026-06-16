import { test, expect } from "@playwright/test";

test.describe("로그인 페이지", () => {
  test("폼 필드와 버튼이 렌더링된다", async ({ page }) => {
    await page.goto("/ko/login");
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
    await expect(page.getByLabel("이메일")).toBeVisible();
    await expect(page.getByLabel("비밀번호")).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인" })).toBeVisible();
  });

  test("영어 로그인 페이지 — Sign in 텍스트", async ({ page }) => {
    await page.goto("/en/login");
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("회원가입 링크가 /ko/register로 연결된다", async ({ page }) => {
    await page.goto("/ko/login");
    await page.getByRole("link", { name: "회원가입" }).click();
    await expect(page).toHaveURL(/\/ko\/register/);
  });
});

test.describe("회원가입 페이지", () => {
  test("폼 필드가 모두 렌더링된다", async ({ page }) => {
    await page.goto("/ko/register");
    await expect(page.getByRole("heading", { name: "회원가입" })).toBeVisible();
    await expect(page.getByLabel("이메일")).toBeVisible();
    await expect(page.getByLabel("사용자명")).toBeVisible();
    await expect(page.getByLabel("표시 이름")).toBeVisible();
    await expect(page.getByLabel("비밀번호")).toBeVisible();
  });

  test("로그인 링크가 /ko/login으로 연결된다", async ({ page }) => {
    await page.goto("/ko/register");
    await page.getByRole("link", { name: "로그인" }).click();
    await expect(page).toHaveURL(/\/ko\/login/);
  });
});
