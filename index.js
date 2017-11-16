//Connect the Render window with the electron app
const {ipcRenderer} = require('electron')

//Create window to start logging in
const newWindowBtn = document.getElementById('login')
newWindowBtn.addEventListener('click', function (event) {
    //Send request to start Oauth 2.0
    ipcRenderer.send('destiny2-oauth', 'getToken');
})