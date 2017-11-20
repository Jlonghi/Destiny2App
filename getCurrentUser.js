const {ipcRenderer} = require('electron')
const getCurr = document.getElementById('getCurr')
const os = require('os');
const storage = require('electron-json-storage');
var axios = require('axios');
var charData;
// jQuery
var ClassRaceGender ={ 
	"Race" : ["Human", "Awoken", "Exo", "Unknown"],
	"Class" : ["Titan", "Hunter", "Warlock", "Unknown"],
	"Gender" : ["Male", "Female", "Unknown"]
}

function sendProfile(data){
    $.getScript('./Ajax_Requests.js', function()
    {
        getProfileInfo(JSON.stringify(data.data.Response.destinyMemberships[0].membershipId).replace(/['"]+/g, ''),
                                        JSON.stringify(data.data.Response.destinyMemberships[0].membershipType),
                                        200);
    });
}

ipcRenderer.on('send-profile', function(event, data) {
		var charData = data.data.Response.characters.data;
		for (j in charData){
			console.log(JSON.stringify(charData[j].emblemBackgroundPath));
			var url = "\"https://www.bungie.net"+JSON.stringify(charData[j].emblemBackgroundPath).replace(/['"]+/g, '')
			$("#characterEmbelems").append(
                "<div class='element' id='"+ j +"' style='background-image:url("+url+"\"); height:85px; width:428px'>"
			        +"<div style='padding:10px 0px 0px 80px'>"
                        +"<div align='left' style='font-size:150%; padding-bottom:5px'>"
                            + ClassRaceGender.Class[JSON.stringify(charData[j].classType)]
                            +"<object align='right' style='padding-right: 10px'>"
                                + JSON.stringify(charData[j].levelProgression.level)
                            +"</object>"
                        +"</div>"

                        +"<div align='left' style='font-size:120%'>"
                            + ClassRaceGender.Race[JSON.stringify(charData[j].raceType)] + " " + ClassRaceGender.Gender[JSON.stringify(charData[j].genderType)] 
                            +"<object align='right' style='padding-right: 10px'>"
                                +"<i class='glyphicon glyphicon-flash' style='color:yellow; padding-left: 1px' >"
                                    + JSON.stringify(charData[j].light)
                                +"</i>"
                            +"</object>"
                        +"</div>"

                    +"</div>"
			+"</div> </br>");
			document.getElementById(j)
                .addEventListener('click', function (event) {
                    ipcRenderer.send('character-details-main', charData[this.id]);
                });
		}
		
    });

ipcRenderer.on('destiny2-getCurrentUser',(event, token) => {
    //Set the data path for use with Storage Library
    storage.setDataPath(os.tmpdir());
    //DELETE THIS LATER
    //WE WANT TO START FRESH WHILE TESTING
    storage.remove('CharacterData', function(error) {
        if (error) throw error;
    });
    storage.remove('TokenData', function(error) {
        if (error) throw error;
    });
    storage.remove('UserData', function(error){
        if (error) throw error;
    })
    //Setting token data
    storage.set('TokenData',token, function(error) {
        if (error) throw error;
    });
    ////Bungie API Request to find current user information(replacing old function)
    axios({
        method: 'GET',
        url: 'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
        headers: { 
            Authorization: token.token_type + ' ' + token.access_token,
            'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
            'Content-Type': 'application/json'}
    })
    .then(function(response){
        storage.set('UserData',response, function(error) {
            if (error)
                throw error;
            else{
                //window.location.href = "./index2.html";
                $("#login").hide();
                sendProfile(response);
            }
        });
    })
    .catch(function (error){
    })
    ////Bungie API Request to find current user information
	//$.ajax({
	//url : 'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
	//type: 'GET',
	//headers:{
	//	Authorization: token.token_type + ' ' + token.access_token,
	//	'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
	//	'Content-Type': 'application/json'
	//},
	//success: function (data) {
    //    //Save the User Data from API
	//    storage.set('UserData',data, function(error) {
	//        if (error)
	//            throw error;
	//        else{
	//            //window.location.href = "./index2.html";
	//            $("#login").hide();
	//            renderCharacterEmblems(data);
	//        }
	//    });
	//}
    //})
})



