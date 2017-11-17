//
//Made this file to reference for functions we've tested through postman
//If you get this far to use because i'm sleeping
//FYI character rendering won't be possible until we learn to implement 3D rendering (shotty not)

//This call is post request for set lock state of an item
$.ajax({
	url:  'https://www.bungie.net/Platform/Destiny2/Actions/Items/SetLockState/ ',
	type: 'POST',
	headers:{
		Authorization: token.token_type + ' ' + token.access_token,
		'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
		'Content-Type': 'application/json'
	},
	data:{
		//Lock or unlock
		"state": false,
		//Item Instance ID acquired through search
		"itemId": "6917529043014607515",
		//CharacterID from profile
		"characterId": "2305843009299735818",
		"membershipType": 4
	},
	success: function(data){
		console.log(data);
	}
})

//This call is a get request for Destiny2 profile information 
//component_type variable must be given to specify what information
$.ajax({
	url:  'https://www.bungie.net/Platform/Destiny2/TigerBlizzard/Profile/4611686018470663017/?components=' + component_type,
	type: 'GET',
	headers:{
		'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
		'Content-Type': 'application/json'
	},
	success: function(data){
		console.log(data);
	}
	
})

//This call is a get request for item information (Pic/details)
// use itemId with the item's hash id
$.ajax({
	url:  'https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/' + itemId,
	type: 'GET',
	headers:{
		'X-API-Key': 'd3c3718995fb464ca66ddba314dc183a',
		'Content-Type': 'application/json'
	},
	success: function(data){
		console.log(data);
	}
})