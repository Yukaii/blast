import { app, BrowserWindow, utilityProcess } from "electron";

import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

import { setMenu } from './menu'

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 475,
    width: 750,
    darkTheme: true,
    frame: false,
    vibrancy: "under-window",
    transparent: true,
    resizable: false,
    backgroundColor: "#00000000",
    visualEffectState: "followWindow",
    thickFrame: false,
    minimizable: false,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};


let runtimeProcess: any;

const startRuntime = (): void => {
  const modulePath = require.resolve('@blastlauncher/runtime/dist/run.js')
  runtimeProcess = utilityProcess.fork(modulePath)
}

const stopRuntime = (): void => {
  runtimeProcess.kill()
}

const onReady = (): void => {
  startRuntime();
  setMenu();
  createWindow();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", onReady);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  installExtension(REACT_DEVELOPER_TOOLS, { loadExtensionOptions: { allowFileAccess: true } })
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
