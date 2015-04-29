var food=4;
var weapons=0;
var med=0;
var day=0;
var time=8;
var extraction="";
var exX=0;
var exY=0;
var defence = new Array(10);
for (var i = -5; i < 6; i++) {
	defence[i] = new Array(10);
	for (var q=-5; q<6; q++){
		defence[i][q]=0;
	};
};
var scouted = new Array(10);
for (var i = -5; i < 6; i++) {
	scouted[i] = new Array(10);
	for (var q=-5; q<6; q++){
		scouted[i][q]=false;
	};
};
var health=100;
var playerX=0;
var playerY=0;

function updatePanel(){
	$("#health").text("Health: "+health+"%");
	$("#time").text("Time: "+time+":00 hours.");
	$("#day").text("Day: "+day);
	$("#medicine").text("Medicine: "+med);
	$("#defence").text("Defence: "+defence[playerX][playerY]);
	$("#weapons").text("Weapons: "+weapons);
	$("#food").text("Food: "+food);
}

function advanceTime(ammount){
	time+=ammount;
	if (time>20) {
		report("Night Falls","It's too dark outside to move around safely. You need to stay in for the night. You'll eat as much food as you can, and patch up your wounds as best as you are able. If you are lucky, the defences you set up in this area will hold the zombies at bay.");
	};
	updatePanel();
};

