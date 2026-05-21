import { MindmapClientWrapper } from "./MindmapClientWrapper";

export const metadata = { title: "마인드맵" };

export default function MindmapPage() {
  return (
    <div
      style={{
        position: "fixed",
        top: "65px",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <MindmapClientWrapper />
    </div>
  );
}
