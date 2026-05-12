/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [require.resolve("@fsd/config/eslint/base")],
  parserOptions: { project: "./tsconfig.json" },
};
