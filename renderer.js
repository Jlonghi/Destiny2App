const {ipcRenderer} = require('electron')
const os = require('os');
const storage = require('electron-json-storage');
const axios = require('axios')

var globalChar;
var itemLevels = {
    powerLevel: "",
    requiredLevel: ""
}
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
            type : type,
            stats: response.data.Response.stats.stats
        }
        ipcRenderer.send('send-icon-image-main',item);
    })
}
function getStatDetails(statHash, statValues){
    axios({
        method: 'GET',
        url:"https://www.bungie.net/Platform/Destiny2/Manifest/DestinyStatDefinition/" + statHash,
        headers:{
            'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
            'Content-Type': 'application/json'
        }
    }).then(function(response){
        getItemPower(globalChar.membershipType, globalChar.membershipId, globalChar.itemInstanceId)
        console.log("power level " + itemLevels.powerLevel)
        $("#"+JSON.stringify(response.data.Response.displayProperties.name).replace(/['"]+/g, '')).append("<p>"+JSON.stringify(response.data.Response.displayProperties.name).replace(/['"]+/g, '')+ " " +statValues.value + "</p>")
    })
}
function getItemPower(membershipType, membershipId, itemInstanceId){
    axios({
        method: 'GET',
        url:"https://www.bungie.net/Platform/Destiny2/"+membershipType+"/Profile/"+membershipId+"/item/"+itemInstanceId+"/?components=300",
        headers:{
            'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
            'Content-Type': 'application/json'
        }
    }).then(function(response){
        itemLevels.powerLevel = JSON.stringify(response.Response.instance.data.primaryStat.value)
        itemLevels.requiredLevel = JSON.stringify(response.Response.instance.data.equipRequiredLevel)
        
    })
}
ipcRenderer.on('send-icon-image', function(event, item){
    $("#"+item.type).attr("src", "https://www.bungie.net" + item.icon.replace(/['"]+/g, ''))
    console.log('global test '+ JSON.stringify(globalChar));
    //pop up logic
    $(function() {
        var moveLeft = 20;
        var moveDown = 10;
        $("#"+item.type).hover(function(e) {
            $('div#pop-up').show()
            .css('top', e.pageY + moveDown)
            .css('left', e.pageX + moveLeft)
            .appendTo('body');
            //clears old pop up stats
            $('.stat').text("")
            for(var statHash in item.stats){
                var statValues = {
                    value: JSON.stringify(item.stats[statHash].value),
                    max: JSON.stringify(item.stats[statHash].max),
                    min: JSON.stringify(item.stats[statHash].min),
                }
                getStatDetails(statHash, statValues)
            }
        }, function() {
            $('div#pop-up').hide();
        });
    });
})
ipcRenderer.on('character-details', function (event, characterInfo){
    globalChar = characterInfo;
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
