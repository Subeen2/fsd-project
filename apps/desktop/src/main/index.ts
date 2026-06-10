import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  nativeTheme,
} from "electron";
import { join } from "path";

const DEV_URL = "http://localhost:3000";
const isDev = !app.isPackaged;

// ─── Window ───────────────────────────────────────────────────────────────────

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      sandbox: true,
      // Allow loading local Next.js static files in production
      webSecurity: !isDev,
    },
  });

  // Show window only when content is ready (avoids white flash)
  win.once("ready-to-show", () => win.show());

  // Open <a target="_blank"> links in the system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    win.loadURL(DEV_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    // Production: load the Next.js static export bundled with the app
    win.loadFile(join(process.resourcesPath, "web", "index.html"));
  }

  return win;
}

// ─── App menu ─────────────────────────────────────────────────────────────────

function buildMenu(): void {
  const isMac = process.platform === "darwin";
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" as const },
              { type: "separator" as const },
              { role: "services" as const },
              { type: "separator" as const },
              { role: "hide" as const },
              { role: "hideOthers" as const },
              { role: "unhide" as const },
              { type: "separator" as const },
              { role: "quit" as const },
            ],
          },
        ]
      : []),
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        ...(isDev ? [{ role: "toggleDevTools" as const }] : []),
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...(isMac
          ? [{ type: "separator" as const }, { role: "front" as const }]
          : [{ role: "close" as const }]),
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ─── IPC handlers ─────────────────────────────────────────────────────────────

function registerIpcHandlers(): void {
  // App info
  ipcMain.handle("app:version", () => app.getVersion());
  ipcMain.handle("app:platform", () => process.platform);
  ipcMain.handle("app:isDev", () => isDev);

  // Theme
  ipcMain.handle("theme:get", () =>
    nativeTheme.shouldUseDarkColors ? "dark" : "light",
  );
  ipcMain.on("theme:set", (_e, mode: "light" | "dark" | "system") => {
    nativeTheme.themeSource = mode;
  });

  // Native file dialog
  ipcMain.handle(
    "dialog:openFile",
    async (_e, filters?: Electron.FileFilter[]) => {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openFile"],
        filters: filters ?? [{ name: "All Files", extensions: ["*"] }],
      });
      return canceled ? null : filePaths[0];
    },
  );

  ipcMain.handle("dialog:saveFile", async (_e, defaultName?: string) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: defaultName,
    });
    return canceled ? null : filePath;
  });

  // Shell
  ipcMain.on("shell:openExternal", (_e, url: string) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      shell.openExternal(url);
    }
  });

  // Window controls (useful for custom titlebars)
  ipcMain.on("win:minimize", (e) =>
    BrowserWindow.fromWebContents(e.sender)?.minimize(),
  );
  ipcMain.on("win:maximize", (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (win?.isMaximized()) win.unmaximize();
    else win?.maximize();
  });
  ipcMain.on("win:close", (e) =>
    BrowserWindow.fromWebContents(e.sender)?.close(),
  );
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  buildMenu();
  registerIpcHandlers();
  createWindow();

  // macOS: re-create window when dock icon is clicked and no windows are open
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit on all windows closed (except macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
