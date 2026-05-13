import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@fsd/ui";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    error: { control: "text" },
    hint: { control: "text" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const WithHint: Story = {
  args: {
    label: "Username",
    placeholder: "janedoe",
    hint: "Only letters, numbers, and underscores.",
  },
};

export const WithError: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    error: "Password must be at least 8 characters.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Read-only field",
    value: "Cannot be changed",
    disabled: true,
  },
};

export const WithIcons: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    leftIcon: (
      <svg
        style={{ height: "16px", width: "16px" }}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
    ),
  },
};

export const NoLabel: Story = {
  args: {
    placeholder: "Enter text...",
  },
};
