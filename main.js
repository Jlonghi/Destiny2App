const {ipcMain} = require('electron')
const electron = require('electron')
const electronOauth2 = require('electron-oauth2');

// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const config = {
  clientId: '22684',
  clientSecret: '.OOJcUV-7YSlqqnOotf.R7ulE9d7AiG8.YSoeHa4AJ8',
  authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize',
  tokenUrl: 'https://www.bungie.net/Platform/App/OAuth/token/',
  useBasicAuthorizationHeader: false,
  redirectUri: 'https://www.getpostman.com/oauth2/callback'
};

// Run window params for Electron oauth2
const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false
    }
};
const options = {
    accessType: 'code'
};

//Call library function to begin authorization
const bungieOAuth = electronOauth2(config, windowParams);

//Receive message from Renderer
ipcMain.on('destiny2-oauth', (event, arg) => {
  bungieOAuth.getAccessToken(options)
    .then(token => {
      // use your token.access_token
      //bungieOAuth.refreshToken(token.refresh_token)
      //  .then(newToken => {
      //    //use your new token
      //  });
		event.sender.send('destiny2-getCurrentUser', token);
    });
})
ipcMain.on('character-details-main', function (event, characterInfo){
    event.sender.send('character-details', characterInfo);
});
ipcMain.on('send-profile-main', function(event, response){
    event.sender.send('send-profile', response);
})
ipcMain.on('send-icon-image-main', function(event, response){
    event.sender.send('send-icon-image', response);
})
