const {ipcRenderer} = require('electron')
const os = require('os');
const storage = require('electron-json-storage');
const axios = require('axios')

itemType = {
    kinetic: 0,
    energy: 1,
    power: 2,
    head: 3,
    arms: 4,
    chest: 5,
    legs: 6,
    classItem: 7,
    ghost: 8,
    banner:12
}
//$("#power").hover(function(){
//    $(document).mousemove(function(event){
//        $(".image").css({"position":"absolute","left":event.clientX, "top":event.clientY}). show();
//    })
//})

//$(document).bind("click",function(){
//    $(document).unbind("mousemove");
//    $("img").hide();
//})
//function testGet(membershipId, membershipType, contentType){
//    alert("AXIOS CALL")
//    axios({
//        method: 'GET',
//        url: 'https://www.bungie.net/Platform/Destiny2/' + membershipType + '/Profile/' + membershipId + '/?components=' + componentType,
//        headers:{ 'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
//                  'Content-Type': 'application/json'}
//    })
//    .then(function(response){
//        alert(response);
//        console.log(response)
//    })
//    .catch(function (error){
//        alert(error)
//        console.log(error)
//    })
//}
function getIcon(itemHash, type){
    axios({
        method: 'GET',
        url:"https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/" + itemHash,
        headers:{
            'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
            'Content-Type': 'application/json'
        }
    }).then(function(response){
        var item = {
            icon : JSON.stringify(response.data.Response.displayProperties.icon),
            type : type
        }
        ipcRenderer.send('send-icon-image-main',item);
    })
}
ipcRenderer.on('send-icon-image', function(event, item){
    console.log("test" + JSON.stringify(item));
    $("#"+item.type).attr("src", "https://www.bungie.net" + item.icon.replace(/['"]+/g, ''))
})
ipcRenderer.on('character-details', function (event, characterInfo){
    axios({
        method: 'GET',
        url: 'https://www.bungie.net/Platform/Destiny2/' 
            + JSON.stringify(characterInfo.membershipType)
            + '/Profile/' 
            +  JSON.stringify(characterInfo.membershipId).replace(/['"]+/g, '')
            + '/?components=' 
            + 205,
        headers:{ 'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
            'Content-Type': 'application/json'}
    })
    .then(function(response){
        for(var type in itemType){
            console.log(itemType[type])
            getIcon(response.data.Response.characterEquipment.data[characterInfo.characterId].items[itemType[type]].itemHash, type);
        }
    })
    .catch(function (error){
        console.log(error)
    })
    //window.location.href = "./characterInventory.html";
    $(document).ready(function(){
        $("#body").load("./characterInventory.html")
    })

});
