function Achievement(name,description,effectText,functionArgument){
	this.name=name;
	this.completed=false;
	this.description=description;
	this.effectText=effectText;
	this.doThing=functionArgument;
};

var achievements=[];
achievements.push(new Achievement("Dying is Fun","Join the legions of the dead","+10 Starting Medicine",function() {player.med+=10}));
achievements.push(new Achievement("Hamburgler","Visit the Golden Arches.","+2 to Starting Food",function() {player.food+=2}));
achievements.push(new Achievement("Hoarder","Have 10 days of food.","+2 to Constitution",function() {player.constitution+=2}));
achievements.push(new Achievement("Zombie Puncher","Defeat 50 Zombies Barehanded","+2 to Strength",function() {player.strength+=2}));
var unarmedKills=0;
achievements.push(new Achievement("Fort Kickass","Have a 15 Defence Fort","+2 to Starting Fortress Defence",function() {mapGrid[0][0].defence+=2}));
achievements.push(new Achievement("What does the scouter say?","Scout over 9 locations","+2 to Wisdom",function() {player.wisdom+=2}));
var scouts=0;

function advanceTime(ammount){
	var tempvalue=ammount;
	if (ammount<1){
		tempvalue=1;
	};
	time+=tempvalue;
	if (time>18) {
		dimLights();
	};
	updatePanel();
};

