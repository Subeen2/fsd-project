import { test, expect } from "@playwright/test";

test.describe("홈 페이지", () => {
  test("/ 접속 시 Accept-Language에 맞는 locale로 리다이렉트된다", async ({
    page,
  }) => {
    await page.goto("/");
    // 기본 브라우저 locale(en)에 따라 /en 또는 /ko로 이동
    await page.waitForURL(/\/(ko|en)$/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/(ko|en)$/);
  });

  test("한국어 홈 — 타이틀과 부제목이 보인다", async ({ page }) => {
    await page.goto("/ko");
    await expect(page.getByRole("heading", { name: "Mindwave" })).toBeVisible();
    await expect(page.getByText("무엇을 시작할까요?")).toBeVisible();
  });

  test("영어 홈 — 영어 부제목이 보인다", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("What would you like to start?")).toBeVisible();
  });

  test("EN 버튼 클릭 시 /en으로 전환된다", async ({ page }) => {
    await page.goto("/ko");
    await page.getByRole("button", { name: "EN" }).click();
    await expect(page).toHaveURL(/\/en/);
  });

  test("KO 버튼 클릭 시 /ko로 전환된다", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "KO" }).click();
    await expect(page).toHaveURL(/\/ko/);
  });

  test("카드 6개가 모두 표시된다", async ({ page }) => {
    await page.goto("/ko");
    const cards = page.locator(".home-card");
    await expect(cards).toHaveCount(6);
  });

  test("마인드맵 카드 클릭 시 /ko/mindmap으로 이동한다", async ({ page }) => {
    await page.goto("/ko");
    await page.getByText("마인드맵").first().click();
    await expect(page).toHaveURL(/\/ko\/mindmap/);
  });
});
