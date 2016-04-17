var directory="zstrat";

var gameDetails= {
};
var motd=["Strength lowers the amount of damage you take from encountering zombies.","Wisdom lowers the amount of random encounters you receive.","Constitution increases the amount you heal naturally each night.","Intelligence increases the effectiveness of medicine.","Dexterity decreases the amount of zombies you encounter randomly.","A fortress of level 5 or higher cannot be destroyed in a single night.","Consider supporting future development on Patreon.","Dying is fun","Yes, zombies can swim.","Try different starting locations.","Is one of the translations wrong? Let me know the correction!","Some weapons are more fragile that others. Guns loose durability faster than anything else."];
var messages=["Click on 'scout' to find buildings to loot","Be sure to sleep once it gets dark",""];
//the default size of the play grid
var gridSize = 10;
var repopulating=true;
//the day the game is currently on
var day = 0;
//the time of day the game is currently at, 24 hour clock
var time = 8;

//Collection of variables to track the xy grid co-ords of the extraction point
var extraction = "";
var exX = 0;
var exY = 0;
var lootKeyword="Loot";

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
			population: "sparse",
			visited:false
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
	foodKeyword:"Meals",
	weapons : [],
	med : 0,
	medicineKeyword:"Meds",
	defenceSupply : 2,
	defenceKeyword:"Defense Supplies",
	health : 100,
	x : 0,
	y : 0,
	strength:10,
	constitution:10,
	dexterity:10,
	wisdom:10,
	intelligence:10,
	charisma:10,
	extractionOptions:[false,false,false,false,parseInt(Math.random()*4)],
	killKeyword:"Kills",
	fortificationKeyword:"Fortification Level",
	weaponKeyword:"Weapon",
	welcomeMessageTitle:"Welcome to Corpseburg",
	welcomeMessageContents:"The center grid is your location, use the arrow buttons on the grid to move and the scout button to find places to loot. More zombies are out at night, so keep an eye on the clock, and find a safe place to sleep when the sun goes down."
};

player.weapons.move = function (from, to) {
	this.splice(to, 0, this.splice(from, 1)[0]);
};

$(document).ready(function() {prepareIntroPage()});

function prepareIntroPage(){

	checkAchievements();
	updateAchievements();
	newGame();
	updatePanel();
	implementAchievements();
	showIntro();
	undimLights();
};

