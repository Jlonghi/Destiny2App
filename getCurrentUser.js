const {ipcRenderer} = require('electron')
const getCurr = document.getElementById('getCurr')
const os = require('os');
const storage = require('electron-json-storage');
var charData;
// jQuery


function renderCharacterEmblems(data){
    $.getScript('./Ajax_Requests.js', function()
    {
        getProfileInfo(JSON.stringify(data.Response.destinyMemberships[0].membershipId).replace(/['"]+/g, ''),
                                        JSON.stringify(data.Response.destinyMemberships[0].membershipType),
                                        200);
    });
    storage.get('CharacterData', function(error, data) {
        if (error) throw error;
		var charData = data.Response.characters.data;
		for (j in charData){
			console.log(JSON.stringify(charData[j].emblemBackgroundPath));
			var url = "\"https://www.bungie.net"+JSON.stringify(charData[j].emblemBackgroundPath).replace(/['"]+/g, '')
			$("#characterEmbelems").append("<div style='background-image:url("+url+"\"); height:64px; width:328px'>"
			+"<div aligned='left' style='padding:10px 0px 0px 80px'>class name </br> Exo Female</div>"
			+"<div aligned='right'></div>"
			+"</div></br>");
		}
		
    });
}

ipcRenderer.on('destiny2-getCurrentUser',(event, token) => {
    //Set the data path for use with Storage Library
    storage.setDataPath(os.tmpdir());

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
	        if (error)
	            throw error;
	        else{
	            //window.location.href = "./index2.html";
	            $("#login").hide();
	            renderCharacterEmblems(data);
	        }
	    });
	}
    })
})



