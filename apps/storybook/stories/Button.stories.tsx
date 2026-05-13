import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "@fsd/ui";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile button component with multiple variants and sizes. Supports loading state, icon slots, and all standard HTML button attributes.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
      description: "Visual style of the button",
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size of the button",
      table: { defaultValue: { summary: "md" } },
    },
    loading: {
      control: "boolean",
      description: "Shows a spinner and disables interaction",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button",
    },
    children: {
      control: "text",
      description: "Button label",
    },
    onClick: {
      description: "Click handler",
    },
  },
  args: {
    onClick: fn(),
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Individual Variant Stories ───────────────────────────────────────────────

export const Primary: Story = {
  args: { variant: "primary", children: "Primary Button" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary Button" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Ghost Button" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Danger Button" },
};

// ─── Size Stories ─────────────────────────────────────────────────────────────

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Medium: Story = {
  args: { size: "md", children: "Medium" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large" },
};

// ─── State Stories ────────────────────────────────────────────────────────────

export const Loading: Story = {
  args: { loading: true, children: "Saving..." },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Disabled" },
};

// ─── Composite Stories ────────────────────────────────────────────────────────

const ArrowRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2" />
  </svg>
);

export const WithIcons: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <Button variant="primary" rightIcon={<ArrowRight />}>
        Get Started
      </Button>
      <Button variant="secondary" leftIcon={<DownloadIcon />}>
        Download
      </Button>
      <Button variant="ghost" rightIcon={<ArrowRight />}>
        Learn More
      </Button>
      <Button variant="danger" leftIcon={<TrashIcon />}>
        Delete
      </Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        alignItems: "center",
      }}
    >
      <Button variant="primary">Default</Button>
      <Button variant="primary" loading>
        Loading
      </Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

export const Showcase: Story = {
  render: () => (
    <div
      style={{
        padding: "32px",
        backgroundColor: "#f9fafb",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minWidth: "480px",
      }}
    >
      <div>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "12px",
          }}
        >
          Variants
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </div>
      <div>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "12px",
          }}
        >
          Sizes
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            alignItems: "center",
          }}
        >
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>
      <div>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "12px",
          }}
        >
          With Icons
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <Button variant="primary" rightIcon={<ArrowRight />}>
            Get Started
          </Button>
          <Button variant="secondary" leftIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button variant="danger" leftIcon={<TrashIcon />}>
            Delete
          </Button>
        </div>
      </div>
      <div>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 600,
            color: "#9ca3af",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: "12px",
          }}
        >
          States
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <Button variant="primary" loading>
            Saving...
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
          <Button variant="danger" disabled>
            Disabled
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: { controls: { disable: true } },
};
