/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve("@fsd/config/eslint/react-library")],
  parserOptions: { project: "./tsconfig.json" },
  ignorePatterns: ["src/**/__tests__/**"],
};
