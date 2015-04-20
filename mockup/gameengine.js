var food=4;
var weapon=0;
var medicine=0;
var day=0;
var time=8;
var defence=0;
var health=100;
var location={x:0,y:0};

function advanceTime(ammount){
	time+=ammount;
	if (time>20) {
		setNightMode();
	};
};

function sleep(){
	if (food>=3){
		food-=3;
		increaseHealth(6);
	} else {
		if (food==0){
			increaseHealth(-6);
		};
		increaseHealth(food);
		food=0;
	};
	var nightTerrors=(Math.random()*25).toInt();
	if (nightTerrors>defence)
		nightEncounter();}
	else{
		defence-=(Math.random()*3).toInt();
	};
};

funciton increaseHealth(number){
	if health+number>100{
		health=100;
	} else {health=health+number;};
	if (health==0) {
		gameOver();
	};
};

function loot(building){
	var distance=Math.abs(building.location.x-location.x)+Math.abs(building.location.y-location.y) 
	if (time+2+(distance*2)>26) {
		alert("There aren't enough hours left in the day to attempt this");
	} else {
		advanceTime(2+(distance*2));
		randomEncounter(building.type);
		randomLoot(building.type);
	};
};

function scout(grid){
	var distance=Math.abs(grid.x-location.x)+Math.abs(grid.y-location.y) 
	if (time+4+(distance*2)>26) {
		alert("There aren't enough hours left in the day to attempt this");
	} else {
		advanceTime(4+(distance*2));
		addMarkers(grid);
	}
};

function travel(grid){
var distance=Math.abs(grid.x-location.x)+Math.abs(grid.y-location.y) 
	if (time+(distance*5)>26) {
		alert("There aren't enough hours left in the day to attempt this");
	} else {
	location.x=grid.x;
	location.y=grid.y;
	advanceTime(4);
	defence=0;
	if (food>15) {
		food=15;
		};
	};
};