function translateGame(language){
	var translate=[];
	switch (language) {

		case "canada":
		translate=["Start","Close","New Game","Reset Achievements","Menu","Scout","Fortify","Sleep","Loot","Meals","Medicine","Defence Supplies","Kills","Fortification Level","Weapons","Welcome to Corpseburg","The center grid is your location, use the arrow buttons on the grid to move and the scout button to find places to loot. More zombies are out at night, so keep an eye on the clock, and find a safe place to sleep when the sun goes down.","Starting Location"];
		break;
		case "japan":
		translate=["開始","閉じる","新しいゲーム","成果を削除","メニュー","探索","防備","睡眠","収集","食事","医学","ツール","キル数","要塞の強さ","武器","へようこそ！","ヘルプについて: http://jp.automaton.am/articles/newsjp/corpseburg-is-the-zonbie-survival-game-using-google-map/","開始位置"];
		break;
		case "brasil":
		translate=["Começar","Fechar","Novo jogo","Redefinir Conquistas","Cardápio","Escoteiro","Fortalecer","Dorme","Pilhagem","Refeições","Medicina","Fontes de Defesa","Contagem de Mortos","Fortificação Nível","Arma","Bem-vindo ao Corpseburg","Para ajuda, veja: http://www.techtudo.com.br/noticias/noticia/2015/10/hack-no-google-maps-transforma-seu-bairro-em-jogo-zumbi-experimente.html","localização inicial"];
		break;
		case "germany":
		translate=["Anfang","schließen","Neues Spiel","Löschen","Menu","Löschen","Stärken","Schlafen","Plündern","Mahlzeiten","Medizin","Verteidigungsgüter","Anzahl der Tötung","Fortification Ebene","Waffen","Willkommen in Corpseburg","Hilfe hierzu finden Sie unter: http://stadt-bremerhaven.de/google-maps-hack-corpseburg-verwandelt-eure-nachbarschaft-in-ein-zombie-survival-game/","Startort"];
		break;
		case "china":
		translate=["开始","关闭","新游戏","重置成就","选项","斥候","巩固","睡觉","抢劫","餐","医学","保护工具","经验","设防等级","武器","欢迎","帮忙翻译？email-pmacdonakw@gmail.com","起始位置"];
		break;
		case "korea":
		translate=["스타트","닫다","새로운 게임","성과를 재설정","메뉴","찾아 다니다","확고히 하다","자다","약탈하다","식사","의학","방어 공급","쏴 죽임","요새 강도","무기","환영","번역에 참여하세요? email-pmacdonakw@gmail.com","시작 위치"];
		break;
		case "russia":
		translate=["Начать!","Закрыть","Новая игра","Сбросить достижения","Меню","Разведать","Баррикады","Спать","Обыскать","Еда","Аптечки","Материалы","Убито","Уровень барикад","Оружие","Приветствую!","Хотите помочь с переводом? email pmacdonakw@gmail.com","В центре сетки твоя локация, кликай по стрелкам чтобы перемещаться. используй 'Разведать' и найдешь места, где можно взять добычу. Зомби любят ночь, так что приглядывай за временем и строй барикады на ночь.", "Стартовая локация"];
	};
	$("#start").html(translate[0]);
	$("#close").html(translate[1]);
	$("#newgame").html(translate[2]);
	$("#resetachievements").html(translate[3]);
	$("#menu").html(translate[4]);
	$("#scout").html(translate[5]);
	$("#fortify").html(translate[6]);
	$("#sleep").html(translate[7]);
	lootKeyword=translate[8];
	player.mealKeyword=translate[9];
	player.medicineKeyword=translate[10];
	player.defenceKeyword=translate[11];
	player.killKeyword=translate[12];
	player.fortificationKeyword=translate[13];
	player.weaponKeyword=translate[14];
	player.welcomeMessageTitle=translate[15];
	player.welcomeMessageContents=translate[16];
	$("#startinglocation").text(translate[17]);
};

function implementAchievements(){
	for (var i=0;i<achievements.length;i++){
		if (achievements[i].completed){
			achievements[i].doThing();
		};
	};
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
			showMap();
			map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			map.setCenter(results[0].geometry.location);
			createGraph();
			recenterGrid(0, 0);
			updateDefence(0, 0, 4);
			populateGrid(0, 0);
			mapGrid[0][0].visited=true;
			report(player.welcomeMessageTitle, player.welcomeMessageContents);
			popUp("Welcome to Corpseburg");
			updateDefence(0, 0, mapGrid[player.x][player.y].defence);
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
	$(".outro").css('display','none');
	$(".displayZone").css('display','none');
	updatePanel();
};

function showIntro(){
	$(".outro").css('display','none');
	$(".map").css('display','none');
	$(".report").css('display','none');
	$(".intro").css('display','block');
	$(".overlay").css('display','none');
};
function hideMap() {
	$(".outro").css('display','none');
	$(".overlay").css('display', 'block');
	$(".report").css('display', 'block');
};
function displayOutro(){
	$(".outro").css('display','block');
	$(".map").css('display','none');
	$(".report").css('display','none');
	$(".intro").css('display','none');
	$(".overlay").css('display','none');
};

function weaponMenu(){
	weaponMenuUpdate();
	updateStats();
	displayZone();
};

function displayZone(){
	$(".displayZone").css('display','block');
	$(".map").css('display','none');
	$(".report").css('display','none');
	$(".intro").css('display','none');
	$(".overlay").css('display','none');
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

function updateStats(){
	$("#str").text(player.strength);
	$("#dex").text(player.dexterity);
	$("#con").text(player.constitution);
	$("#int").text(player.intelligence);
	$("#wis").text(player.wisdom);
};

function updatePanel() {
	$("#health").empty();
	$("#time").text(" Time: " + time + ":00 hours.");
	$("#health").append('<div class="progress-bar ' + healthColour() + '" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width:' + player.health + '%">' + player.health + '% Health</div>');
	$("#day").text("Day: " + day+" ");
	$("#fort").text(player.fortificationKeyword+": "+mapGrid[player.x][player.y].defence);
	$("#medicine").text(player.medicineKeyword+": " + player.med);
	$("#defence").text(player.defenceKeyword+": "+player.defenceSupply); 
	$("#weapons").text(player.weaponKeyword+" "+player.weapons[0].name);
	$("#food").text(player.foodKeyword+": " + player.food);
	$("#kills").text(player.killKeyword+": "+kills);
	if (player.health < 1) {
		gameOver();
	};
}

function gameOver(){

	completeAchievement("Dying is Fun");
	checkAchievements();
	updateAchievements();
	implementAchievements();
	displayOutro();
};

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
	messages.pop();
	messages.splice(0,0,message);
	$(".pop-up-message").text("--------------"+messages[0]+"------------"+messages[1]+"---------"+popUpTutorial()+"-----------"+displayStats()+"-----");
	$(".pop-up").css("display", "block");		
};

