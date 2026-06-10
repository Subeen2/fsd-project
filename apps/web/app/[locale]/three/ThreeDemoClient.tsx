"use client";

import dynamic from "next/dynamic";

const ThreeDemo = dynamic(() => import("./ThreeDemo"), { ssr: false });

export default function ThreeDemoClient() {
  return <ThreeDemo />;
}
