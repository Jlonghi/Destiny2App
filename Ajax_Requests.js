//
//Made this file to reference for functions we've tested through postman
//If you get this far to use because i'm sleeping
//FYI character rendering won't be possible until we learn to implement 3D rendering (shotty not)
const {ipcRenderer} = require('electron');
const storage = require('electron-json-storage');
const os = require('os');
var axios = require('axios');

//This call is post request for set lock state of an item
//$.ajax({
//	url:  'https://www.bungie.net/Platform/Destiny2/Actions/Items/SetLockState/ ',
//	type: 'POST',
//	headers:{
//		Authorization: token.token_type + ' ' + token.access_token,
//		'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
//		'Content-Type': 'application/json'
//	},
//	data:{
//		//Lock or unlock
//		"state": false,
//		//Item Instance ID acquired through search
//		"itemId": "6917529043014607515",
//		//CharacterID from profile
//		"characterId": "2305843009299735818",
//		"membershipType": 4
//	},
//	success: function(data){
//	    console.log(JSON.stringify(data));

//	}
//})

//This call is a get request for Destiny2 profile information 
//component_type variable must be given to specify what information
function getProfileInfo(membership_id, account_type, component_type) {

    axios({
        method: 'GET',
        url: 'https://www.bungie.net/Platform/Destiny2/' + account_type + '/Profile/' + membership_id + '/?components=' + component_type,
        headers: {
            'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
            'Content-Type': 'application/json'
        }
    })
    .then(function (response) {
        ipcRenderer.send('send-profile-main', response);

        //Saving character data
        //storage.set('CharacterData', response, function (error) {
        //    if (error) throw error;
        //});
    })
    .catch(function (error) {
        alert(error)
    })

    //$.ajax({
    //    url: 'https://www.bungie.net/Platform/Destiny2/' + account_type + '/Profile/' + membership_id + '/?components=' + component_type,
    //    type: 'GET',
    //    headers: {
    //        'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
    //        'Content-Type': 'application/json'
    //    },
    //    success: function (data) {
    //        //Set the data path for use with Storage Library
    //        storage.setDataPath(os.tmpdir());
    //        //Saving character data
    //        storage.set('CharacterData', data, function (error) {
    //            if (error) throw error;
    //        });
    //    }
    //})

}

//This call is a get request for item information (Pic/details)
// use itemId with the item's hash id
function getInfo(definition, itemId) {
    $.ajax({
        //DestinyInventoryItemDefinition
        url: 'https://www.bungie.net/Platform/Destiny2/Manifest/' + definition + '/' + itemId,
        type: 'GET',
        headers: {
            'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
            'Content-Type': 'application/json'
        },
        success: function (data) {
            console.log(JSON.stringify(data));

        }
    })
}