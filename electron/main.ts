import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron'; // ipcMain ekledik
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');



process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  }

  // Native Menu
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Import',
          click: async () => {
            const result = await dialog.showOpenDialog({
              properties: ['openFile'],
              filters: [{ name: 'Comma Separated Values (CSV)', extensions: ['csv'] }],
            });

            if (!result.canceled && result.filePaths.length > 0) {
              const filePath = result.filePaths[0];
              const fileContent = fs.readFileSync(filePath, 'utf-8');

              // CSV'yi JSON'a dönüştürme
              const lines = fileContent
                .split('\n')
                .filter((line) => line.trim() !== ''); // Boş satırları kaldır

              const headers = lines.shift()?.split(';').map((h) => h.trim());

              if (!headers) {
                console.error('CSV dosyasında header bulunamadı.');
                return;
              }

              const jsonData = lines
                .map((line) => line.split(';'))
                .filter((cols) => cols.some((col) => col.trim() !== '')) // Boş kolonları kaldır
                .map((line) => {
                  const obj: any = {};
                  headers.forEach((header, index) => {
                    obj[header] = line[index]?.trim() || ''; // Eksik değerleri boş string olarak ekle
                  });
                  return obj;
                });

              console.log('Processed CSV Data:', jsonData); // Kontrol için log
              win?.webContents.send('csv-data', jsonData); // React tarafına gönder
            }
          },
        },
        { label: 'Export', click: () => console.log('Save Clicked') },
        { type: 'separator' },
        { label: 'Exit', role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },
    {
      label: 'View',
      submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }],
    },
    {
      label: 'Help',
      submenu: [{ label: 'About', click: () => console.log('About Clicked') }],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

// React ile iletişim için IPC event
ipcMain.handle('request-csv-data', () => {
  return { message: 'No CSV loaded yet!' };
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
