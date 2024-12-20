import { ipcMain, app, BrowserWindow, Menu, dialog } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.webContents.on("did-finish-load", () => {
    win?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  // Menü Yapısı
  const menuTemplate = [
    {
      label: "File",
      submenu: [
        {
          label: "Import",
          click: async () => {
            var _a;
            const result = await dialog.showOpenDialog({
              properties: ["openFile", "multiSelections"],
              filters: [
                { name: "Comma Separated Values (CSV)", extensions: ["csv"] },
              ],
            });

            if (!result.canceled && result.filePaths.length > 0) {
              const classroomData = [];
              const coursesData = [];

              for (const filePath of result.filePaths) {
                const fileContent = fs.readFileSync(filePath, "utf-8");
                const lines = fileContent
                  .split("\n")
                  .filter((line) => line.trim() !== "");
                const headers = (_a = lines.shift())
                  ?.split(";")
                  .map((h) => h.trim());

                if (!headers) {
                  console.error(`Header bulunamadı: ${filePath}`);
                  continue;
                }

                if (
                  headers.includes("Classroom") &&
                  headers.includes("Capacity")
                ) {
                  console.log(`Classroom dosyası bulundu: ${filePath}`);
                  classroomData.push(...parseCsv(lines, headers));
                } else if (headers.includes("Course") && headers.includes("TimeToStart")) {
                  console.log(`Courses dosyası bulundu: ${filePath}`);
                  coursesData.push(...parseCsv(lines, headers));
                }
              }
              win?.webContents.send("classroom-data", classroomData);
              win?.webContents.send("courses-data", coursesData);
            }
          },
        },
        { label: "Export", click: () => console.log("Save Clicked") },
        { type: "separator" },
        { label: "Exit", role: "quit" },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
      ],
    },
    {
      label: "View",
      submenu: [{ role: "reload" }, { role: "toggleDevTools" }],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About",
          click: () => {
            dialog.showMessageBox({
              type: "info",
              title: "About This Project",
              message: "Campus Dashboard",
              detail:
                "This project is designed to manage campus resources efficiently.\n\nVersion: 1.0.0\nAuthor: Your Name",
              buttons: ["Close"],
            });
          },
        },
      ],
    },
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

function parseCsv(lines, headers) {
  return lines.map((line) => {
    const cols = line.split(";");
    const obj = {};
    headers.forEach((header, index) => {
      var _a;
      obj[header.toLowerCase()] = ((_a = cols[index]) == null
        ? void 0
        : _a.trim()) || "";
    });
    return obj;
  });
}

app.whenReady().then(createWindow);

export { MAIN_DIST, RENDERER_DIST, VITE_DEV_SERVER_URL };
