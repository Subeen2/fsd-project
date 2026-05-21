import type { StorybookConfig } from "@storybook/react-vite";
import { join, dirname } from "path";
import pandacss from "@pandacss/dev/postcss";

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    getAbsolutePath("@storybook/addon-onboarding"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-interactions"),
  ],
  framework: {
    name: getAbsolutePath("@storybook/react-vite") as "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins = [
      ...(config.plugins ?? []),
      {
        name: "strip-use-client",
        transform(code: string, id: string) {
          if (/\.(tsx?|jsx?)$/.test(id)) {
            return { code: code.replace(/^['"]use client['"];?\r?\n?/m, "") };
          }
        },
      },
    ];
    config.css = {
      postcss: {
        plugins: [pandacss()],
      },
    };
    config.define = {
      ...config.define,
      "process.env": {},
    };
    return config;
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;
