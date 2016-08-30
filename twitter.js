var app = require('express')();
var http = require('http').Server(app);
var Twit= require('twit');
var request = require('request');

var SpotifyWebApi = require('spotify-web-api-node');   // Requiring the Twit package
var T = new Twit({
    consumer_key:         'YVbShMypT2aVhTXCZOUKCQk0K'
  , consumer_secret:      '3vNUJzIeST9sk9cGYT2T0eEIAZvW4w2V4YNaedSHlMW9wz8Zic'
  , access_token:         '3182431677-3PZVlutyuex9RTGbBG9T5cvufXEgDr9jXhmNVWc'
  , access_token_secret:  'Y4bpT7W03EGFkRBlPoWuVVFdVxd4byTgFDEpAkgermuNQ'
})    // Creating an instance of the Twit package

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : 'c5339edbd19441f69820b06cd5dcb3e6',
  clientSecret : '673a3ddd66fe44d390e9fbecdc3a70b7'
});

var masterVolume = 50;

//var songQueue = [];
var currentSongIndex = -1;
var allParties = [];

var stream = T.stream('statuses/filter', { track: 'mlhprimedeejay' });

var user_stream   = T.stream('user');

/* Listen for favorite events */
user_stream.on('favorite', function (eventMsg) {
  // An if statement to exclude favorites BY the screen_name defined above
  console.log(eventMsg);
  var favoritedScreenName = eventMsg.target.screen_name;
  for (var q = 0; q < allParties[0].people.length; q++){
  	if (allParties[0].people[q].name == favoritedScreenName){
  		request({ url: "http://api.reimaginebanking.com/accounts/" + allParties[0].people[q].id + "/deposits?key=f22e0b663e5763bc27e5a5b03f49999b", method: 'POST', json: {
				  "medium": "balance",
				  "transaction_date": "2016-08-07",
				  "amount": 10,
				  "status": "pending",
				  "description": "string"
				}}, function(err, res, body){
					T.post('statuses/update', { status: '@' + favoritedScreenName + ' Song Choice Liked 10 Points added to Balance.' }, function(err, data, response) {
						console.log("tweeted 10 point addition");
					});
				});
  	}
  }
});

stream.on('tweet', function (tweet) {
  console.log(tweet.text);
  if (tweet.text.toLowerCase().indexOf("create party") != -1){
  	var partyName = tweet.text.toLowerCase().split("create party ")[1];
  	console.log(partyName);
  	T.post('statuses/update', { status: '@' + tweet.user.screen_name + ' Party Created Successfully #' + partyName }, function(err, data, response) {
	  //console.log(JSON.stringify(data.entities.hashtags[1].text));
	  console.log(data.entities.hashtags[0].text);
	  // console.log(JSON.stringify(data.entities.hashtags));
	  // console.log(JSON.stringify(data.entities.hashtags)[1]);
	  request({ url: "http://api.reimaginebanking.com/customers?key=f22e0b663e5763bc27e5a5b03f49999b", method: 'POST', json: {
			"first_name": partyName, //Change party name to whatever it is
		 	"last_name": "deeJay",
		 	"address": {
		 	"street_number": "100",
		 	"street_name": "College Drive",
		    "city": "Edison",
		    "state": "NJ",
		    "zip": "08817"}
		}}, function(err, res, body) {
			customerId = body.objectCreated._id;
			allParties.push({
				"id": customerId,
				"name": partyName,
				"people": [],
				"songQueue": [
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 },
				{ url: 'spotify:track:7tsgm8M8uO6W1HmBAmHFGv', bids: 0 }
				]
			});
		});
	});
  }
  else if (tweet.text.toLowerCase().indexOf("request \"") != -1){
  	var partyReqName = tweet.entities.hashtags[0].text;

  	var songName = tweet.text.toLowerCase().split("bid: ")[0].split("request \"")[1].split("\"")[0];
  	// console.log(tweet.text.toLowerCase().split("request \"")[1].split("\"")[1].replace(" by ", ""));
  	// console.log(tweet.text.toLowerCase().split("request \"")[1].split("\"")[1].indexOf(" by ") + 4);
  	var artistName = tweet.text.toLowerCase().split("bid: ")[0].split("request \"")[1].split("\"")[1].replace(" by ", "");

  	var bidAmount = parseInt(tweet.text.toLowerCase().split("bid: ")[1]);

  	console.log("Song Request for " + partyReqName + ": " + songName + " - " + artistName);

  	var partyFound = false;
  	var partyForSong;

  	for (var q = 0; q < allParties.length; q++){
  		if (allParties[q].name == partyReqName){
  			partyFound = true;
  			partyForSong = allParties[q];
  			console.log("Party found.");
  			break;
  		}
  	}

  	if (partyFound){

  		var userFound = false;
  		var userToUse;

  		for (var q = 0; q < partyForSong.people.length; q++){
  			if (partyForSong.people[q].name == tweet.user.screen_name){
  				userFound = true;
  				userToUse = partyForSong.people[q];
  				break;
  			}
  		}

  		if (userFound){
  			//capitalone stuff
  			//make purchase
  			if (userToUse.balance >= bidAmount) {
  				request({ url: "http://api.reimaginebanking.com/accounts/" + userToUse.id + "/withdrawals?key=f22e0b663e5763bc27e5a5b03f49999b", method: 'POST', json: {
				  "medium": "balance",
				  "transaction_date": "2016-08-07",
				  "amount": bidAmount,
				  "status": "pending",
				  "description": "string"
				}}, function(err, res, body){
					console.log("Purchase");
					userToUse.balance = userToUse.balance - bidAmount;
					T.post('statuses/update', { status: '@' + tweet.user.screen_name + ' Song Request Made Successfully. Remaining Balance: ' + userToUse.balance }, function(err, data, response) {
					  
					});
					spotifyApi.searchTracks(songName + " " + artistName)
				      .then(function(data) {
				        //console.log(data.body.tracks.items[0]);
				        var spotifyURL = data.body.tracks.items[0].uri;
				        var objExists = false;
				        var songObj;

				        for (var q = 0; q < partyForSong.songQueue.length; q++){
				        	if (partyForSong.songQueue[q].url == spotifyURL){
				        		objExists = true;
				        		songObj = partyForSong.songQueue[q];
				        		break;
				        	}
				        }
				        if (!objExists) {
				        	partyForSong.songQueue.push({
					        	"url": spotifyURL,
					        	"bids": bidAmount
				        	});
				        }
				        else {
				        	songObj.bids += bidAmount;
				        }
				        sortByKey(partyForSong.songQueue, "bids");
				        console.log(partyForSong.songQueue);

				      }, function(err) {
				        console.error(err);
				      });
				});
  			}
  			else {
  				console.log(userToUse.balance + " < " + bidAmount);
  				console.log("Balance too low.");
  			}
  			
  		} 
  		else {
  			//make capitalone account
  			//add to array
  			request({ url: "http://api.reimaginebanking.com/customers/" + partyForSong.id + "/accounts?key=f22e0b663e5763bc27e5a5b03f49999b", method: 'POST', json: {
				  "type": "Checking",
				  "nickname": "string",
				  "rewards": 0,
				  "balance": 1000 - bidAmount,
				  "account_number": (pad(partyForSong.people.length + 1, 16)).toString()
				}
			}, function(err, res, body) {

				console.log(res.body);

				T.post('statuses/update', { status: '@' + tweet.user.screen_name + ' Song Request Made Successfully. Remaining Balance: ' + (1000 - bidAmount) }, function(err, data, response) {
					  if (err) {
					  	console.log(err);
					  }
					  else {
					  	console.log("balance tweeted");
					  }
				});
				
				partyForSong.people.push({
					"number": (pad(partyForSong.people.length + 1, 16)).toString(),
					"name": tweet.user.screen_name,
					"id": res.body.objectCreated._id,
					"balance": 1000 - bidAmount
				});

				spotifyApi.searchTracks(songName + " " + artistName)
			      .then(function(data) {
			        //console.log(data.body.tracks.items[0]);
			        var spotifyURL = data.body.tracks.items[0].uri;
			        var objExists = false;
			        var songObj;

			        for (var q = 0; q < partyForSong.songQueue.length; q++){
			        	if (partyForSong.songQueue[q].url == spotifyURL){
			        		objExists = true;
			        		songObj = partyForSong.songQueue[q];
			        		break;
			        	}
			        }
			        if (!objExists) {
			        	partyForSong.songQueue.push({
				        	"url": spotifyURL,
				        	"bids": bidAmount
			        	});
			        }
			        else {
			        	songObj.bids += bidAmount;
			        }
			        sortByKey(partyForSong.songQueue, "bids");
			        console.log(partyForSong.songQueue);

			      }, function(err) {
			        console.error(err);
			      });

			});
  		}

  		
  	}
  	else {
  		console.log("Party does not exist.");
  	}

  	

  }
});

