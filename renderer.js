// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')
const apiRequests = require('superagent');
const newWindowBtn = document.getElementById('login')

newWindowBtn.addEventListener('click', function (event) {
  var options = {
    client_id: '22864',
    client_secret: '.OOJcUV-7YSlqqnOotf.R7ulE9d7AiG8.YSoeHa4AJ8'
  };

  var win = new BrowserWindow({ width: 800, height: 600, show:false,'node-integration': false   });
  var bungieUrl = 'https://www.bungie.net/en/OAuth/Authorize?';
  var authUrl = bungieUrl + 'client_id='+options.client_id;
  
  win.loadURL(authUrl);
  win.show();
  function requestBungieToken(options, code) {

    apiRequests
        .post('https://www.bungie.net/Platform/App/OAuth/token/', {
        client_id: options.client_id,
        client_secret: options.client_secret,
        code: code,
        })
        .end(function (err, response) {
        if (response && response.ok) {
            // Success - Received Token.
            // Store it in localStorage maybe?
            console.log(response.body.access_token);
            window.localStorage.setItem('bungietoken', response.body.access_token);
        } else {
            // Error - Show messages.
            console.log(err);
        }
        });

}
  function handleCallback(url){
    var raw_code = /code=([^&]*)/.exec(url) || null;
    var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    var error = /\?error=(.+)$/.exec(url);
    if (code || error) {
    // Close the browser if code found or error
        win.destroy();
    }
    
    // If there is a code, proceed to get token from github
    if (code) {
        requestBungieToken(options, code);
    } else if (error) {
        alert('Oops! Something went wrong and we couldn\'t' +
        'log you in using Bungie. Please try again.');
    }

  }
  
  win.webContents.on('will-navigate', function (event, url) {
    handleCallback(url);
  });

  win.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
    handleCallback(newUrl);
  });
  
  win.on('close', function () { win = null })
})