function sleep() {
	undimLights();
	var result="";
	if (player.food>29){
		completeAchievement("Hoarder");
	}
	if (player.food>=3){
		player.food-=3;
		result+="You ate your fill tonight, regaining 10 health.";
		increaseHealth(player.constitution);
	} else {
		if (food==0){
			increaseHealth(-20);
			result+="No food tonight, you take 20 damage, starvation will kill you almost as fast as a zombie.";
		}
		else {
			result+="You ran out of food tonight, you are going to be in a bad state tomorrow unless you find some quick.";
			increaseHealth(player.food);		
		};	
		player.food=0;
	};
	if (player.health<100){
		var healing=player.med+player.health;
		if (healing>=100){
			healing=100;
		};
		healing-=player.health;
		increaseHealth(healing);
		player.med-=healing;
		result+="You healed "+ healing +" damage using medicine.";
	};
	var nightTerrors=parseInt(Math.random()*6+1);
	switch (mapGrid[player.x][player.y].population){
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
	if (nightTerrors>mapGrid[player.x][player.y].defence){
		destroyDefence(player.x,player.y);
		result+="Your defences were not enough to keep the dead out, they came in the night. "+combatZombies(parseInt(Math.random() * (10)+5));
	} else {
		result+= " The dead were snooping around outside, they didn't get in, but they did a number on the defences you had set up.  You wonder if there are any hardware stores nearby, or maybe some schools?";
		mapGrid[player.x][player.y].defence-=parseInt(Math.random()*2+2);
		if (mapGrid[player.x][player.y].defence<0){
			mapGrid[player.x][player.y].defence=0;
		};
		updateDefence(player.x,player.y,mapGrid[player.x][player.y].defence);
	};
	day+=1;
	time=8;
	
	report("Sleeping on Day "+day,result);
	switch(day) {
		case 1:
		popUp("The area is quaruntined for the next month, wait until day 25 for details.");
		break;
		case 7:
		case 14:
		case 21:
		case 28:
		for (var i = -1*gridSize*.5; i < (gridSize*.5)+1; i++) {
			for (var q=-1*gridSize*.5; q<(gridSize*.5)+1; q++){
				mapGrid[i][q].scouted=false;
			};
		};
		popUp("The dead have shifted. Maybe you will find more places to loot.");
		break;
		case 24:
		calculateExtraction();
		break;
		case 25:
		popUp("The extraction zone will be in the: "+extraction+" corner of the map.  Report there alive in 5 days.");
		addExtraction(exX,exY);
	};
	updatePanel();
};


function increaseHealth(number){
	if (player.health+number>100){
		player.health=100;
	} else {
		player.health+=number;
	};
};

function loot(buildingX,buildingY,type,markerNum,buildingName){
	var distance=Math.abs(buildingX-player.x)+Math.abs(buildingY-player.y) 
	if (time+2+(distance*2)>24) {
		report("Looting Failed","There aren't enough hours left in the day to attempt this");
	} 
	else {
		advanceTime(2+(distance*2));
		randomLoot(type,buildingName);
		deleteMarker(buildingX,buildingY,markerNum);
	};
	updatePanel();
	updateDefence(player.x,player.y,mapGrid[player.x][player.y].defence);
};
function baseSleep(x,y){
	if (player.x==x&&player.y==y){
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
		if (mapGrid[player.x][player.y].scouted==true) {
			report("Scouting Failed","This location has already been scouted");
		}
		else {
			report("Scouting","You've been all over the area, there are a few places you hope have some supplies.")
			advanceTime(Math.floor(3-((player.wisdom-10)/2)));
			fillSpaces(player.x,player.y);
			mapGrid[player.x][player.y].scouted=true;
			scouts+=1;
			if (scouts>9){
				completeAchievement("What does the scouter say?");
			}
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
	if (mapGrid[player.x][player.y].population=="dense"){
		numWalkers+=2;
	};
	if (mapGrid[player.x][player.y].population=="sparse"){
		numWalkers-=1;
	};
	return numWalkers;
};

function shuffle(array) {
	var currentindex = array.length, tempvalue, randomindex;

	while (0 !== currentindex) {
		randomindex = Math.floor(Math.random() * currentindex);
		currentindex -= 1;

		tempvalue = array[currentindex];
		array[currentindex] = array[randomindex];
		array[randomindex] = tempvalue;
	}
	return array;
};

function Weapon(name, damage, fragility){
	this.name=name;
	this.damage=damage;
	this.fragility=fragility;
	this.durability=Math.floor(10*(0.1*(Math.floor(Math.random()*7)+4)));
	this.use = function () {
		var chance = parseInt(Math.random()*100)+1;
		if (chance < this.fragility){
			this.durability-=1;
		};
		if (this.durability>1){
			return "OK";
		}
		else {
			repopulate(this.name,this.damage,this.fragility,weaponsLocker);
			destroyWeapon();
			popUp("You lost your "+this.name);
			return this.name;
		};
	};

};

function equipWeapon(number){
	player.weapons.move($( "#weapon" ).val(),0);

	$(".weapon-confirm").css("display","none");
	$(".normal-confirm").css("display","block");
	showMap();
}

function destroyWeapon(){
	player.weapons.splice(0,1);
};

function hasWeapon(targetArray,weaponName){
	var result=false;
	for (var i=0;i<targetArray.length;i++){
		if (targetArray[i].name===weaponName){
			result=true;
		};	
	};
	return result;
};

function repopulate(weaponName,weaponDamage,weaponFragility,targetArray){
	if (hasWeapon(weaponName,targetArray)){
		console.log("Duplicate Weapon Detected");
	} else {
		weaponsLocker.push(new Weapon(weaponName,weaponDamage,weaponFragility))
	};
};

player.weapons.push(new Weapon("Fists",3,0));

var weaponsLocker=[];
weaponsLocker.push(new Weapon("Hunting Knife", 5, 50));
weaponsLocker.push(new Weapon("Crowbar", 5, 40));
weaponsLocker.push(new Weapon("Hammer",4,40));
weaponsLocker.push(new Weapon("Chef's Knife", 6, 60));
weaponsLocker.push(new Weapon("Cleaver", 7, 70));
weaponsLocker.push(new Weapon("Scissors", 5, 85));
weaponsLocker.push(new Weapon("Baseball Bat",5,50));
weaponsLocker.push(new Weapon("Pistol", 10, 90));
weaponsLocker.push(new Weapon("Hatchet", 6, 60));
weaponsLocker.push(new Weapon("Fireaxe", 8, 45));
weaponsLocker.push(new Weapon("Metal Pipe", 5, 50));
weaponsLocker.push(new Weapon("Golf Club", 6, 85));

function increaseWeapons(name){
	var found=false;
	if (typeof name==='undefined'){
var tempvalue=Math.floor(Math.random()*weaponsLocker.length);
console.log(tempvalue);
player.weapons.push(weaponsLocker.splice(tempvalue, 1)[0]);
popUp("You got a "+player.weapons[(player.weapons.length-1)].name);
	}
	else {
		for (var i=0;i<weaponsLocker.length;i++){
			if (weaponsLocker[i].name===name){
				player.weapons.push(weaponsLocker.splice(i, 1)[0]);
				found=true;
				popUp("You got a "+player.weapons[(player.weapons.length-1)].name);
			};
		};
		if (!found){
			var weap = weaponsLocker[Math.floor(Math.random()*weaponsLocker.length)];
			player.weapons.push(new Weapon(name,weap.damage,weap.fragility));
			popUp("You got a "+player.weapons[(player.weapons.length-1)].name);
		};
	};
};

function combatZombies(numZombie){
	var weaponDegredation=[];
var bonus=0; //eventually a way to have harder enemies
var damage=0;
	//
	for (var i=0;i<numZombie;i++){
		var playerResult=(Math.random()*((player.strength-8)/2))+player.weapons[0].damage;
		var zombieResult=(Math.random()*6)+5+bonus;
		var fightResult=Math.floor(zombieResult-playerResult);
		console.log("Fight result: " + fightResult);
		if (fightResult>0){
			damage+=fightResult;
		};
		if (player.weapons[0].name==="Fists"){
			unarmedKills+=1;
			if (unarmedKills>49){
				completeAchievement("Zombie Puncher");
			};
		};
		var weaponResult=player.weapons[0].use();
		if (weaponResult!="OK"){
			weaponDegredation.push(weaponResult);
		};
	};
	increaseHealth(0-damage);
	

	if (damage===0&&weaponDegredation.length===0&&player.weapons.length>0){
		return "With your "+player.weapons[0].name+" you easily dispatch "+numZombie+" zombies.";
	}
	else if (weaponDegredation.length===1){
		return " You encountered "+numZombie+" zombies. You took "+damage+" damage, and lost your "+weaponDegredation[0]+"  defeating them.";	
	}
	else if (weaponDegredation.length===0 && player.weapons.length>0) {
		return " You encountered "+numZombie+" zombies. You used your "+player.weapons[0].name+" to defeat them, and you took "+damage+" damage.";
	} else if (weaponDegredation.length===0 && player.weapons.length===0)
	{
		return " You fought "+numZombie+" zombies barehanded. You took "+damage+" damage defeating them.";	
	}
	else {
		return " You fought "+numZombie+" zombies. You took "+damage+" damage, and lost "+weaponDegredation.length+" weapons defeating them.";
	};
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

function escapeGame(){
	if (player.x==exX&&player.y==exY&&day>29){
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
		if (player.defenceSupply>0){
			player.defenceSupply-=1;
			mapGrid[player.x][player.y].defence+=1;
			advanceTime(2);
			report("Fortifying","You spend two hours boarding up windows and reinforcing doors.");
		}
		else {
			mapGrid[player.x][player.y].defence+=1;
			advanceTime(4);
			report("Fortifying","Without any defensive supplies to help you, you start to clear away zombies from the immediate area. Better to fight them in broad daylight."+combatZombies(calculateStreetWalkers()+3));
		};
		if (mapGrid[player.x][player.y].defence>9){
			completeAchievement("Fort Kickass");
		};
	};
	updateDefence(player.x,player.y,mapGrid[player.x][player.y].defence);
};

function completeAchievement(name){
	for (var i=0;i<achievements.length;i++){
		if (achievements[i].name===name){
			if (!achievements[i].completed){
				achievements[i].completed=true;
				popUp("You completed the achievement "+name);
				localStorage["achievements"] = JSON.stringify(achievements);
			};
		};
	};
};

function resetAchievements(){
	for (var i=0;i<achievements.length;i++){
		achievements[i].completed=false;
	};
	localStorage["achievements"]=JSON.stringify(achievements);
	updateAchievements();
}

function checkAchievements(){
	if (localStorage.getItem("achievements") != null) {
		var tempvalue=JSON.parse(localStorage["achievements"]);
		for (var i=0;i<tempvalue.length;i++){
			if (tempvalue[i].completed){
				completeAchievement(tempvalue[i].name);
			};
		};
	};
	localStorage["achievements"] = JSON.stringify(achievements);
};

function updateAchievements(){
	$('#achievementsList').empty();
	var holder="<table style='width:100%'><tr><th>Achievement name</th><th>Description</th><th>Effect</th></tr>";
	for (var i=0;i<achievements.length;i++){
		if (achievements[i].completed){
			holder+="<tr><td>"+achievements[i].name+"</td><td>"+achievements[i].description+"</td><td>"+achievements[i].effectText+"</td></tr>";
		}
		else {
			holder+="<tr><td>"+achievements[i].name+"</td><td>Locked</td><td>"+achievements[i].effectText+"</td></tr>";
		};
	};
	holder+="</table>"
	
	$('#achievementsList').append(holder);
};

