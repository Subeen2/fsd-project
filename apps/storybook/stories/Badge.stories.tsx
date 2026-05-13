import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@fsd/ui";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "warning", "danger", "info"],
    },
    size: { control: "select", options: ["sm", "md"] },
    dot: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { children: "Default" },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

export const WithDot: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      <Badge variant="default" dot>
        Offline
      </Badge>
      <Badge variant="success" dot>
        Online
      </Badge>
      <Badge variant="warning" dot>
        Away
      </Badge>
      <Badge variant="danger" dot>
        Error
      </Badge>
      <Badge variant="info" dot>
        In Progress
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Badge variant="info" size="sm">
        Small
      </Badge>
      <Badge variant="info" size="md">
        Medium
      </Badge>
    </div>
  ),
};
