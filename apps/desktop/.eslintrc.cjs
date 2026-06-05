/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve("@fsd/config/eslint/base")],
  parserOptions: { project: "./tsconfig.json" },
  env: { node: true },
  ignorePatterns: ["**/*.d.ts", "out/", "release/"],
};
