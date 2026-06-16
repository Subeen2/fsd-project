import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Card, CardHeader, CardBody, CardFooter } from "../Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders as non-interactive div by default", () => {
    render(<Card>Content</Card>);
    const card = screen.getByText("Content").parentElement!;
    expect(card.tagName).toBe("DIV");
    expect(card).not.toHaveAttribute("role");
  });

  it("has role=button and is clickable when onClick is provided", async () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Click me</Card>);
    const card = screen.getByRole("button", { name: /click me/i });
    await userEvent.click(card);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is keyboard accessible when interactive", async () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Press me</Card>);
    const card = screen.getByRole("button");
    expect(card).toHaveAttribute("tabIndex", "0");
  });
});

describe("CardHeader / CardBody / CardFooter", () => {
  it("renders all sub-components", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
