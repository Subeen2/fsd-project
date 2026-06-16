import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "../ui.store";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({ sidebarOpen: false, toasts: [] });
  });

  describe("sidebar", () => {
    it("initializes with sidebar closed", () => {
      expect(useUiStore.getState().sidebarOpen).toBe(false);
    });

    it("toggleSidebar opens the sidebar", () => {
      useUiStore.getState().toggleSidebar();
      expect(useUiStore.getState().sidebarOpen).toBe(true);
    });

    it("toggleSidebar closes an open sidebar", () => {
      useUiStore.setState({ sidebarOpen: true });
      useUiStore.getState().toggleSidebar();
      expect(useUiStore.getState().sidebarOpen).toBe(false);
    });

    it("setSidebarOpen sets to true", () => {
      useUiStore.getState().setSidebarOpen(true);
      expect(useUiStore.getState().sidebarOpen).toBe(true);
    });

    it("setSidebarOpen sets to false", () => {
      useUiStore.setState({ sidebarOpen: true });
      useUiStore.getState().setSidebarOpen(false);
      expect(useUiStore.getState().sidebarOpen).toBe(false);
    });
  });

  describe("toasts", () => {
    it("initializes with empty toasts", () => {
      expect(useUiStore.getState().toasts).toHaveLength(0);
    });

    it("addToast adds a toast with auto-generated id", () => {
      useUiStore
        .getState()
        .addToast({ message: "저장됐습니다", variant: "success" });
      const { toasts } = useUiStore.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe("저장됐습니다");
      expect(toasts[0].variant).toBe("success");
      expect(toasts[0].id).toBeTruthy();
    });

    it("addToast appends multiple toasts", () => {
      useUiStore.getState().addToast({ message: "첫 번째", variant: "info" });
      useUiStore.getState().addToast({ message: "두 번째", variant: "error" });
      expect(useUiStore.getState().toasts).toHaveLength(2);
    });

    it("each toast gets a unique id", () => {
      useUiStore.getState().addToast({ message: "A", variant: "info" });
      useUiStore.getState().addToast({ message: "B", variant: "info" });
      const { toasts } = useUiStore.getState();
      expect(toasts[0].id).not.toBe(toasts[1].id);
    });

    it("removeToast removes the matching toast", () => {
      useUiStore
        .getState()
        .addToast({ message: "삭제될 토스트", variant: "error" });
      const id = useUiStore.getState().toasts[0].id;
      useUiStore.getState().removeToast(id);
      expect(useUiStore.getState().toasts).toHaveLength(0);
    });

    it("removeToast only removes the targeted toast", () => {
      useUiStore.getState().addToast({ message: "A", variant: "info" });
      useUiStore.getState().addToast({ message: "B", variant: "success" });
      const idToRemove = useUiStore.getState().toasts[0].id;
      useUiStore.getState().removeToast(idToRemove);
      const { toasts } = useUiStore.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe("B");
    });

    it("removeToast with unknown id does nothing", () => {
      useUiStore.getState().addToast({ message: "A", variant: "info" });
      useUiStore.getState().removeToast("nonexistent-id");
      expect(useUiStore.getState().toasts).toHaveLength(1);
    });
  });
});
