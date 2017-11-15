// Sample Request
$.ajax({
    url: 'https://www.bungie.net/Platform/Destiny2/Milestones/',
    headers: {
        'X-API-Key':'d3c3718995fb464ca66ddba314dc183a',
        'Content-Type':'application/json'
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
      console.log('succes: '+JSON.stringify(data));
    }
  });
