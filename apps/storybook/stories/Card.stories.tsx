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
      <p className="text-gray-700">A simple card with default padding.</p>
    </Card>
  ),
};

export const WithSections: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-gray-900">Card Title</h3>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-600">
          This is the main content area of the card.
        </p>
      </CardBody>
      <CardFooter>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="sm">Cancel</Button>
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
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div>
            <p className="font-semibold text-gray-900">Jane Doe</p>
            <p className="text-xs text-gray-500">@janedoe</p>
          </div>
          <Badge variant="success" dot className="ml-auto">Online</Badge>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-gray-600">
          Frontend developer passionate about design systems and accessibility.
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="secondary" size="sm" className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  ),
};

export const Clickable: Story = {
  render: () => (
    <Card onClick={() => alert("Card clicked!")} className="w-64">
      <p className="text-sm text-gray-700">Click me — I'm interactive.</p>
    </Card>
  ),
};

export const Shadows: Story = {
  render: () => (
    <div className="flex gap-4">
      <Card shadow="none" className="flex-1">
        <p className="text-sm text-gray-600">No shadow</p>
      </Card>
      <Card shadow="sm" className="flex-1">
        <p className="text-sm text-gray-600">Shadow sm</p>
      </Card>
      <Card shadow="md" className="flex-1">
        <p className="text-sm text-gray-600">Shadow md</p>
      </Card>
    </div>
  ),
};
