import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardBody, CardFooter, Button, Badge } from "@fsd/ui";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
    shadow: { control: "select", options: ["none", "sm", "md"] },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <p style={{ color: "#374151" }}>A simple card with default padding.</p>
    </Card>
  ),
};

export const WithSections: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#111827" }}>
          Card Title
        </h3>
      </CardHeader>
      <CardBody>
        <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
          This is the main content area of the card.
        </p>
      </CardBody>
      <CardFooter>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <Button variant="ghost" size="sm">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </div>
      </CardFooter>
    </Card>
  ),
};

export const ProfileCard: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            JD
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600, color: "#111827" }}>Jane Doe</p>
            <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>@janedoe</p>
          </div>
          <Badge variant="success" dot>
            Online
          </Badge>
        </div>
      </CardHeader>
      <CardBody>
        <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>
          Frontend developer passionate about design systems and accessibility.
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="secondary" size="sm" className="w-full">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Clickable: Story = {
  render: () => (
    <Card onClick={() => alert("Card clicked!")} className="w-64">
      <p style={{ fontSize: "0.875rem", color: "#374151" }}>
        Click me &mdash; I&apos;m interactive.
      </p>
    </Card>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px" }}>
      <Card shadow="none" className="flex-1">
        <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>No shadow</p>
      </Card>
      <Card shadow="sm" className="flex-1">
        <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>Shadow sm</p>
      </Card>
      <Card shadow="md" className="flex-1">
        <p style={{ fontSize: "0.875rem", color: "#4b5563" }}>Shadow md</p>
      </Card>
    </div>
  ),
};
