"use client";

import dynamic from "next/dynamic";

const MindmapCanvas = dynamic(
  () => import("./MindmapCanvas").then((m) => ({ default: m.MindmapCanvas })),
  { ssr: false },
);

export function MindmapClientWrapper() {
  return <MindmapCanvas />;
}
