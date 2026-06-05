import { contextBridge, ipcRenderer } from "electron";

// Exposed API shape — keep in sync with index.d.ts
const electronAPI = {
  // App info
  getVersion: (): Promise<string> => ipcRenderer.invoke("app:version"),
  getPlatform: (): Promise<string> => ipcRenderer.invoke("app:platform"),
  isDev: (): Promise<boolean> => ipcRenderer.invoke("app:isDev"),

  // Theme
  getTheme: (): Promise<"light" | "dark"> => ipcRenderer.invoke("theme:get"),
  setTheme: (mode: "light" | "dark" | "system"): void =>
    ipcRenderer.send("theme:set", mode),

  // Native dialogs
  openFile: (filters?: Electron.FileFilter[]): Promise<string | null> =>
    ipcRenderer.invoke("dialog:openFile", filters),
  saveFile: (defaultName?: string): Promise<string | null> =>
    ipcRenderer.invoke("dialog:saveFile", defaultName),

  // Shell
  openExternal: (url: string): void =>
    ipcRenderer.send("shell:openExternal", url),

  // Window controls (for custom titlebars)
  minimize: (): void => ipcRenderer.send("win:minimize"),
  maximize: (): void => ipcRenderer.send("win:maximize"),
  close: (): void => ipcRenderer.send("win:close"),
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
