import { app, BrowserWindow } from "electron";
import * as path from "node:path";

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Permet d'utiliser les modules Node.js dans le rendu
      contextIsolation: false, // Désactive l'isolation de contexte pour simplifier le développement
    },
  });

  win.loadURL("http://localhost:5173"); // Remplacez par le port de votre application Vue.js
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
