var food=4;
var weapon=0;
var medicine=0;
var day=0;
var time=8;
var defence = new Array(10);
for (var i = -5; i < 6; i++) {
	defence[i] = new Array(10);
	for (var q=-5; q<6; q++){
	defence[i][q]=0;
};
};
var health=100;
var playerX=0;
var playerY=0;

function updatePanel(){
	$("#health").text("Health: "+health+"%");
	$("#time").text("Time: "+time+":00 hours.");
	$("#day").text("Day: "+day);
	$("#medicine").text("Medicine: "+medicine);
	$("#defence").text("Defence: "+defence[playerX][playerY]);
	$("#weapons").text("Weapons: "+weapon);
	$("#food").text("Food: "+food);
}

function advanceTime(ammount){
	time+=ammount;
	if (time>20) {
report("Night Falls","It's too dark outside to move around safely. You need to stay in for the night. You'll eat as much food as you can, and patch up your wounds as best as you are able. If you are lucky, the defenses you set up in this area will hold the zombies at bay.");
	};
	updatePanel();
};

function sleep() {
var result="";
	console.log("Food: "+food);
	if (food>=3){
		food-=3;
		result+="You ate your fill tonight.";
		increaseHealth(6);
	} else {
		if (food==0){
			increaseHealth(-20);
			result+="No food tonight, starvation will kill you almost as fast as a zombie.";
		}
		else {
		result+="You ran out of food tonight, you are going to be in a bad state tomorrow unless you find some quick.";
		increaseHealth(food);		
		};	
		food=0;
	};
	var nightTerrors=(Math.random()*4);
	if (nightTerrors>defence[playerX][playerY]){
		defence[playerX][playerY]=0;
		result+=" "+nightEncounter();
	} else {
		result+= " The dead were snooping around outside, they didn't get in, but they did a number on the defences I had set up.  I wonder if there are any hardware stores nearby, or maybe some schools?";
		defence[playerX][playerY]-=parseInt(Math.random()*3);
	};
	day+=1;
	time=8;
	report("Sleeping",result);
	updatePanel();
};

function nightEncounter(){
	var randomSeed= parseInt(Math.random() * (2));
	switch (randomSeed){
		case 0:
		if (weapon==0){
		food=0;
		increaseHealth(-20);
		return "Found at night, and without any weapons, the zombies make quick work disuading you of the notion that you had found a 'safe' space for the night.  You are able to scramble out at the last minute, but with only the clothes on your back.";			
		}
		else {
			if (weapon>3){
				increaseHealth(-20);
				return "A few zombies made it through tonight, but you were able to hold your own against them.  So much for a good night's sleep.";
			}
			else {
				weapon-=1;
				updatePanel();
				return "Zombies made it through your defences... of course that's not really a problem for you.  A couple quick blows allow both you, and the hordes of undead, to rest in peace for the night.";
			}
		}
default:
increaseHealth(-15);
return "A zombie made it into your area tonight, you hid quietly, hoping he wouldn't find you."
	}
}

function increaseHealth(number){
	if (health+number>100){
		health=100;
	} else {
		health=health+number;
	};
	if (health<1) {
		alert("Game over!");
	};
};

function loot(buildingX,buildingY,type,markerNum){
	var distance=Math.abs(buildingX-playerX)+Math.abs(buildingY-playerY) 
	if (time+2+(distance*2)>26) {
		alert("There aren't enough hours left in the day to attempt this");
	} 
	else {
		advanceTime(2+(distance*2));
		//randomEncounter(type);
		randomLoot(type);
		console.log("was passed" +markerNum);
deleteMarker(markerNum);
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
	};
	recolorGrid(playerX,playerY);
};

function randomLoot(type) {
	var randomSeed= parseInt(Math.random() * (2));
	var result="";

	switch (type) {
		case "restaurant":
		console.log("Here!");
			switch (randomSeed) {
			case 0:
			result+="This place hadn't been as picked through as you thought. You load up your pack with food, and head back to base.";
			food+=10;
			break;
			default:
			result+="You find a quick meal, but it's crawling with the dead, and you don't think you can salvage any more supplies.";
			food+=1;	
		}
		break;
		case "church":
		switch (randomSeed) {
			case 0:
			reesult="You find the church mostly abandoned. It looks like the place has been ransacked already, but careful exploration reveals the remains of a food drive collection.  You grab a box stuffed with baked beans and other basics.  +10 Food ";
			food+=10;
			break;
			case 1:
			report="The church door is barricaded, but it doesn't take long for you to pry it open. It looks like a group of people tried to convert this place into a sanctuary, the smell of corpses cries of their failure as you open the door. ";
			if (weapons>5){
				result+="You quickly reach down to check your weapons.  This isn't going to be easy, but hopefully there will be supplies left among the dead.  Taking a step inside reveals "
			} else
			{
				result+="An onimous feeling comes over you... maybe you should be better armed before trying to enter a place like this.";
			}
			break;	
		}
		break;
		default:
		console.log("Default");
		result+="You find basic supplies.";
		food+=1;
		weapons+=1;
	};
	report("Looting",result);
};
