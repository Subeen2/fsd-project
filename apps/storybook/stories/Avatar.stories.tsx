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
    <div style={{ display: "flex", alignItems: "flex-end", gap: "12px" }}>
      <Avatar fallback="Jane Doe" size="xs" />
      <Avatar fallback="Jane Doe" size="sm" />
      <Avatar fallback="Jane Doe" size="md" />
      <Avatar fallback="Jane Doe" size="lg" />
      <Avatar fallback="Jane Doe" size="xl" />
    </div>
  ),
};

export const ImageError: Story = {
  name: "Image Error → Fallback",
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Avatar
          src="https://broken.url/image.png"
          fallback="Jane Doe"
          alt="Jane Doe"
          size="md"
        />
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>
          with fallback
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <Avatar
          src="https://broken.url/image.png"
          alt="No fallback"
          size="md"
        />
        <span style={{ fontSize: "12px", color: "#9ca3af" }}>no fallback</span>
      </div>
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: "flex", marginLeft: "-8px" }}>
      {[
        { src: "https://i.pravatar.cc/150?img=1", alt: "User 1" },
        { src: "https://i.pravatar.cc/150?img=2", alt: "User 2" },
      ].map((user) => (
        <div
          key={user.alt}
          style={{
            borderRadius: "9999px",
            boxShadow: "0 0 0 2px white",
            display: "inline-flex",
            marginLeft: "8px",
          }}
        >
          <Avatar src={user.src} alt={user.alt} size="md" />
        </div>
      ))}
      <div
        style={{
          borderRadius: "9999px",
          boxShadow: "0 0 0 2px white",
          display: "inline-flex",
          marginLeft: "8px",
        }}
      >
        <Avatar fallback="Jane Doe" size="md" />
      </div>
      <div
        style={{
          borderRadius: "9999px",
          boxShadow: "0 0 0 2px white",
          display: "inline-flex",
          marginLeft: "8px",
        }}
      >
        <Avatar size="md" />
      </div>
    </div>
  ),
};
