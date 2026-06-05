// Type declarations for window.electronAPI (exposed via contextBridge)
// Keep in sync with src/preload/index.ts

export interface ElectronAPI {
  // App info
  getVersion(): Promise<string>;
  getPlatform(): Promise<string>;
  isDev(): Promise<boolean>;

  // Theme
  getTheme(): Promise<"light" | "dark">;
  setTheme(mode: "light" | "dark" | "system"): void;

  // Native dialogs
  openFile(
    filters?: { name: string; extensions: string[] }[],
  ): Promise<string | null>;
  saveFile(defaultName?: string): Promise<string | null>;

  // Shell
  openExternal(url: string): void;

  // Window controls
  minimize(): void;
  maximize(): void;
  close(): void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
