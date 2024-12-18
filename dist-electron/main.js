import { ipcMain, app, BrowserWindow, Menu, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Import",
          click: async () => {
            var _a;
            const result = await dialog.showOpenDialog({
              properties: ["openFile"],
              filters: [{ name: "Comma Separated Values (CSV)", extensions: ["csv"] }]
            });
            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0];
              const fileContent = fs.readFileSync(filePath, "utf-8");
              const lines = fileContent.split("\n").filter((line) => line.trim() !== "");
              const headers = (_a = lines.shift()) == null ? void 0 : _a.split(";").map((h) => h.trim());
              if (!headers) {
                console.error("CSV dosyasında header bulunamadı.");
                return;
              }
              const jsonData = lines.map((line) => line.split(";")).filter((cols) => cols.some((col) => col.trim() !== "")).map((line) => {
                const obj = {};
                headers.forEach((header, index) => {
                  var _a2;
                  obj[header] = ((_a2 = line[index]) == null ? void 0 : _a2.trim()) || "";
                });
                return obj;
              });
              console.log("Processed CSV Data:", jsonData);
              win == null ? void 0 : win.webContents.send("csv-data", jsonData);
            }
          }
        },
        { label: "Export", click: () => console.log("Save Clicked") },
        { type: "separator" },
        { label: "Exit", role: "quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" }
      ]
    },
    {
      label: "View",
      submenu: [{ role: "reload" }, { role: "toggleDevTools" }]
    },
    {
      label: "Help",
      submenu: [{ label: "About", click: () => console.log("About Clicked") }]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}
ipcMain.handle("request-csv-data", () => {
  return { message: "No CSV loaded yet!" };
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
