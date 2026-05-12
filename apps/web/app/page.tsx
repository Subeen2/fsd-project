import {
  Button,
  Input,
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@fsd/ui";
import { formatDate } from "@fsd/shared";
import type { Post, User } from "@fsd/api";

const mockUsers: User[] = [
  {
    id: "user_01",
    email: "jane@example.com",
    username: "janedoe",
    displayName: "Jane Doe",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    createdAt: new Date("2025-01-10").toISOString(),
    updatedAt: new Date("2025-01-10").toISOString(),
  },
  {
    id: "user_02",
    email: "john@example.com",
    username: "johndoe",
    displayName: "John Doe",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    createdAt: new Date("2025-02-14").toISOString(),
    updatedAt: new Date("2025-02-14").toISOString(),
  },
  {
    id: "user_03",
    email: "sam@example.com",
    username: "samkim",
    displayName: "Sam Kim",
    avatarUrl: null,
    createdAt: new Date("2025-03-01").toISOString(),
    updatedAt: new Date("2025-03-01").toISOString(),
  },
];

const mockPosts: Post[] = [
  {
    id: "post_01",
    title: "Getting started with the FSD monorepo",
    content:
      "Learn how to build scalable applications using Turborepo, pnpm workspaces, and a shared design system.",
    authorId: "user_01",
    author: mockUsers[0]!,
    published: true,
    createdAt: new Date("2025-04-01").toISOString(),
    updatedAt: new Date("2025-04-01").toISOString(),
  },
  {
    id: "post_02",
    title: "Building a design system with React",
    content:
      "A step-by-step guide to creating reusable, accessible UI components with TypeScript and Tailwind CSS.",
    authorId: "user_02",
    author: mockUsers[1]!,
    published: true,
    createdAt: new Date("2025-04-15").toISOString(),
    updatedAt: new Date("2025-04-15").toISOString(),
  },
  {
    id: "post_03",
    title: "WebSocket patterns for real-time apps",
    content:
      "Explore common WebSocket patterns including heartbeat, broadcast, and graceful shutdown.",
    authorId: "user_03",
    author: mockUsers[2]!,
    published: false,
    createdAt: new Date("2025-05-01").toISOString(),
    updatedAt: new Date("2025-05-01").toISOString(),
  },
];

export default function HomePage() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Badge variant="info" dot>
            v0.0.1
          </Badge>
          <Badge variant="success">Monorepo Ready</Badge>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          FSD Project
        </h1>
        <p className="text-lg text-gray-500 max-w-xl">
          A production-ready monorepo with Next.js 15, Express + WebSocket, and
          a shared design system.
        </p>
        <div className="flex gap-3">
          <Button size="lg">Get Started</Button>
          <Button variant="secondary" size="lg">
            View Docs
          </Button>
        </div>
      </section>

      {/* Search */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-gray-900">Search Posts</h2>
        <div className="max-w-sm">
          <Input
            placeholder="Search by title..."
            leftIcon={
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
            }
          />
        </div>
      </section>

      {/* Posts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockPosts.map((post) => (
            <Card key={post.id} shadow="sm">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-900 leading-snug">
                    {post.title}
                  </h3>
                  <Badge variant={post.published ? "success" : "warning"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {post.content}
                </p>
              </CardBody>
              <CardFooter>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={post.author.avatarUrl}
                      fallback={post.author.displayName}
                      alt={post.author.displayName}
                      size="sm"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-700">
                        {post.author.displayName}
                      </p>
                      <time className="text-xs text-gray-400">
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Read →
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Team</h2>
        <div className="flex flex-col gap-3">
          {mockUsers.map((user) => (
            <Card key={user.id} padding="sm" shadow="none">
              <div className="flex items-center gap-4">
                <Avatar
                  src={user.avatarUrl}
                  fallback={user.displayName}
                  alt={user.displayName}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">
                    {user.displayName}
                  </p>
                  <p className="text-sm text-gray-400">@{user.username}</p>
                </div>
                <Badge variant="success" dot>
                  Online
                </Badge>
                <Button variant="secondary" size="sm">
                  Follow
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
