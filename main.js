var map;
var infowindow;
var markers=[];
var geocoder;
var myLatlng;
var mapGrid = new Array(10);
for (var i = -5; i < 6; i++) {
	mapGrid[i] = new Array(10);
	for (var q=-5; q<6; q++){
		mapGrid[i][q]={rect:"",defenceMarker:"start",markers:[],population:"sparse"};
	};
};
var movementButtons=[];

function initialize() {
	geocoder = new google.maps.Geocoder();
	codeAddress(prompt("Please enter your starting location", "52 Broadview Avenue, Toronto, Ontario"));	
};

function codeAddress(address) {
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			myLatlng= results[0].geometry.location;
			var mapOptions = {
				zoom: 15,
				center: myLatlng
			};

			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			map.setCenter(results[0].geometry.location);
			createGraph();
			recolorGrid(0,0);
		updateDefence(0,0,4);
	populateGrid(0,0);
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		};
	});

	updatePanel();
};

function createGrid(location,x,y){
	mapGrid[x][y].rect= new google.maps.Rectangle({
		strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.35,
		map: map,
		clickable:false,
		bounds: new google.maps.LatLngBounds(
			offsetLatLng(location,-500,-500),
			offsetLatLng(location,500,500))
	});
};

function offsetLatLng(latLng,north,east){
 //Position, decimal degrees
 var oLat = latLng.lat();
 var oLng = latLng.lng();

 //Coordinate offsets in radians
 var dLat = north/6378137;
 var dLon = east/(6378137*Math.cos(Math.PI*oLat/180));

 //OffsetPosition, decimal degrees
 var latO = oLat + dLat * 180/Math.PI;
 var lonO = oLng + dLon * 180/Math.PI;

 var result=new google.maps.LatLng(latO, lonO);
 return result;
};

function createGraph(){
	for (var gridX=-5;gridX<6;gridX++){
		for (var gridY=-5;gridY<6;gridY++){
			createGrid(offsetLatLng(myLatlng,gridX*1000,gridY*1000),gridX,gridY);
		};
	};
};

function createMovementButton(location,x123,y123){
	movementButtons.push(new google.maps.Rectangle({
		strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.35,
		map: map,
		bounds: new google.maps.LatLngBounds(
			offsetLatLng(location,-100,-100),
			offsetLatLng(location,100,100))
	}));	
	google.maps.event.addListener(movementButtons[(movementButtons.length-1)],'mousedown',function() {travel({x:x123,y:y123})});
};

function clearMovementButtons() {
	while (movementButtons.length>0) {
		var temp=movementButtons.pop();
		temp.setMap(null);
	};
};

function recolorGrid(locationX,locationY){
	clearMovementButtons();
	for (var gridX=-5;gridX<6;gridX++){
		for (var gridY=-5;gridY<6;gridY++){
			mapGrid[gridX][gridY].rect.setOptions({fillColor:'red'});
		};
	};
	for (var gridX=-1;gridX<2;gridX++) {
		for (var gridY=-1;gridY<2;gridY++){
			var flag=false;
			var closeX=locationX+gridX;
			var closeY=locationY+gridY;
			if (closeX>5){
				flag=true;
				closeX=5;
			};
			if (closeY>5){
				flag=true;
				closeY=5;
			};
			if (closeX<-5){
				flag=true;
				closeX=-5;
			};
			if (closeY<-5){
				closeY=-5;
				flag=true;
			};
			if (gridX==0&&gridY==0){
				flag=true;
			}
			if (flag==false){
				mapGrid[closeX][closeY].rect.setOptions({fillColor:'yellow'});
				createMovementButton(offsetLatLng(myLatlng,closeX*1000,closeY*1000),closeX,closeY);
			};
		};
	};
	mapGrid[locationX][locationY].rect.setOptions({fillColor:'green'});
	map.setCenter(offsetLatLng(myLatlng,locationX*1000,locationY*1000));
};
function populateGrid(cX,cY){
	console.log(cX+" "+cY);
	infowindow = new google.maps.InfoWindow();
	var request = {
		bounds:mapGrid[cX][cY].rect.getBounds(),
		types: ['school','pharmacy','hospital','factory','church','store','restaurant']
	};
	var service = new google.maps.places.PlacesService(map);
	playerX=cX;
	playerY=cY;
	console.log(playerY);
	service.nearbySearch(request, callback);
};

function callback(results, status) {
	var randomSeed= parseInt(Math.random() * (4))+4;
		if (status == google.maps.places.PlacesServiceStatus.OK) {
		console.log("Results length: "+results.length);
		if (results.length<5){
			mapGrid[playerX][playerY].population="sparse";
addFakeResult("car");
		}
		else {
			if (results.lenght<19){
				mapGrid[playerX][playerY].population="medium";	
			}	

			else {
				mapGrid[playerX][playerY].population="dense";
			};
		};
		travelCallBack(playerX,playerY)
		if (randomSeed>results.length){
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			};
		}
		else {
			var randomResults=[];
			var randIsUnique=true;
			var randomNum=0;
			while (randomResults.length<randomSeed){	
				randomNum=parseInt(Math.random()*results.length);
				randIsUnique=true;
				for (var i=0;i<randomResults.length;i++){
					if (randomNum===randomResults[i]) {
						randIsUnique=false;
					};
				};
				if (randIsUnique){
					randomResults.push(randomNum);
				};
			};
			for (var i = 0; i < randomResults.length; i++) {
				createMarker(results[randomResults[i]]);
			};	
		};
	};


};


