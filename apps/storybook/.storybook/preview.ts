import type { Preview } from "@storybook/react";
import "./tailwind.css";
import "../../../packages/ui/src/panda.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#0a0a0a" },
        { name: "gray", value: "#f5f5f5" },
      ],
    },
  },
};

export default preview;
