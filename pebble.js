var UI = require('ui');
var Accel = require('ui/accel');
var Vibe = require('ui/vibe');
var ajax= require('ajax');
var x = 0,y = 0,z = 0,dX = 0,dY = 0,dZ = 0,pX = 0,pY = 0,pZ = 0;
var tapped = false;
var state = "Right";

Accel.config(100, 25, false);

var main = new UI.Card({
 title: 'DJay!',
  subtitle:'Change Music With a flick of the wrist'
});
Accel.init();
main.show();

if(tapped) {
setTimeout(function() {
	
		Accel.on('data' , function(e) {
				Accel.config(25,1,true);
				x = e.accel.x;
 				y = e.accel.y;
 				z = e.accel.z;
		});

				dX = x-pX;
				dY = y-pY;
				dZ = z-pZ;
	
// 	setTimeout(function() {
// 					console.log("X: " + dX);
// 					console.log("Y: " + dY);
// 					console.log("Z: " + dZ + "\n");
// 	}, 100);

	
  if (dX < 0 && dZ < 0) {
	main.title("Right");
  state = "Right";
	console.log("Right");
   
 }
 else if (dZ >0 &&  dX < 0) {
 main.title("Left");
 console.log('Left');
  state = "Left";
 }
 if (dY < 0 && dX < 0) {
		console.log("Up");
		 main.title("Up");
  state = "Up";
 }
		
		else if(dY > 0 && dX < 0) {
			main.title("Down");
			console.log("Down");
    state = "Down";
		}
 
 	pX = x;
	pY = y;
	pZ = z;
},10);
}




main.on('click', 'select', function(e) {
  main.title('Listening');
  Vibe.vibrate('short');
  tapped = !tapped;
  if(!tapped) {
    main.title("deeJay");
    if(state == "Right") {
       ajax({
     
   url: 'http://b406b5a9.ngrok.io/nextSong',
   method: 'get'
 });
    }
    else if(state == "Left") {
          ajax({
     
   url: 'http://b406b5a9.ngrok.io/previousSong',
   method: 'get'
 });
    }
    else if(state == "Up") {
      		 ajax({
     
    url: 'http://b406b5a9.ngrok.io/volumeUp',
   method: 'get'
 });
    }
    else if(state == "Down") {
            ajax({
     
    url: 'http://b406b5a9.ngrok.io/volumeDown',
   method: 'get'
 });
    }
  }
});

main.on('click', 'up', function(e) {
ajax({
     
    url: 'http://b406b5a9.ngrok.io/volumeUp',
   method: 'get'
 });
});

main.on('click', 'down', function(e) {
ajax({
     
    url: 'http://b406b5a9.ngrok.io/volumeDown',
   method: 'get'
 });
});
