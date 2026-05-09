import { Button } from "@fsd/ui";
import { cn, formatDate } from "@fsd/shared";
import type { Post, User } from "@fsd/api";
import { API_BASE, POST_ROUTES } from "@fsd/api";

// Example server component that demonstrates workspace package imports
export default function HomePage() {
  const now = new Date().toISOString();

  // Type-safe example data using @fsd/api types
  const exampleUser: Pick<User, "id" | "username" | "displayName" | "avatarUrl"> = {
    id: "user_01",
    username: "jdoe",
    displayName: "Jane Doe",
    avatarUrl: null,
  };

  const examplePost: Post = {
    id: "post_01",
    title: "Getting started with FSD monorepo",
    content: "This is an example post demonstrating type safety across the monorepo.",
    authorId: exampleUser.id,
    author: exampleUser,
    published: true,
    createdAt: now,
    updatedAt: now,
  };

  return (
    <div className={cn("space-y-10")}>
      {/* Hero */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to FSD Project
        </h1>
        <p className="text-lg text-gray-600">
          A production-ready monorepo with Next.js 15, Express, and a shared design system.
        </p>
        <div className="flex gap-3">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="secondary" size="lg">
            View Storybook
          </Button>
        </div>
      </section>

      {/* Package showcase */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Workspace Packages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "@fsd/ui", description: "React design system — Button, Input, Card…" },
            { name: "@fsd/shared", description: "Utility functions and shared TypeScript types" },
            { name: "@fsd/api", description: "REST contract types and WebSocket event types" },
            { name: "@fsd/features", description: "Custom hooks and business-logic services" },
          ].map(({ name, description }) => (
            <div
              key={name}
              className="border border-gray-200 rounded-lg p-4 space-y-1"
            >
              <code className="text-sm font-mono text-blue-600">{name}</code>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API contract demo */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">API Contract (from @fsd/api)</h2>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm font-mono">
          <p>
            <span className="text-gray-500">Base path:</span>{" "}
            <span className="text-blue-700">{API_BASE}</span>
          </p>
          <p>
            <span className="text-gray-500">Posts endpoint:</span>{" "}
            <span className="text-green-700">
              {POST_ROUTES.list.method} {POST_ROUTES.list.path}
            </span>
          </p>
        </div>
      </section>

      {/* Example post card */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Example Post</h2>
        <article className="border border-gray-200 rounded-lg p-5 space-y-2">
          <h3 className="text-lg font-medium">{examplePost.title}</h3>
          <p className="text-gray-600 text-sm">{examplePost.content}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>By {examplePost.author.displayName}</span>
            <span>&middot;</span>
            <time dateTime={examplePost.createdAt}>
              {formatDate(examplePost.createdAt)}
            </time>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm">
              Edit
            </Button>
            <Button variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </article>
      </section>
    </div>
  );
}
