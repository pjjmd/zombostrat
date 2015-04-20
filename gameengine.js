var food=4;
var weapon=0;
var medicine=0;
var day=0;
var time=8;
var defence=0;
var health=100;
var playerX=0;
var playerY=0;

function updatePanel(){
	$("#health").text("Health: "+health+"%");
	$("#time").text("Time: "+time+"00 hours.");
	$("#day").text("Day: "+day);
	$("#medicine").text("Medicine: "+medicine);
	$("#defence").text("Defence: "+defence);
	$("#weapons").text("Weapons: "+weapon);
	$("#food").text("Food: "+food);
}

function advanceTime(ammount){
	time+=ammount;
	if (time>20) {
		console.log("setNightMode();");
	};
	updatePanel();
};

function sleep() {
	console.log("Food: "+food);
	if (food>=3){
		food-=3;
		increaseHealth(6);
	} else {
		if (food==0){
			increaseHealth(-20);
		};
		increaseHealth(food);
		food=0;
	};
	var nightTerrors=(Math.random()*25);
	if (nightTerrors>defence){
		console.log("nightEncounter()");
	} else {
		defence-=(Math.random()*3);
	};
	day+=1;
	time=8;
	updatePanel();
};

function increaseHealth(number){
	if (health+number>100){
		health=100;
	} else {
		health=health+number;
	};
	if (health<1) {
		alert("Game Over;");
		initialize();
		recolorGrid(0,0);
	};
};

function loot(buildingX,buildingY,type){
	var distance=Math.abs(buildingX-playerX)+Math.abs(buildingY-playerY) 
	if (time+2+(distance*2)>26) {
		alert("There aren't enough hours left in the day to attempt this");
	} 
	else {
		advanceTime(2+(distance*2));
		//randomEncounter(type);
		//randomLoot(type);
	};
};

function scout(scoutX,scoutY){
	var distance=Math.abs(scoutX-playerX)+Math.abs(scoutY-playerY) 
	if (time+4+(distance*2)>26) {
		alert("There aren't enough hours left in the day to attempt this");
	} 
	else {
		advanceTime(4+(distance*2));
		fillSpaces(playerX,playerY);
	}
	updatePanel();
};

function travel(grid){
	var distance=Math.abs(grid.x-playerX)+Math.abs(grid.y-playerY);
	console.log("Distance " + distance);
	if (time+(distance*5)>26) {
		alert("There aren't enough hours left in the day to attempt this");
		} else {
		playerX=grid.x;
		playerY=grid.y;
		advanceTime(4);
		defence=0;
		if (food>15) {
			food=15;
		};
	};
	recolorGrid(playerX,playerY);
};

function randomLoot(type) {
	var randomSeed= Math.random() * (19);
	var report;
	switch (type) {
		case "church":
		switch (randomSeed) {
			case 0:
			report="You find the church mostly abandoned. It looks like the place has been ransacked already, but careful exploration reveals the remains of a food drive collection.  You grab a box stuffed with baked beans and other basics.  +10 Food ";
			food+=10;
			break;
			case 1:
			report="The church door is barricaded, but it doesn't take long for you to pry it open. It looks like a group of people tried to convert this place into a sanctuary, the smell of corpses cries of their failure as you open the door. ";
			if (weapons>5){
report+="You quickly reach down to check your weapons.  This isn't going to be easy, but hopefully there will be supplies left among the dead.  Taking a step inside reveals "
			} else
			{

			}


			break;
			case 2:
			break;
			case 3:
			break;
			case 4:
			break;
			case 5:
			break;
			case 6:
			break;
			case 7:
			break;
			case 8:
			break;
			case 9:
			break;
			case 11:
			break;
			case 12:
			break;
			case 13:
			break;
			case 14:
			break;
			case 15:
			break;
			case 16:
			break;
			case 17:
			break;
			case 18:
			break;
			case 19:
			break;
		}
		break;
		case "restaurant":
		switch (randomSeed) {
			case 0:
			break;
			case 1:
			break;
			case 2:
			break;
			case 3:
			break;
			case 4:
			break;
			case 5:
			break;
			case 6:
			break;
			case 7:
			break;
			case 8:
			break;
			case 9:
			break;
			case 11:
			break;
			case 12:
			break;
			case 13:
			break;
			case 14:
			break;
			case 15:
			break;
			case 16:
			break;
			case 17:
			break;
			case 18:
			break;
			case 19:
			break;
		}
		break;
	}
};