function addFakeResult(type){
console.log("Adding Fake!");
var marker = new google.maps.Marker({
		position: offsetLatLng(myLatlng,playerX*1000+(300*parseInt((Math.random()*3)-1)),playerY*1000+(300*parseInt((Math.random()*3)-1))),
		icon: "png/car.png"
	});
var tempX=playerX;
var tempY=playerY;
var placeName="Abadoned Vehicle";
var mNum=mapGrid[playerX][playerY].markers.length;

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(placeName+ '<button type="button" class="btn btn-default btn-lg" onclick="loot('+tempX+','+tempY+','+"\'" + type+"\',"+mNum+','+"\'"+ placeName+"\'"+')">Loot</button>');
		infowindow.open(map, this);
	});
	mapGrid[playerX][playerY].markers.push(marker);
console.log("Length of markers after fake pushed: "+mapGrid[playerX][playerY].markers.length);
};

function destroyDefence(pX,pY){
	if (mapGrid[pX][pY].defenceMarker != "start"){
	mapGrid[pX][pY].defenceMarker.setMap(null);
mapGrid[pX][pY].defenceMarker="start";	
	};

};


function addExtraction(exX,exY){

	var marker = new google.maps.Marker({
		map: map,
		position: offsetLatLng(myLatlng,exX*1000,exY*1000),
		icon: "png/award.png"
	});


	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent("Extraction Zone"+ '<button type="button" class="btn btn-default btn-lg" onclick="escape()">Evacuate</button>');
		infowindow.open(map, this);
	});
	map.setCenter(offsetLatLng(myLatlng,locationX*1000,locationY*1000));

};

function recognizePlace(list){
	var result="shop";
	for (var i=0;i<list.length;i++){
		switch (list[i]){
			case "hardware_store":
			case "factory":
			result="factory";
			i=list.length;
			break;
			case "grocery_or_supermarket":
			case "grocery":
			result="grocery"
			i=list.length;
			break;
			case "gas_station":
			result="gas_station";
			i=list.length;
			break;
			case "cafe":
			result="cafe";
			i=list.length;
			break;
			case "doctor":
			case "hospital":
			case "pharmacy":
			result="pharmacy";
			i=list.length;
			break;
			case "food":
			case "restaurant":
			result="restaurant";
			i=list.length;
			break;
			case "school":
			case "university":
			result="school";
			i=list.length;
			break;
			case "church":
			case "synagogue":
			case "mosque":
			result="church";
			i=list.length;
			break;
			case "bar":
			case "nightclub":
			result="bar";
			i=list.length;
			break;
		};
	};
	return result;
};


function fillSpaces(mX,mY){
	if (mapGrid[mX][mY].markers.length==0){
addFakeResult("car");
addFakeResult("car");
	};
	for (var i=0;i<mapGrid[mX][mY].markers.length;i++){
		mapGrid[mX][mY].markers[i].setMap(map);
	};
};

function deleteMarker(mX,mY,x){
	mapGrid[mX][mY].markers[x].setMap(null);
};

google.maps.event.addDomListener(window, 'load', initialize);

function report(title,message){
	console.log("Report!");
	$(".log").prepend('<div class="up"><h3>'+title+'</h3><p>'+message+'</p></div>');
	updatePanel();
};

function updateDefence(pX,pY,def){
	destroyDefence(pX,pY);
	if (def!=0){
		var marker = new google.maps.Marker({
			map: map,
			position: offsetLatLng(myLatlng,pX*1000,pY*1000),
			icon: "png/fort.png"
		});
infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent("Home Base, Defense Level: "+def+ '<button type="button" class="btn btn-default btn-lg" onclick="baseSleep('+pX+','+pY+')">Sleep</button>');
			infowindow.open(map, this);
		});
		mapGrid[pX][pY].defenceMarker = marker;
	};
};

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var type=recognizePlace(place.types);
	var placeName=place.name;
	placeName=placeName.replace(/["']/g, "");
	var mNum=mapGrid[playerX][playerY].markers.length;
	var marker = new google.maps.Marker({
		position: place.geometry.location,
		icon: "png/"+type+".png"
	});
var tempX=playerX;
var tempY=playerY;

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name+ '<button type="button" class="btn btn-default btn-lg" onclick="loot('+tempX+','+tempY+','+"\'" + type+"\',"+mNum+','+"\'"+ placeName+"\'"+')">Loot</button>');
		infowindow.open(map, this);
	});

	mapGrid[playerX][playerY].markers.push(marker);
};
