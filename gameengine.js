

function advanceTime(ammount){
	time+=ammount;
	if (time>18) {
	dimLights();
	};
	updatePanel();
};

function sleep() {
undimLights();
	var result="";
	if (food>=3){
		food-=3;
		result+="You ate your fill tonight, regaining 10 health.";
		increaseHealth(10);
	} else {
		if (food==0){
			increaseHealth(-20);
			result+="No food tonight, you take 20 damage, starvation will kill you almost as fast as a zombie.";
		}
		else {
			result+="You ran out of food tonight, you are going to be in a bad state tomorrow unless you find some quick.";
			increaseHealth(food);		
		};	
		food=0;
	};
	if (health<100){
		var healing=med+health;
		if (healing>=100){
			healing=100;
		};
		healing-=health;
		increaseHealth(healing);
		med-=healing;
		result+="You healed "+ healing +" damage using medicine.";
	};
	var nightTerrors=parseInt(Math.random()*6+1);
	switch (mapGrid[playerX][playerY].population){
		case "sparse":
		result+=" The were fewer zombies tonight because you slept in a sparsely populated area.";
		nightTerrors-=2;
		break;
case "medium":
		result+=" The were an average amount of zombies tonight because you slept in a medium populated area.";
		nightTerrors-=1;
		break;
		case "dense":
		result+=" The were more zombies tonight because you slept in a densely populated area.";
		break;
	}
	if (nightTerrors>mapGrid[playerX][playerY].defence){
		destroyDefence(playerX,playerY);
		result+="Your defences were not enough to keep the dead out, they came in the night. "+combatZombies(parseInt(Math.random() * (10)+5));
	} else {
		result+= " The dead were snooping around outside, they didn't get in, but they did a number on the defences you had set up.  You wonder if there are any hardware stores nearby, or maybe some schools?";
		mapGrid[playerX][playerY].defence-=parseInt(Math.random()*2+2);
		if (mapGrid[playerX][playerY].defence<0){
			mapGrid[playerX][playerY].defence=0;
		};
		updateDefence(playerX,playerY,mapGrid[playerX][playerY].defence);
	};
	day+=1;
	time=8;
	
	report("Sleeping on Day "+day,result);
	switch(day){
		case 1:
		report("Pamphlets dropped from the sky","You see a plane fly overhead, dropping hundreds of leaflets over the cityscape.  Picking one up, you read that the city is quaruntined for the next month.  Any survivors are to hold out for the next 30 days, and report to extraction point.  The military will anounce the extraction point 5 days before the quaruntine is lifted.");
		break;
		case 7:
		case 14:
		case 21:
		case 28:
		for (var i = -1*gridSize*.5; i < (mapGrid*.5)+1; i++) {
			for (var q=-1*gridSize*.5; q<(mapGrid*.5)+1; q++){
				mapGrid[i][q].scouted=false;
			};
		};
		report("The dead have shifted","Locations you have been to before are scoutable again.  Maybe you will find more places to loot.");
		break;
		case 24:
		calculateExtraction();
		break;
		case 25:
		report("Pamphlets dropped from the sky","Another plane flies overhead.  It drops leaflets, informing you that the extraction zone will be in the: "+extraction+".  Report there alive in 5 days.");
		addExtraction(exX,exY);
	};
	updatePanel();
};


function increaseHealth(number){
	if (health+number>100){
		health=100;
	} else {
		health=health+number;
	};
};


function loot(buildingX,buildingY,type,markerNum,buildingName){
	var distance=Math.abs(buildingX-playerX)+Math.abs(buildingY-playerY) 
	if (time+2+(distance*2)>24) {
		report("Looting Failed","There aren't enough hours left in the day to attempt this");
	} 
	else {
		advanceTime(2+(distance*2));
		randomLoot(type,buildingName);
		deleteMarker(buildingX,buildingY,markerNum);
	};
	updatePanel();
	updateDefence(playerX,playerY,mapGrid[playerX][playerY].defence);
};
function baseSleep(x,y){
	if (playerX==x&&playerY==y){
		sleep();
	}
	else
	{
		report("Sleep Failed","You need to be in the same square to sleep at a base.");
	};
};

