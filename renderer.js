const {ipcRenderer} = require('electron')

ipcRenderer.on('character-details', function (event, characterId){
    window.location.href = "./characterInventory.html";
});