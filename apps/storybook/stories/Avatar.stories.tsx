import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "@fsd/ui";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
    },
    src: { control: "text" },
    fallback: { control: "text" },
    alt: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const WithImage: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=47",
    alt: "Jane Doe",
    size: "md",
  },
};

export const WithFallback: Story = {
  args: {
    fallback: "Jane Doe",
    size: "md",
  },
};

export const NoSrc: Story = {
  args: {
    size: "md",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Avatar fallback="Jane Doe" size="xs" />
      <Avatar fallback="Jane Doe" size="sm" />
      <Avatar fallback="Jane Doe" size="md" />
      <Avatar fallback="Jane Doe" size="lg" />
      <Avatar fallback="Jane Doe" size="xl" />
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-2">
      <Avatar
        src="https://i.pravatar.cc/150?img=1"
        alt="User 1"
        size="md"
        className="ring-2 ring-white"
      />
      <Avatar
        src="https://i.pravatar.cc/150?img=2"
        alt="User 2"
        size="md"
        className="ring-2 ring-white"
      />
      <Avatar
        fallback="Jane Doe"
        size="md"
        className="ring-2 ring-white"
      />
      <Avatar
        size="md"
        className="ring-2 ring-white"
      />
    </div>
  ),
};