app.get("/", function(req, res){
	res.send("<h1>deeJay</h1>");
});

app.get("/volumeup", function(req, res){
	//bose code
	console.log("volumeup");
	res.send("volumeup");
	var options = {
	  uri: 'http://10.20.5.61:8090/volume',
	  method: 'POST',
	  json: {
	    "volume": masterVolume + 25
	  }
	};

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("yes") // Print the shortened url.
	  }
	});
});

app.get("/volumedown", function(req, res){
	//bose code
	console.log("volumedown");
	res.send("volumedown");
	var options = {
	  uri: 'http://10.20.5.61:8090/volume',
	  method: 'POST',
	  json: {
	    "volume": masterVolume - 25
	  }
	};

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("yes") // Print the shortened url.
	  }
	});
});

app.get("/nextSong", function(req, res){
	//bose code
	res.send("nextSong");
	console.log("nextSong");
	currentSongIndex++;

	if (allParties[0].songQueue.length <= 1){
		currentSongIndex = 0;
	}

	console.log("currentSongIndex: " + currentSongIndex);

	var options = {
	  uri: 'http://10.20.5.61:8090/select',
	  method: 'POST',
	  json: {
	    "ContentItem": { 
		     "source": "SPOTIFY", 
		     "type": "uri", 
		     "location": allParties[0].songQueue[currentSongIndex].url,  
		     "sourceAccount": "bosehack16"  
	   }
	  }
	};

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("yes") // Print the shortened url.
	  }
	  else {
	  	console.log(error);
	  }
	});
});

app.get("/previousSong", function(req, res){
	//bose code
	res.send("previousSong");
	console.log("previousSong");
	if (currentSongIndex >= 1){
		currentSongIndex--;
	} else {
		currentSongIndex = 0;
	}
	
	var options = {
	  uri: 'http://10.20.5.61:8090/select',
	  method: 'POST',
	  json: {
	    "ContentItem": { 
		     "source": "SPOTIFY", 
		     "type": "uri", 
		     "location": allParties[0].songQueue[currentSongIndex].url,  
		     "sourceAccount": "bosehack16"  
	   }
	  }
	};

	request(options, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log("yes") // Print the shortened url.
	  }
	});
});

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

http.listen(8080, function(){
	console.log("Listening on *:8080");
});
