const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    kiosk: true,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // In production, load the built files
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
  }

  // Prevent right-click context menu on kiosk
  mainWindow.webContents.on('context-menu', (e) => e.preventDefault());

  // Prevent navigation away from the app
  mainWindow.webContents.on('will-navigate', (e) => e.preventDefault());

  // ESC key exits kiosk mode (for A/V team maintenance only)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'Escape' && input.type === 'keyDown') {
      if (mainWindow.isKiosk()) {
        mainWindow.setKiosk(false);
        mainWindow.setFullScreen(false);
      } else {
        app.quit();
      }
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
