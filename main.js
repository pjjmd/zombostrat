var gameDetails= {
};
//the default size of the play grid
var gridSize = 10;
//the day the game is currently on
var day = 0;
//the time of day the game is currently at, 24 hour clock
var time = 8;

//Collection of variables to track the xy grid co-ords of the extraction point
var extraction = "";
var exX = 0;
var exY = 0;

//popup countdown
var countdown="";

//Variables for interacting with the google map api
//variable that will hold the map
var map;
// variable that info windows are created in
var infowindow;
//the array that holds the markers on the map, (each one has an info windo attached to it)
var markers = [];
//a placeholder variable that helps calculate the starting location via google maps geolocation call
var geocoder;
//the variable that holds the center of the map in google map API latlng form
var myLatlng;

//the map grid array creates an object to hold details for each grid space on the array
var mapGrid = new Array(gridSize);
//if gridsize is 10, than this loop goes from -5 to 5
for (var i = -.5*gridSize; i < .5*gridSize+1; i++) {
	mapGrid[i] = new Array(gridSize);
//it then creates a second array for each of the first, so that there is effectively a 2d grid
	for (var q = -5; q < 6; q++) {
//every mapgrid object gets a bunch of variables, they are all held in an object
		mapGrid[i][q] = {
			//rect holds the google api pointer for the shape
			rect: "",
			//what the built up defence is in a given area
			defence: 0,
			//if the map grid has been scouted
			scouted: false,
			density: "sparse",
			defenceMarker: "start",
			markers: [],
			population: "sparse"
		};
	};
};
//an array to hold the 4 buttons to move the character screen
var movementButtons = [];


//Sets up the initial defence of the first sector
mapGrid[0][0].defence = 4;

//the player object tracks all the stats relevent to the player
var player={
food : 4,
weapons : [],
med : 0,
defenceSupply : 2,
health : 100,
x : 0,
y : 0,
strength:1,
constitution:1,
dexterity:1,
wisdom:1,
intelegence:1,
charisma:1
};
player.weapons.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

function dimLights(){
	$("body").css("background-color","black");
};

function undimLights(){
	$("body").css("background-color","#232C31");
};

function initialize(location) {
	geocoder = new google.maps.Geocoder();
	if (location===""){
	codeAddress("52 Broadview Avenue, Toronto, Ontario");	
	}
	else {
		codeAddress(location);
	};

	
};

function codeAddress(address) {
	var stylesArray = [{
		"featureType": "transit",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"featureType": "poi",
		"stylers": [{
			"visibility": "off"
		}]
	}, {
		"stylers": [{
			"invert_lightness": true
		}]
	}, {
		"featureType": "water",
		"elementType": "labels",
		"stylers": [{
			"color": "#7a8080"
		}, {
			"visibility": "off"
		}]
	}, {
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [{
			"color": "#000000"
		}]
	}, {
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [{
			"color": "#778379"
		}]
	}, {
		"featureType": "landscape.natural",
		"elementType": "geometry.fill",
		"stylers": [{
			"color": "#594827"
		}]
	}, {
		"featureType": "landscape.man_made",
		"stylers": [{
			"color": "#b4b79a"
		}]
	}, {
		"featureType": "road",
		"elementType": "geometry.fill",
		"stylers": [{
			"color": "#808080"
		}]
	}, {
		"featureType": "road",
		"elementType": "labels",
		"stylers": [{
			"visibility": "on"
		}, {
			"weight": 6.2
		}]
	}];
	geocoder.geocode({
		'address': address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			myLatlng = results[0].geometry.location;
			var mapOptions = {
				zoom: 15,
				center: myLatlng,
				styles: stylesArray
			};
			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			map.setCenter(results[0].geometry.location);
			createGraph();
			recenterGrid(0, 0);
			updateDefence(0, 0, 4);
			populateGrid(0, 0);
			showMap();
			report("Welcome to Corpseburg", "The center grid is your location, use the arrow buttons on the grid to move and the scout button to find places to loot. More zombies are out at night, so keep an eye on the clock, and find a safe place to sleep when the sun goes down.")
		}
		else {
			alert('Geocode was not successful for the following reason: ' + status);
		};
	});
	updatePanel();
};

