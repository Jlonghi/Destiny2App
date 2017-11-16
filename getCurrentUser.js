const {ipcRenderer} = require('electron')
const getCurr = document.getElementById('getCurr')
const os = require('os');
const storage = require('electron-json-storage');
var token;

//getCurr.addEventListener('click', function (event) {
//    storage.get('UserData', function(error, data) {
//        if (error) throw error;
 
//        console.log(JSON.stringify(data.Response));
//    });
//})
ipcRenderer.on('destiny2-getCurrentUser',(event, token) => {
    //Set the data path for use with Storage Library
    storage.setDataPath(os.tmpdir());
    console.log(JSON.stringify(token));

    //Setting token data
    storage.set('TokenData',token, function(error) {
        if (error) throw error;
    });

    //Bungie API Request to find current user information
	$.ajax({
	url : 'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
	type: 'GET',
	headers:{
		Authorization: token.token_type + ' ' + token.access_token,
		'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
		'Content-Type': 'application/json'
	},
	success: function (data) {
        //Save the User Data from API
	    storage.set('UserData',data, function(error) {
	        if (error) throw error;
	    });
	}
})
})
