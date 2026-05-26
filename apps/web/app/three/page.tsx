import dynamic from "next/dynamic";

const ThreeDemo = dynamic(() => import("./ThreeDemo"), { ssr: false });

export const metadata = { title: "Three.js Demo" };

export default function Page() {
  return <ThreeDemo />;
}