function showMap() {
	$(".intro").css('display', 'none');
	$(".map").css('display', 'block');
	$(".overlay").css('display', 'none');
	$(".report").css('display', 'none');
updatePanel();
};

function hideMap() {
	$(".overlay").css('display', 'block');
	$(".report").css('display', 'block');
};

function createGrid(location, x, y) {
	mapGrid[x][y].rect = new google.maps.Rectangle({
		strokeColor: '#778379',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0,
		map: map,
		clickable: false,
		bounds: new google.maps.LatLngBounds(
			offsetLatLng(location, -500, -500),
			offsetLatLng(location, 500, 500))
	});
};

function healthColour() {
	var healthcolor = "";
	if (player.health > 44) {
		healthcolor = "progress-bar-warning";
	}
	else {
		healthcolor = "progress-bar-danger";
	};
	if (player.health > 69) {
		healthcolor = "progress-bar-success";
	};
	return healthcolor;
};


function updatePanel() {
	$("#health").empty();
	$("#time").text("Time: " + time + ":00 hours.");
	$("#health").append('<div class="progress-bar ' + healthColour() + '" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:' + player.health + '%">' + player.health + '% Health</div>');
	$("#day").text("Day: " + day);
	$("#medicine").text("Medicine: " + player.med);
	$("#defence").text(player.defenceSupply);
	$("#weapons").text("Weapon: "+player.weapons[0].name+" Strength: "+player.weapons[0].damage+" Durability: "+ player.weapons[0].durability+"0%");
	$("#food").text("Food: " + player.food);
	if (player.health < 1) {
		alert("Game over!");
		window.location.reload();
	};
}

function offsetLatLng(latLng, north, east) {
	//Position, decimal degrees
	var oLat = latLng.lat();
	var oLng = latLng.lng();

	//Coordinate offsets in radians
	var dLat = north / 6378137;
	var dLon = east / (6378137 * Math.cos(Math.PI * oLat / 180));

	//OffsetPosition, decimal degrees
	var latO = oLat + dLat * 180 / Math.PI;
	var lonO = oLng + dLon * 180 / Math.PI;

	var result = new google.maps.LatLng(latO, lonO);
	return result;
};

function createGraph() {
	for (var gridX = -5; gridX < 6; gridX++) {
		for (var gridY = -5; gridY < 6; gridY++) {
			createGrid(offsetLatLng(myLatlng, gridX * 1000, gridY * 1000), gridX, gridY);
		};
	};
};
function popUp(message){
	window.clearTimeout(countdown)
	$(".pop-up-message").text(message);
	$(".pop-up").css("display", "block");
	$("#map-canvas").animate({height:"70%"});
	$(".pop-up").animate({height: "20%"});
	
	countdown=setTimeout(function(){
			$(".pop-up").css("display", "none");
	$(".pop-up").animate({height: "0%"});
	$("#map-canvas").animate({height:"90%"});
	},4000)
}

function createArrow(location, direction, x123, y123) {
	var arrow = ""
	switch (direction) {
		case "down":
			var cords = [
				offsetLatLng(location, -200, 000),
				offsetLatLng(location, -125, 050),
				offsetLatLng(location, -125, 025),
				offsetLatLng(location, -75, 25),
				offsetLatLng(location, -75, -25),
				offsetLatLng(location, -125, -25),
				offsetLatLng(location, -125, -50)
			];
			break;
		case "right":
			var cords = [
				offsetLatLng(location, 00, 200),
				offsetLatLng(location, 50, 125),
				offsetLatLng(location, 25, 125),
				offsetLatLng(location, 25, 75),
				offsetLatLng(location, -25, 75),
				offsetLatLng(location, -25, 125),
				offsetLatLng(location, -50, 125)
			];
			break;
		case "up":
			var cords = [
				offsetLatLng(location, 200, 000),
				offsetLatLng(location, 125, 050),
				offsetLatLng(location, 125, 025),
				offsetLatLng(location, 75, 25),
				offsetLatLng(location, 75, -25),
				offsetLatLng(location, 125, -25),
				offsetLatLng(location, 125, -50)
			];
			break;
		case "left":
			var cords = [
				offsetLatLng(location, 00, -200),
				offsetLatLng(location, 50, -125),
				offsetLatLng(location, 25, -125),
				offsetLatLng(location, 25, -75),
				offsetLatLng(location, -25, -75),
				offsetLatLng(location, -25, -125),
				offsetLatLng(location, -50, -125)
			];
	};
	movementButtons.push(new google.maps.Polygon({
		paths: cords,
		strokeColor: '#994d1f',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#994d1f',
		fillOpacity: 0.65,
		map: map
	}));
	console.log("Length= " + movementButtons.length)
	google.maps.event.addListener(movementButtons[(movementButtons.length - 1)], 'mousedown', function() {
		travel({
			x: x123,
			y: y123
		})
	});
};


