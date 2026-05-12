import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ButtonCva, ButtonSva } from "@fsd/ui";

// ─── CVA Stories ─────────────────────────────────────────────────────────────

const cvaMeta: Meta<typeof ButtonCva> = {
  title: "UI/Button (Panda CVA)",
  component: ButtonCva,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Panda CSS `cva` (Class Variance Authority) — single-root recipe. Returns a flat class string.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: { onClick: fn(), children: "Button" },
};

export default cvaMeta;
type CvaStory = StoryObj<typeof cvaMeta>;

export const CvaPrimary: CvaStory = {
  args: { variant: "primary", children: "Primary" },
};
export const CvaSecondary: CvaStory = {
  args: { variant: "secondary", children: "Secondary" },
};
export const CvaGhost: CvaStory = {
  args: { variant: "ghost", children: "Ghost" },
};
export const CvaDanger: CvaStory = {
  args: { variant: "danger", children: "Danger" },
};
export const CvaLoading: CvaStory = {
  args: { loading: true, children: "Loading..." },
};
export const CvaDisabled: CvaStory = {
  args: { disabled: true, children: "Disabled" },
};

export const CvaShowcase: CvaStory = {
  render: () => (
    <div className="p-8 bg-gray-50 rounded-2xl space-y-6 min-w-[480px]">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          CVA — Variants
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <ButtonCva variant="primary">Primary</ButtonCva>
          <ButtonCva variant="secondary">Secondary</ButtonCva>
          <ButtonCva variant="ghost">Ghost</ButtonCva>
          <ButtonCva variant="danger">Danger</ButtonCva>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          CVA — Sizes
        </p>
        <div className="flex gap-3 items-center">
          <ButtonCva size="sm">Small</ButtonCva>
          <ButtonCva size="md">Medium</ButtonCva>
          <ButtonCva size="lg">Large</ButtonCva>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          CVA — States
        </p>
        <div className="flex gap-3 items-center">
          <ButtonCva loading>Saving...</ButtonCva>
          <ButtonCva disabled>Disabled</ButtonCva>
          <ButtonCva variant="danger" disabled>
            Disabled Danger
          </ButtonCva>
        </div>
      </div>
    </div>
  ),
  parameters: { controls: { disable: true } },
};

// ─── SVA Stories ─────────────────────────────────────────────────────────────

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

const svaMeta: Meta<typeof ButtonSva> = {
  title: "UI/Button (Panda SVA)",
  component: ButtonSva,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Panda CSS `sva` (Slot Variance Authority) — multi-slot recipe. Each slot (root, leftIcon, rightIcon, spinner, label) gets its own class string, enabling per-slot style control.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
  args: { onClick: fn(), children: "Button" },
};

export const SvaMeta = svaMeta;

export const SvaShowcase: StoryObj<typeof svaMeta> = {
  render: () => (
    <div className="p-8 bg-gray-50 rounded-2xl space-y-6 min-w-[480px]">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          SVA — Variants
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <ButtonSva variant="primary">Primary</ButtonSva>
          <ButtonSva variant="secondary">Secondary</ButtonSva>
          <ButtonSva variant="ghost">Ghost</ButtonSva>
          <ButtonSva variant="danger">Danger</ButtonSva>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          SVA — With Icons (slot-aware)
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <ButtonSva variant="primary" rightIcon={<ArrowRight />}>
            Get Started
          </ButtonSva>
          <ButtonSva variant="secondary" rightIcon={<ArrowRight />}>
            Learn More
          </ButtonSva>
          <ButtonSva variant="danger" leftIcon={<TrashIcon />}>
            Delete
          </ButtonSva>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          SVA — States
        </p>
        <div className="flex gap-3 items-center">
          <ButtonSva loading>Saving...</ButtonSva>
          <ButtonSva disabled>Disabled</ButtonSva>
        </div>
      </div>
    </div>
  ),
  parameters: { controls: { disable: true } },
};
