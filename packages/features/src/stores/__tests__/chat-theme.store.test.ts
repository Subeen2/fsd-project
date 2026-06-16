import { beforeEach, describe, expect, it } from "vitest";
import { useChatTheme } from "../chat-theme.store";

describe("useChatTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    useChatTheme.setState({
      bubbleColor: "blue",
      chatBg: "white",
      fontSize: "md",
      roomName: "Mindwave",
    });
  });

  it("initializes with default values", () => {
    const { bubbleColor, chatBg, fontSize, roomName } = useChatTheme.getState();
    expect(bubbleColor).toBe("blue");
    expect(chatBg).toBe("white");
    expect(fontSize).toBe("md");
    expect(roomName).toBe("Mindwave");
  });

  describe("setBubbleColor", () => {
    it("updates bubbleColor", () => {
      useChatTheme.getState().setBubbleColor("purple");
      expect(useChatTheme.getState().bubbleColor).toBe("purple");
    });

    it("persists to localStorage", () => {
      useChatTheme.getState().setBubbleColor("green");
      const stored = JSON.parse(localStorage.getItem("fsd-chat-theme")!);
      expect(stored.bubbleColor).toBe("green");
    });
  });

  describe("setChatBg", () => {
    it("updates chatBg", () => {
      useChatTheme.getState().setChatBg("dark");
      expect(useChatTheme.getState().chatBg).toBe("dark");
    });

    it("persists to localStorage", () => {
      useChatTheme.getState().setChatBg("warm");
      const stored = JSON.parse(localStorage.getItem("fsd-chat-theme")!);
      expect(stored.chatBg).toBe("warm");
    });
  });

  describe("setFontSize", () => {
    it("updates fontSize", () => {
      useChatTheme.getState().setFontSize("lg");
      expect(useChatTheme.getState().fontSize).toBe("lg");
    });

    it("persists to localStorage", () => {
      useChatTheme.getState().setFontSize("sm");
      const stored = JSON.parse(localStorage.getItem("fsd-chat-theme")!);
      expect(stored.fontSize).toBe("sm");
    });
  });

  describe("setRoomName", () => {
    it("updates roomName", () => {
      useChatTheme.getState().setRoomName("My Room");
      expect(useChatTheme.getState().roomName).toBe("My Room");
    });

    it("persists to localStorage", () => {
      useChatTheme.getState().setRoomName("팀 채널");
      const stored = JSON.parse(localStorage.getItem("fsd-chat-theme")!);
      expect(stored.roomName).toBe("팀 채널");
    });
  });

  it("saves all fields together on each update", () => {
    useChatTheme.getState().setBubbleColor("rose");
    useChatTheme.getState().setChatBg("dark");
    useChatTheme.getState().setFontSize("lg");
    useChatTheme.getState().setRoomName("Dev");

    const stored = JSON.parse(localStorage.getItem("fsd-chat-theme")!);
    expect(stored).toEqual({
      bubbleColor: "rose",
      chatBg: "dark",
      fontSize: "lg",
      roomName: "Dev",
    });
  });
});
