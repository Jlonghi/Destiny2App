// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// const BrowserWindow = require('electron').remote.BrowserWindow
// const path = require('path')
// const apiRequests = require('superagent');

const electronOauth2 = require('electron-oauth2');
const newWindowBtn = document.getElementById('login')

var config = {
  clientId: '22684',
  clientSecret: '.OOJcUV-7YSlqqnOotf.R7ulE9d7AiG8.YSoeHa4AJ8',
  authorizationUrl: 'https://www.bungie.net/en/OAuth/Authorize',
  tokenUrl: 'https://www.bungie.net/Platform/App/OAuth/token/',
  useBasicAuthorizationHeader: true,
  redirectUri: 'https://www.getpostman.com/oauth2/callback'
};

newWindowBtn.addEventListener('click', function (event) {
alert('getting token');
const windowParams = {
    alwaysOnTop: true,
    autoHideMenuBar: true,
    webPreferences: {
        nodeIntegration: false
    }
  }
const options = {
    accessType: 'code'
};
const myApiOauth = electronOauth2(config, windowParams);
myApiOauth.getAccessToken(options)
    .then(token => {
      // use your token.access_token
      console.log(token);
      myApiOauth.refreshToken(token.refresh_token)
        .then(newToken => {
          //use your new token
        });
    });
})