var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic Yjg5MzUwYzQtYTJjYi00NzQyLWI4ODItNDE0ZTQ1MGJkOTQ4"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

var message = { 
  app_id: "5f25aa69-a1b2-4487-b287-d3de9a774f92",
  contents: {"en": "יש לך הודעה חדשה מאת אורי"},
  data: {"type":"inbox", params:{}},
	filters: [
	  	{"field": "tag", "key": "UserName", "relation": "=", "value": "ice cold"},
			{"field": "tag", "key": "PushTagging/PushPrivate", "relation": "=", "value": "true"}
	]
};

sendNotification(message);