function popUpTutorial(){
	return motd[parseInt(Math.random()*motd.length)]
};

function createArrow(location, direction, x123, y123) {
	var arrow = "";
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
	service.nearbySearch(request, callback);
};


function checkExtraction() {
if (!player.extractionOptions[player.extractionOptions[4]]){
	var cX=-5;
	var cY=-5;
	switch (player.extractionOptions[4]){
		case 1:
		cX=5;
		cY=-5;
		break;
		case 2:
		cX=5;
		cY=5;
		break;
		case 3:
		cX=-5;
		cY=5;
	};
	infowindow = new google.maps.InfoWindow();
	var request = {
		bounds: mapGrid[cX][cY].rect.getBounds(),
		types: ['school', 'pharmacy', 'hospital', 'factory', 'church', 'store', 'restaurant']
	};
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, checkCallback);
};
};

function checkCallback(results,status){
player.extractionOptions[player.extractionOptions[4]]=results.length>0;
	if (results.length===0){
		player.extractionOptions[4]+=1;
		if (player.extractionOptions[4]===4){
			player.extractionOptions[4]===0;
		};
	};
};

function callback(results, status) {
	console.log(player.x,player.y);
	var randomSeed = parseInt(Math.random() * (4)) +(player.wisdom-7);
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
		travelCallBack(player.x, player.y);
		if (randomSeed > results.length) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i],player.x,player.y);
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
				createMarker(results[randomResults[i]],player.x,player.y);
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
		icon: directory+"/png/car.png"
	});
	var tempX = player.x;
	var tempY = player.y;
	var placeName = "Abadoned Vehicle";
	var mNum = mapGrid[player.x][player.y].markers.length;

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(placeName + '<button type="button" class="btn btn-default btn-lg" onclick="loot(' + tempX + ',' + tempY + ',' + "\'" + type + "\'," + mNum + ',' + "\'" + placeName + "\'" + ')">'+lootKeyword+'</button>');
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
		icon: directory+"/png/award.png"
	});


	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent("Extraction Zone" + '<button type="button" class="btn btn-default btn-lg" onclick="escapeGame()">Evacuate</button>');
		infowindow.open(map, this);
	});
	map.setCenter(offsetLatLng(myLatlng, exX * 1000, exY * 1000));

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
		console.log("filling space with marker...");
		if (mapGrid[mX][mY].markers[i]!=null){
			mapGrid[mX][mY].markers[i].setMap(map);
		}
		else{
			console.log("Marker is null");	
		};
	};
};

function deleteMarker(mX, mY, x) {
	//move the marker to a non existant map
	mapGrid[mX][mY].markers[x].setMap(null);
	//remove the marker from the list of markers on that grid space
	mapGrid[mX][mY].markers.splice(x,1);
	//insert an empty spot where that marker used to be in the list of grid spaces
	mapGrid[mX][mY].markers.splice(x,0,null);
};

function report(title, message) {
	$(".report-title").text(title);
	$(".report-message").empty();
	$(".report-message").append(message);
	$(".weapon-form").css("display","none");
	$(".weapon-confirm").css("display","none");
	hideMap();
	updatePanel();
};