function clearMovementButtons() {
	while (movementButtons.length > 0) {
		var temp = movementButtons.pop();
		temp.setMap(null);
	};
};

function recenterGrid(locationX, locationY) {
	clearMovementButtons();
	player.x = locationX;
	player.y = locationY;
	if (player.y + 1 <= gridSize * .5) {
		createArrow(offsetLatLng(myLatlng, player.x * 1000, player.y * 1000 + 500), "right", player.x, player.y + 1);
	};
	if (player.y - 1 >= -1 * gridSize * .5) {
		createArrow(offsetLatLng(myLatlng, player.x * 1000, (player.y - 1) * 1000 + 500), "left", player.x, player.y - 1);;
	};
	if (player.x - 1 >= -1 * gridSize * .5) {
		createArrow(offsetLatLng(myLatlng, (player.x - 1) * 1000 + 500, player.y * 1000), "down", player.x - 1, player.y);
	};
	if (player.x + 1 <= gridSize * .5) {
		createArrow(offsetLatLng(myLatlng, (player.x + 1) * 1000 - 500, player.y * 1000), "up", player.x + 1, player.y);
	};
	map.setCenter(offsetLatLng(myLatlng, locationX * 1000, locationY * 1000));
};

function populateGrid(cX, cY) {
	infowindow = new google.maps.InfoWindow();
	var request = {
		bounds: mapGrid[cX][cY].rect.getBounds(),
		types: ['school', 'pharmacy', 'hospital', 'factory', 'church', 'store', 'restaurant']
	};
	var service = new google.maps.places.PlacesService(map);
	player.x = cX;
	player.y = cY;
	console.log("Click!");
	service.nearbySearch(request, callback);

};

function callback(results, status) {
	var randomSeed = parseInt(Math.random() * (4)) + 4;
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		if (results.length < 5) {
			mapGrid[player.x][player.y].population = "sparse";
			addFakeResult("car");
		}
		else {
			if (results.length < 19) {
				mapGrid[player.x][player.y].population = "medium";
			}

			else {
				mapGrid[player.x][player.y].population = "dense";
			};
		};
		travelCallBack(player.x, player.y)
		if (randomSeed > results.length) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			};
		}
		else {
			var randomResults = [];
			var randIsUnique = true;
			var randomNum = 0;
			while (randomResults.length < randomSeed) {
				randomNum = parseInt(Math.random() * results.length);
				randIsUnique = true;
				for (var i = 0; i < randomResults.length; i++) {
					if (randomNum === randomResults[i]) {
						randIsUnique = false;
					};
				};
				if (randIsUnique) {
					randomResults.push(randomNum);
				};
			};
			for (var i = 0; i < randomResults.length; i++) {
				createMarker(results[randomResults[i]]);
			};
		};
	}
	else {
		mapGrid[player.x][player.y].population = "sparse";
		addFakeResult("car");
		travelCallBack(player.x, player.y)
	};

};


function addFakeResult(type) {
	var marker = new google.maps.Marker({
		position: offsetLatLng(myLatlng, player.x * 1000 + (300 * parseInt((Math.random() * 3) - 1)), player.y * 1000 + (300 * parseInt((Math.random() * 3) - 1))),
		icon: "png/car.png"
	});
	var tempX = player.x;
	var tempY = player.y;
	var placeName = "Abadoned Vehicle";
	var mNum = mapGrid[player.x][player.y].markers.length;

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(placeName + '<button type="button" class="btn btn-default btn-lg" onclick="loot(' + tempX + ',' + tempY + ',' + "\'" + type + "\'," + mNum + ',' + "\'" + placeName + "\'" + ')">Loot</button>');
		infowindow.open(map, this);
	});
	mapGrid[player.x][player.y].markers.push(marker);

};

