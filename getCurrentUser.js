const {ipcRenderer} = require('electron')
const getCurr = document.getElementById('getCurr')
getCurr.addEventListener('click', function (event) {
    alert('GET USER');
    //ipcRenderer.send('destiny2-getCurrentUser', 'getUser');
})
ipcRenderer.on('destiny2-getCurrentUser',(event, token) => {
	console.log(token);
	$.ajax({
	url : 'https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/',
	type: 'GET',
	headers:{
		Authorization: token.token_type + ' ' + token.access_token,
		'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
		'Content-Type': 'application/json'
	},
	success: function (data) {
		console.log('succes: ' + JSON.stringify(data));
	}
})
})