function weaponMenuUpdate(){
	for (var i=0; i<player.weapons.length;i++){
		$("#w"+i+"s0").text(player.weapons[i].name);
		$("#w"+i+"s1").text("Strength: "+player.weapons[i].damage);
		$("#w"+i+"s2").text("Durability: "+player.weapons[i].durability+'%');
		$("#w"+i+"s3").css('display','inline');	
		$("#w"+i+"s4").css('display','inline');	
	};
	for (var i=player.weapons.length; i<8;i++){
		$("#w"+i+"s0").text("Empty");
		$("#w"+i+"s1").text("");
		$("#w"+i+"s2").text("");
		$("#w"+i+"s3").css('display','none');	
		$("#w"+i+"s4").css('display','none');	
	};
};


function updateDefence(pX, pY, def) {
	destroyDefence(pX, pY);
	if (def != 0) {
		var marker = new google.maps.Marker({
			map: map,
			position: offsetLatLng(myLatlng, pX * 1000, pY * 1000),
			icon: directory+"/png/fort.png"
		});
		infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent("Home Base, Defense Level: " + def + '<button type="button" class="btn btn-default btn-lg" onclick="baseSleep(' + pX + ',' + pY + ')">Sleep</button>');
			infowindow.open(map, this);
		});
		mapGrid[pX][pY].defenceMarker = marker;
	};
};

function createMarker(place,pX,pY) {
	var placeLoc = place.geometry.location;
	var type = recognizePlace(place.types);
	var placeName = place.name;
	placeName = placeName.replace(/["']/g, "");
	var mNum = mapGrid[pX][pY].markers.length;
	var marker = new google.maps.Marker({
		position: place.geometry.location,
		icon: directory+"/png/" + type + ".png"
	});
	var tempX = pX;
	var tempY = pY;

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name + '<button type="button" class="btn btn-default btn-lg" onclick="loot(' + tempX + ',' + tempY + ',' + "\'" + type + "\'," + mNum + ',' + "\'" + placeName + "\'" + ')">'+lootKeyword+'</button>');
		infowindow.open(map, this);
	});

	mapGrid[pX][pY].markers.push(marker);
};
function newGame(){
	gameDetails= {
	};
//the default size of the play grid
gridSize = 10;
//the day the game is currently on
day = 0;
//the time of day the game is currently at, 24 hour clock
time = 8;

//Collection of variables to track the xy grid co-ords of the extraction point
extraction = "";
exX = 0;
exY = 0;


//Variables for interacting with the google map api
//variable that will hold the map
map=null;
// variable that info windows are created in
infowindow="";
//the array that holds the markers on the map, (each one has an info windo attached to it)
markers = [];
//a placeholder variable that helps calculate the starting location via google maps geolocation call
geocoder="";
//the variable that holds the center of the map in google map API latlng form
myLatlng="";

//the map grid array creates an object to hold details for each grid space on the array
mapGrid = new Array(gridSize);
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
			population: "sparse",
			visited:false
		};
	};
};
//an array to hold the 4 buttons to move the character screen
movementButtons = [];

repopulating=true;
//Sets up the initial defence of the first sector
mapGrid[0][0].defence = 4;

//the player object tracks all the stats relevent to the player
player={
	food : 4,
	foodKeyword:"Meals",
	weapons : [],
	med : 0,
	medicineKeyword:"Meds",
	defenceSupply : 2,
	defenceKeyword:"Defense Supplies",
	health : 100,
	x : 0,
	y : 0,
	strength:10,
	constitution:10,
	dexterity:10,
	wisdom:10,
	intelligence:10,
	charisma:10,
	extractionOptions:[false,false,false,false,parseInt(Math.random()*4)],
	killKeyword:"Kills",
	fortificationKeyword:"Fortification Level",
	weaponKeyword:"Weapon",
	welcomeMessageTitle:"Welcome to Corpseburg",
	welcomeMessageContents:"The center grid is your location, use the arrow buttons on the grid to move and the scout button to find places to loot. More zombies are out at night, so keep an eye on the clock, and find a safe place to sleep when the sun goes down."};
	setupWeapons();

	player.weapons.move = function (from, to) {
		this.splice(to, 0, this.splice(from, 1)[0]);
	};
	messages=["Click on 'scout' to find buildings to loot","Be sure to sleep once it gets dark",""];
};

function displayStats(){
	return "Your attributes are: Str:"+player.strength+" Con:"+player.constitution+" Dex:" +player.dexterity+" Wis:"+player.wisdom+" Int:"+player.intelligence+" Cha:"+player.charisma
};