function destroyDefence(pX, pY) {
	if (mapGrid[pX][pY].defenceMarker != "start") {
		mapGrid[pX][pY].defenceMarker.setMap(null);
		mapGrid[pX][pY].defenceMarker = "start";
	};

};


function addExtraction(exX, exY) {

	var marker = new google.maps.Marker({
		map: map,
		position: offsetLatLng(myLatlng, exX * 1000, exY * 1000),
		icon: "png/award.png"
	});


	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent("Extraction Zone" + '<button type="button" class="btn btn-default btn-lg" onclick="escapeGame()">Evacuate</button>');
		infowindow.open(map, this);
	});
	map.setCenter(offsetLatLng(myLatlng, locationX * 1000, locationY * 1000));

};

function recognizePlace(list) {
	var result = "shop";
	for (var i = 0; i < list.length; i++) {
		switch (list[i]) {
			case "hardware_store":
			case "factory":
				result = "factory";
				i = list.length;
				break;
			case "grocery_or_supermarket":
			case "grocery":
				result = "grocery"
				i = list.length;
				break;
			case "gas_station":
				result = "gas_station";
				i = list.length;
				break;
			case "cafe":
				result = "cafe";
				i = list.length;
				break;
			case "doctor":
			case "hospital":
			case "pharmacy":
				result = "pharmacy";
				i = list.length;
				break;
			case "food":
			case "restaurant":
				result = "restaurant";
				i = list.length;
				break;
			case "school":
			case "university":
				result = "school";
				i = list.length;
				break;
			case "church":
			case "synagogue":
			case "mosque":
				result = "church";
				i = list.length;
				break;
			case "bar":
			case "nightclub":
				result = "bar";
				i = list.length;
				break;
		};
	};
	return result;
};


function fillSpaces(mX, mY) {
	if (mapGrid[mX][mY].markers.length == 0) {
		addFakeResult("car");
		addFakeResult("car");
	};
	for (var i = 0; i < mapGrid[mX][mY].markers.length; i++) {
		mapGrid[mX][mY].markers[i].setMap(map);
	};
};

function deleteMarker(mX, mY, x) {
	mapGrid[mX][mY].markers[x].setMap(null);
};

function report(title, message) {
	$(".report-title").text(title);
	$(".report-message").text(message);
	$(".weapon-form").css("display","none");
	$(".weapon-confirm").css("display","none");
	hideMap();
	updatePanel();
};

function weaponMenu(){
	$(".report-title").text("Weapon Equip");
	$(".report-message").text("Select the weapon you want to equip");
	hideMap();
	$(".weapon-form").css("display","block");
	$(".weapon-confirm").css("display","block");
	$(".normal-confirm").css("display","none");
var attach='<form><select id="weapon">';
for (var i=0; i<player.weapons.length;i++){
	attach+='<option value="'+i+'">'+player.weapons[i].name+'</option>';
};
attach+='</select></form>'
$(".weapon-form").empty();
$(".weapon-form").append(attach);
};

function updateDefence(pX, pY, def) {
	destroyDefence(pX, pY);
	if (def != 0) {
		var marker = new google.maps.Marker({
			map: map,
			position: offsetLatLng(myLatlng, pX * 1000, pY * 1000),
			icon: "png/fort.png"
		});
		infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent("Home Base, Defense Level: " + def + '<button type="button" class="btn btn-default btn-lg" onclick="baseSleep(' + pX + ',' + pY + ')">Sleep</button>');
			infowindow.open(map, this);
		});
		mapGrid[pX][pY].defenceMarker = marker;
	};
};

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var type = recognizePlace(place.types);
	var placeName = place.name;
	placeName = placeName.replace(/["']/g, "");
	var mNum = mapGrid[player.x][player.y].markers.length;
	var marker = new google.maps.Marker({
		position: place.geometry.location,
		icon: "png/" + type + ".png"
	});
	var tempX = player.x;
	var tempY = player.y;

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name + '<button type="button" class="btn btn-default btn-lg" onclick="loot(' + tempX + ',' + tempY + ',' + "\'" + type + "\'," + mNum + ',' + "\'" + placeName + "\'" + ')">Loot</button>');
		infowindow.open(map, this);
	});

	mapGrid[player.x][player.y].markers.push(marker);
};
