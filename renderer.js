const {ipcRenderer} = require('electron')
const os = require('os');
const storage = require('electron-json-storage');
const axios = require('axios')

var globalChar;
var globalPreviousElement;
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

var testItem = {
    instanceId: "",
    itemHash: "",
    stats: {},
    type:"",
    powerLevel:"",
    requiredLevel:"",
    iconUrl: "",
    itemLocation: "",
    
}
function getItemType(itemBucketHash){
    axios({
        method: 'GET',
        url:"https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryBucketDefinition/" + itemBucketHash,
        headers:{
            'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
            'Content-Type': 'application/json'
        }
    }).then(function(response){

    })
}   

//gets stat hash's, item name and icon
function getIcon(itemHash, type, itemInstanceId){
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
            instanceId: itemInstanceId.replace(/['"]+/g, ''),
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
        if(JSON.stringify(response.data.Response.displayProperties.name) != undefined){
            var property = JSON.stringify(response.data.Response.displayProperties.name).replace(/['"]+/g, '')

            testItem.stats[property.replace(/ /g,'')] = statValues.value

            $("#"+property.replace(/ /g,'')).append("<p>"+JSON.stringify(response.data.Response.displayProperties.name).replace(/['"]+/g, '')+ " " +statValues.value + "</p>")
        }
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
        if(JSON.stringify(response.data.Response.instance.data.primaryStat) != undefined){
            itemLevels.powerLevel = JSON.stringify(response.data.Response.instance.data.primaryStat.value)
            itemLevels.requiredLevel = JSON.stringify(response.data.Response.instance.data.equipRequiredLevel)
            $("#LightLevel").append("<p> Light: "+ itemLevels.powerLevel +"</p>")
            $("#Required").append("<p> Required Level "+ itemLevels.requiredLevel +"</p>")
        }
        
    })
}
ipcRenderer.on('send-icon-image', function(event, item){
    $("#"+item.type).attr("src", "https://www.bungie.net" + item.icon.replace(/['"]+/g, ''))
    //pop up logic
        var moveLeft = 20;
        var moveDown = 10;
        $("#"+item.type).click(function(e) {

            if($("#"+item.type).data('clicked')){
                if(item.type == globalPreviousElement){
                    $('div#pop-up').hide();
                    $("#"+item.type).data('clicked', false)
                    globalPreviousElement = item.type;
                }

            }
            else{
                $("#"+item.type).data('clicked', true);
                if(globalPreviousElement != item.type)
                    $("#"+globalPreviousElement).data('clicked', false);
                globalPreviousElement = item.type;
                $('div#pop-up').show()
                .css('top', e.pageY + moveDown)
                .css('left', e.pageX + moveLeft)
                .appendTo('body');
                //clears old pop up stats
                $('.stat').text("")
                getItemPower(globalChar.membershipType, globalChar.membershipId, item.instanceId)
                for(var statHash in item.stats){
                    var statValues = {
                        value: JSON.stringify(item.stats[statHash].value),
                        max: JSON.stringify(item.stats[statHash].max),
                        min: JSON.stringify(item.stats[statHash].min),
                    }
                    getStatDetails(statHash, statValues)
                }
                console.log("our item! " + JSON.stringify(testItem))
            }
        });
})
//gets the item hash for a characters inventory
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
            getIcon(response.data.Response.characterEquipment.data[characterInfo.characterId].items[itemType[type]].itemHash, type,
                    response.data.Response.characterEquipment.data[characterInfo.characterId].items[itemType[type]].itemInstanceId);
        }
        ipcRenderer.send('send-profile-main', globalAccountCharacters)
        
    })
    .catch(function (error){
        console.log(error)
    })
    //window.location.href = "./characterInventory.html";
    $(document).ready(function(){
        $("#body").load("./characterInventory.html")
    })
   
    
});
