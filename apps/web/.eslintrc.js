/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve("@fsd/config/eslint/next")],
  parserOptions: { project: "./tsconfig.json" },
  ignorePatterns: ["**/__tests__/**", "e2e/**", "vitest.config.ts"],
};