function scout(scoutX,scoutY){

	if ((time+3)>24) {
		report("Scouting Failed","There aren't enough hours left in the day to attempt this.");
	} 
	else {
		if (mapGrid[playerX][playerY].scouted==true) {
			report("Scouting Failed","This location has already been scouted");
		}
		else {
			report("Scouting","You've been all over the area, there are a few places you hope have some supplies.")
			advanceTime(3);
			fillSpaces(playerX,playerY);
			mapGrid[playerX][playerY].scouted=true;
		};
	};
	updatePanel();
};

function travel(grid){
	if (time+1>23) {
		report("Travel Failed","There aren't enough hours left in the day to attempt this");
	} else {
		populateGrid(grid.x,grid.y);
		};
};

function travelCallBack(cX,cY){
	if (day==0&&time==8&&cX==0&&cY==0){
		console.log("You have started in a "+ mapGrid[0][0].population+" population zone.");
	}
	else {
		advanceTime(1);
	report("Travel","You made it, on your way you encountered zombies."+combatZombies(calculateStreetWalkers()));
	recenterGrid(cX,cY);
};
};
function calculateStreetWalkers(){
var numWalkers=parseInt(Math.random()*3+1);
if (time>20){
	numWalkers+=5;
};
if (mapGrid[playerX][playerY].population=="dense"){
	numWalkers+=2;
};
if (mapGrid[playerX][playerY].population=="sparse"){
	numWalkers-=1;
};
return numWalkers;
};


function combatZombies(numZombie){
	var weaponDegredation=0;
	var damage=0;
	for (var i=0;i<numZombie;i++){
		if (i<=weapons) {
			damage+=parseInt(Math.random()*5-1);
		}
		else
		{
			damage+=parseInt(Math.random()*2+3);
		};
	} 
	for (var i=0;i<numZombie;i++){
		if (parseInt(Math.random()*50)<weapons){
			weapons-=1;
			weaponDegredation+=1;
		};
	};
	increaseHealth(0-damage);
	return " You encountered "+numZombie+" zombies. You took "+damage+" damage, and lost "+weaponDegredation+" weapon quality defeating them.";
};

function calculateExtraction(){
	switch (parseInt(Math.random()*3)+1) {
		case 1:
		extraction="North East";
		exX=5;
		exY=5;
		break;
		case 2:
		extraction="South East";
		exX=-5;
		exY=5;
		break;
		case 3:
		extraction="South West";
		exX=-5;
		exY=-5;
		break;
		case 4:
		extraction="North West";
		exX=5;
		exY=-5;
	};
};

function escape(){
	if (playerX==exX&&playerY==exY&&day>29){
		report("You escape!","You win! I hope you enjoyed the game. Thank you for playing!");
	}
	else
	{
		report("You are not in the right area, or you are too early.","On day 30, please move to the "+extraction);
	};
};

function fortify(){
	if (time>=20){
		report("Fortifying Failed","It is too late at night to fortify.");
	}
	else {
		if (defenceSupply>0){
			defenceSupply-=1;
			mapGrid[playerX][playerY].defence+=1;
			advanceTime(2);
			report("Fortifying","You spend two hours boarding up windows and reinforcing doors.");
		}
		else {
			mapGrid[playerX][playerY].defence+=1;
			advanceTime(4);
			report("Fortifying","Without any defensive supplies to help you, you start to clear away zombies from the immediate area. Better to fight them in broad daylight."+combatZombies(calculateStreetWalkers()+3));
		};
	};
	updateDefence(playerX,playerY,mapGrid[playerX][playerY].defence);
};