function sleep() {
	var result="";
	console.log("Food: "+food);
	if (food>=3){
		food-=3;
		result+="You ate your fill tonight, regaining 6 health.";
		increaseHealth(6);
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
	var nightTerrors=parseInt(Math.random()*4);
	if (nightTerrors>defence[playerX][playerY]){
		defence[playerX][playerY]=0;
		result+="Your defences were not enough to keep the dead out, they came in the night. "+combatZombies(parseInt(Math.random() * (10)+1));
	} else {
		result+= " The dead were snooping around outside, they didn't get in, but they did a number on the defences you had set up.  You wonder if there are any hardware stores nearby, or maybe some schools?";
		defence[playerX][playerY]-=parseInt(Math.random()*3);
		if (defence[playerX][playerY]<0){
			defence[playerX][playerY]=0;
		};
	};
	day+=1;
	time=8;
	
	report("Sleeping on Day "+day,result);
	if (day===1){
		report("Pamphlets dropped from the sky","You see a plane fly overhead, dropping hundreds of leaflets over the cityscape.  Picking one up, you read that the city is quaruntined for the next month.  Any survivors are to hold out for the next 30 days, and report to extraction point.  The military will anounce the extraction point 5 days before the quaruntine is lifted.")
	};
	if (day===24){
		calculateExtraction();
	};
	if (day===25){
		report("Pamphlets dropped from the sky","Another plane flies overhead.  It drops leaflets, informing you that the extraction zone will be in the: "+extraction+".  Report there alive in 5 days.");
	};
	if (day===30){
		addExtraction(extraction);
	};

	updatePanel();
};


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

function loot(buildingX,buildingY,type,markerNum,buildingName){
	var distance=Math.abs(buildingX-playerX)+Math.abs(buildingY-playerY) 
	if (time+2+(distance*2)>24) {
		report("Looting Failed","There aren't enough hours left in the day to attempt this");
	} 
	else {
		advanceTime(2+(distance*2));
		randomLoot(type,buildingName);
		console.log("was passed" +markerNum);
		deleteMarker(markerNum);
	};
	updatePanel();
};

function scout(scoutX,scoutY){

	if ((time+6)>24) {
		report("Scouting Failed","There aren't enough hours left in the day to attempt this.");
	} 
	else {
		if (scouted[playerX][playerY]===true) {
			report("Scouting Failed","This location has already been scouted");
		}
		else {
			report("Scouting","You've been all over the area, there are a few places you hope have some supplies.")
			advanceTime(6);
			fillSpaces(playerX,playerY);
			scouted[playerX][playerY]=true;
		};
	};
	updatePanel();
};

function travel(grid){
	var distance=Math.abs(grid.x-playerX)+Math.abs(grid.y-playerY);
	console.log("Distance " + distance);
	if (time+(distance*5)>24) {
		report("Travel Failed","There aren't enough hours left in the day to attempt this");
	} else {
		playerX=grid.x;
		playerY=grid.y;
		advanceTime(4);
	};
	recolorGrid(playerX,playerY);
};

function randomLoot(type,name) {
	var randomSeed= parseInt(Math.random() * (9)+1);
	var result="";
	switch (type) {
		case "church":
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "You find a boarded up building, it looks like a group of people tried to hold out here.  "
			if (defence[playerX][playerY]<5){
				result+= "You decide to check the place out, it might be a decent place to sleep for the night.  ";
				defence[playerX][playerY]=5;
			}
			else {
				result+= "You decide to check out the place for supplies.  ";
			};
			result+= "There is the remains of a few families here.  It looks like some sort of suicide pact. It seems as if they had run out of food and had poisoned their last meal. There is nothing of value here. ";
			break;
			case 4:
			case 5:
			case 6:
			result+= "The doors to the church are flung wide open, it seems as if it has been thoroughly looted.  While you can’t find any food or weapons, a search of what was a play room for children reveals a untouched first aid kit.  Thankful for your luck, you wheel to encounter three zombies.  ";
			med=4;
			result+=combatZombies(3);
			break;
			case 7:
			case 8:
			case 9:
			case 10:
			result+= "An apocalyptic message is scrolled on a sign outside the door.  The end times are upon us, it reminds you.  The battered down front door of the building doesn’t do much to dissuade you of this notion.  As you look inside, you can see a terribly gorey sight.  Suddenly dozens of zombies stream out.  You look down at your weapons… ";
			if (weapons>4) {
				result+="And proceed to clear the horde. "+combatZombies(12)+ " After clearing the church, you find a large cache of food and medicine that the people who died here never got a chance to use.";
				food+=5;
				med+=30;
			}
			else {
				result+="And decide discretion is the better part of valor."
			};
		}
		break;
		case "factory":
		switch(randomSeed){
			case 1:
			case 2:
			case 3:
			case 4:
			result += "You find basic some heavy equipment here, as well as a few wooden pallets.  Excellent equipment for securing a defensive site!";
			defence[playerX][playerY]+=2;
			weapons+=1;
			break;
			case 5:
			case 6:
			case 7:
			result += "Fighting the undead with a hammer is a little cliche, but this location has a wide variety of tools that will help you in your battles with the undead.";
			weapons+=1;
			case 8:
			case 9:
			case 10:
			result+= "The site seems mostly abandoned, I guess if a place doesn’t have food or weapons, people don’t swarm to it during an apocalypse.  You make off with a giant pile of defensive supplies, off to reinforce your location.  You bring with you as much as you can carry, but half way along your trip, you attract the attention of a throng of zombies. ";
			if (weapons>0) {
				result+= "You put down the supplies momentarily, readying yourself to deal with the dead before they become more numerous. "+combatZombies(4); 
				defence[playerX][playerY]+=8;
			}
			else {
				result+= " Even though there aren’t many zombies now, without a weapon, you are unable to defeat them ‘safely’.  You decide to lighten your load, and simply outpace them. ";
				defence[playerX][playerY]+=2;
			};
		};
		break;
		case "school":
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "Class is out for the apocalypse.  Desks and chairs might not make great weapons, but they are sturdy and modular enough for some easy defensive structures.  You cart back a number of them to your base. ";
			defence[playerX][playerY]+=2;
			break;
			case 4:
			case 5:
			result+= "Shop class!  You quickly salvage a couple basic weapons from the location. ";
			weapons+=1;
			break;
			case 6:
			case 7:
			result+= "Art supplies!  Whoever said you shouldn’t run with scissors clearly hadn’t survived the zombie apocalypse. "
			weapons+=1;
			break;
			case 8:
			case 9:
			case 10:
			result+= "The cafeteria has been thoroughly ransacked, but there is a snack machine on the second floor just begging to get smashed and share a wealth of chocolate bars with you. ";
			if (weapons>2){
				result+= " You smash the glass and make off like a champion. ";
				food+=5;
			} else {
				result += " You take a few minutes to look around the location for something heavy enough to smash the window.  Failing to find anything obvious, you knock the machine over.  The loud smash attracts a few zombies, who you have to deal with before looting the machine. ";
				result+=combatZombies(2);
				food+=5;
			};
		};
		break;
		case "restaurant":
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "This place is pretty picked over, all the food is spoiled or missing.  That being said, it looks like the chef’s tools are still intact.  You try to decide between the solid metal frying pans, or the well maintained butcher’s cleaver. Practicality wins over shlap stick. ";
			weapons+=1;
			break;
			case 4:
			case 5:
			case 6:
			case 7:
			result+= "This joint was never this busy when it was open, it’s crawling with the dead.  Hoping that means it hasn’t been looted, you try to lure most of the dead away.  You end up having to fight a few.  "+combatZombies(4)+ " You finding a well stocked kitchen!  Enough food for days! ";
			food+=9;
			case 8:
			case 9:
			case 10:
			result+= "While this place is devoid of zombies, a terrible smell is coming from the kitchen.  Fearing the worst, you open the door, only to find piles of rotten food.  You hold your breath, and are able to grab a few things. ";
			food+=2;
		};
		break;
		case "bar":
		switch (randomSeed){
			case 1:
			case 2:
			result+= "The front of the club is barricaded. Looks like a few people thought it was a good idea to grab a few pints and wait for this all to blow over.  You knock on the door, but don’t hear anything coming from the inside. ";
			if (weapons>1 && defence[playerX][playerY]<5){
				result+= "You climb up to a poorly boarded up window, and bash it in.  Inside you find 2 zombies who must have eaten the rest of the hold outs. "+combatZombies(2)+ " A couple of weapons, and a flat of beans.  And all the booze you can drink. ";
				food+=5;
				weapons+=1;
				defence[playerX][playerY]=5;
			}
			else {
				result+= " You look around for a chance to get inside, but can’t find any easy way in.  A herd of zombies find you, and you decide to leave instead of fighting for a chance to get in. ";
			};
			break;
			case 3:
			case 4:
			result+= "The kitchen has been looted, and an investigation of the store room indicates that a pair of people who drank themselves to death.  You do find a baseball bat behind the bar tho, so it’s not a total loss. ";
			weapons+=1;
			break;
			case 5:
			case 6:
			case 7:
			result+= "The food is all spoiled, but you find a case of beer in a crawl space.  A liquid meal isn’t a terrible idea if you can find a secure enough place to pass out tonight. "
			food+=3;
			break;
			case 8:
			case 9:
			case 10:
			result+= "Three zombies defend the bar.  "+combatZombies(3)+  " After defeating them, all you can find is broken bottles and spoiled food. ";
		};
		break;
		case "pharmacy":
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "It looks like this was initially a meeting space for survivors, and was overrun by the dead.  You begin to scavenge basic medical supplies, but are soon forced to abandon the salvage as zombies attack you. "+combatZombies(2);
			med+=15;
			break;
			case 4:
			case 5:
			case 6:
			result+= "It looks like this place was hit by a few groups of looters.  The drug supply area has been thoroughly ransacked, with both high end drugs, and basic first aid supplies missing.  However, you do spot a crate of meal replacement shakes meant for the elderly.  As long as you don’t mind chocolate, this will keep you full for a week. "
			food+=15;
			break;
			case 7:
			case 8:
			case 9:
			case 10:
			result+= "There are a lot of zombies here, former clients most likely.  The somewhat surreal experience of being chased by elderly zombies is disturbing.  You manage to grab some quick first aid supplies before you find yourself cornered by the remains of an elderly man with a walker. "+combatZombies(1);
			med+=10;
		};
		break;
		default: 
		switch (randomSeed){
			case 1:
			case 2:
			result+= "You are able to find enough food for 2 days.  You also find enough zombies to make you not want to look further.  "+combatZombies(2);
			food+=5;
			break;
			case 3:
			case 4:
			result+= "This shop was boarded up before the owner abandoned it. While pretty much everything of value is missing, you salvage some of the defensive materials. "
			defence[playerX][playerY]+=3;
			break;
			case 5:
			case 6:
			case 7:
			result+= "A former survivor was overrun by walkers looting this shop, you clear the lingering dead who had been feeding slowly on his corpse. "+combatZombies(3)+ " He was carrying a couple granola bars, and a crowbar. ";
			food+=2;
			weapons+=1;
			break;
			case 8:
			case 9:
			case 10:
			result+= "The store is thoroughly looted, and a small fire broke out near the back.  Still a first aid kit is easy enough to salvage. ";
			med+=10;	
		};
	};
	report("Looting "+name,result);
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
			damage+=parseInt(Math.random()*10);
		};
	} 
	for (var i=0;i<numZombie;i++){
		if (parseInt(Math.random()*50)<weapons){
			weapons-=1;
			weaponDegredation+=1;
		};
	};
	increaseHealth(0-damage);
	return "You defeated "+numZombie+" zombies, took "+damage+" damage, and lost "+weaponDegredation+" weapon quality.";
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
	if (playerX==exX&&playerY==exY){
		report("You win!","Thank you for playing!");
	}
	else
	{
		report("You are not in the right area.","Please move to the "+extraction);
	};
};