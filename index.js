// Sample Request
const {ipcRenderer} = require('electron')
const newWindowBtn = document.getElementById('login')
newWindowBtn.addEventListener('click', function (event) {
    alert('clicking');
    ipcRenderer.send('destiny2-oauth', 'getToken');
})