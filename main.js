var map;
var infowindow;
var markers=[];
var geocoder;
var myLatlng;
var mapGrid = new Array(10);
for (var i = -5; i < 6; i++) {
	mapGrid[i] = new Array(10);
};
var movementButtons=[];

function initialize() {
	geocoder = new google.maps.Geocoder();
	codeAddress(prompt("Please enter your starting location", "79 Broadview Avenue, Toronto, Ontario"));	
};

function codeAddress(address) {
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			myLatlng= results[0].geometry.location;
			var mapOptions = {
				zoom: 14,
				center: myLatlng
			};

			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
			createGraph();
			recolorGrid(0,0);
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		};
	});
updatePanel();
};

function createGrid(location,x,y){
	mapGrid[x][y]= new google.maps.Rectangle({
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
			mapGrid[gridX][gridY].setOptions({fillColor:'red'});
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
				mapGrid[closeX][closeY].setOptions({fillColor:'yellow'});
				createMovementButton(offsetLatLng(myLatlng,closeX*1000,closeY*1000),closeX,closeY);
			};
		};
	};
	mapGrid[locationX][locationY].setOptions({fillColor:'green'});
};
function fillSpaces(closeX,closeY){
	infowindow = new google.maps.InfoWindow();
	var request = {
		bounds:mapGrid[closeX][closeY].getBounds(),
    types: ['store','restaurant']
  };
var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);

}
function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  var markerX=playerX;
  var markerY=playerY;
  var mNum=markers.length;

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name+ '<button type="button" class="btn btn-default btn-lg" onclick="loot('+markerX+','+markerY+','+"\'" + place.types[0]+"\',"+mNum+')">Loot</button>');
    infowindow.open(map, this);
  });
  markers.push(marker);
console.log("Marker Number: "+markers.length);
};

function recognizePlace(list){
var result="store";
for (var i=0;i<list.length;i++){
switch (list[i]){
	case "hardware_store":
	case "factory":
	result="factory";
	i=list.length;
	break;
	case "grocery_or_supermarket"
case "grocery"
	result="grocery"
	i=list.length;
	break;
case "gas_station"
	result="gas_station";
	i=list.length;
	break;
case "cafe"
	result="cafe";
	i=list.length;
	break;
case "doctor"
case "hospital"
case "pharmacy"
	result="pharmacy";
	i=list.length;
	break;
case "food"
case "restaurant":
	result="restaurant";
	i=list.length;
	break;
case "school"
case "university"
	result="school";
	i=list.length;
	break;
case "church":
case "synagogue"
case "mosque"
	result="church";
	i=list.length;
	break;
case "bar"
case "nightclub"
	result="bar";
	i=list.length;
	break;
}
}

}

function deleteMarker(x){
	markers[x].setMap(null);
};

google.maps.event.addDomListener(window, 'load', initialize);

function report(title,message){
	console.log("Report!");
	$(".log").prepend('<div class="up"><h3>'+title+'</h3><p>'+message+'</p></div>');
};