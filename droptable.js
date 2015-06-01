function randomLoot(type,name) {
	var randomSeed= Math.floor(Math.random() * 10) +1;
	var result="";
	var lootmed=0;
	var lootfood=0;
	var lootsupply=0;
	if (time>18){
		result+="It was dark on your way to  "+name+", "+combatZombies(calculateStreetWalkers())+" ";
	};
	switch (type) {
		case "car":
		lootfood+=Math.floor(Math.random()*2)+1;
		lootsupply+=Math.floor(Math.random()*3);
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "You find a first aid kit in the trunk, as well as a couple bottles of water.";
			lootfood+=1;
			lootmed+=10;	
			break;
			case 4:
			result+= "The rest of the car looks barren and looted, but the trunk remains closed and locked. ";
			if (player.weapons.length>0){
				result+= "You manage to pry open the trunk and find a bounty of boards, nails and construction tools. ";
				lootsupply+=4;
			}
			else {
				result+= "Without a proper way to get the trunk open quickly, you're forced to flee before you attract too much notice. ";
			};
			break;
			case 5:
			case 6:
			result+= "The former driver of this vehicle is seatbelted in.  He's dead, but lunges at you when you aproach the vehicle. "+combatZombies(1)+" After dealing with the restrained zombie, you find he has a particularly nasty hunting knife on his belt.";
			increaseWeapons("Hunting Knife");
			break;
			case 7:
			case 8:
			case 9:
			case 10:
			result+= "The vehicle is still mobile, although it's difficult to envision taking it too far given the state of the roads.  Still, it could be helpful for defensive purposes. And there is a flat of instant noodles in the back, score!";
			lootfood+=3;
			lootsupply+=2;
		}
		break;
		case "church":
		lootmed+=Math.floor(Math.random()*2)+1;
		lootfood+=Math.floor(Math.random()*3)+1;
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "You find a boarded up building, it looks like a group of people tried to hold out here.  "
			if (mapGrid[player.x][player.y].defence<5){
				result+= "You decide to check the place out, it might be a decent place to sleep for the night.  ";
				mapGrid[player.x][player.x].defence=5;
			}
			else {
				result+= "You decide to check out the place for supplies.  ";
			};
			result+= "There is the remains of a few families here.  It looks like some sort of suicide pact. It seems as if they had run out of food and had poisoned their last meal. There is nothing of value here. ";
			break;
			case 4:
			case 5:
			result+= "You find a wide assortment of religious icons and texts, unfortunately they won't be of much use to you. However you also manage to find an old crowbar in a side room, should prove useful. ";
			increaseWeapons("Crowbar");
			break;
			case 6:
			result+= "The doors to the church are flung wide open, it seems as if it has been thoroughly looted.  While you can’t find any food or weapons, a search of what was a play room for children reveals a untouched first aid kit.  Thankful for your luck, you wheel to encounter three zombies.  ";
			lootmed+=2;
			result+=combatZombies(3);
			break;
			case 7:
			case 8:
			case 9:
			case 10:
			result+= "An apocalyptic message is scrolled on a sign outside the door.  The end times are upon us, it reminds you.  The battered down front door of the building doesn’t do much to dissuade you of this notion.  As you look inside, you can see a terribly gorey sight.  Suddenly dozens of zombies stream out.  You look down at your weapons… ";
			if (player.weapons.length>4) {
				result+="And proceed to clear the horde. "+combatZombies(12)+ " After clearing the church, you find a large cache of food and medicine that the people who died here never got a chance to use.";
				lootfood+=5;
				lootmed+=25;
			}
			else {
				result+="And decide discretion is the better part of valor."
			};
		}
		break;
		case "factory":
		lootsupply+=Math.floor(Math.random()*5)+1;
		switch(randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "The doors to this factory have been smashed open and it looks to have been looted, a quick inspection however reveals a first aid kit, looks like the looters were less than thorough in their search. ";
			lootmed+=3;
			break;
			case 4:
			result += "You find basic some heavy equipment here, as well as a few wooden pallets.  Excellent equipment for securing a defensive site!";
			lootsupply+=2;
			increaseWeapons("Hammer");
			break;
			case 5:
			case 6:
			case 7:
			result += "Fighting the undead with a hammer is a little cliche, but this location has a wide variety of tools that will help you in your battles with the undead.";
			increaseWeapons("Hammer");
			break;
			case 8:
			case 9:
			case 10:
			result+= "The site seems mostly abandoned, I guess if a place doesn’t have food or weapons, people don’t swarm to it during an apocalypse.  You make off with a giant pile of defensive supplies, off to reinforce your location.  You bring with you as much as you can carry, but half way along your trip, you attract the attention of a throng of zombies. ";
			if (player.weapons.length>0) {
				result+= "You put down the supplies momentarily, readying yourself to deal with the dead before they become more numerous. "+combatZombies(4); 
				lootsupply+=6;
			}
			else {
				result+= " Even though there aren’t many zombies now, without a weapon, you are unable to defeat them ‘safely’.  You decide to lighten your load, and simply outpace them. ";
				lootsupply+=2;
			};
		};
		break;
		case "school":
		lootfood+=Math.floor(Math.random()*3)+1;
		lootsupply+=Math.floor(Math.random()*3);
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "Class is out for the apocalypse.  Desks and chairs might not make great weapons, but they are sturdy and modular enough for some easy defensive structures.  You cart back a number of them to your base. ";
			lootsupply+=2;
			break;
			case 4:
			case 5:
			result+= "Shop class!  You quickly salvage a couple basic weapons from the location. ";
			increaseWeapons();
			break;
			case 6:
			case 7:
			result+= "Art supplies!  Whoever said you shouldn’t run with scissors clearly hadn’t survived the zombie apocalypse. You gain makeshift weapons and defensive supplies."
			increaseWeapons("Scissors");
			lootsupply+=2;
			break;
			case 8:
			case 9:
			case 10:
			result+= "The cafeteria has been thoroughly ransacked, but there is a snack machine on the second floor just begging to get smashed and share a wealth of chocolate bars with you. ";
			if (player.weapons.length>0){
				result+= " You smash the glass and make off like a champion. ";
				lootfood+=4;
			} else {
				result += " You take a few minutes to look around the location for something heavy enough to smash the window.  Failing to find anything obvious, you knock the machine over.  The loud smash attracts a few zombies, who you have to deal with before looting the machine. ";
				result+=combatZombies(2);
				lootfood+=4;
			};
		};
		break;
		case "restaurant":
		lootfood+=Math.floor(Math.random()*4)+2;
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "This place is pretty picked over, all the food is spoiled or missing.  That being said, it looks like the chef’s tools are still intact.  You try to decide between the solid metal frying pans, or the well maintained butcher’s cleaver. Practicality wins over shlap stick. ";
			increaseWeapons("Cleaver");
			break;
			case 4:
			case 5:
			case 6:
			case 7:
			result+= "This joint was never this busy when it was open, it’s crawling with the dead.  Hoping that means it hasn’t been looted, you try to lure most of the dead away.  You end up having to fight a few.  "+combatZombies(4)+ " You finding a well stocked kitchen!  Enough food for days! ";
			lootfood+=8;
			break;
			case 8:
			case 9:
			case 10:
			result+= "While this place is devoid of zombies, a terrible smell is coming from the kitchen.  Fearing the worst, you open the door, only to find piles of rotten food.  You hold your breath, and are able to grab a few things. ";
			lootfood+=1;
		};
		break;
		case "bar":
		lootmed+=Math.floor(Math.random()*3);
		lootfood+=Math.floor(Math.random()*3)+1;
		lootsupply+=Math.floor(Math.random()*2);
		switch (randomSeed){
			case 1:
			case 2:
			result+= "The front of the club is barricaded. Looks like a few people thought it was a good idea to grab a few pints and wait for this all to blow over.  You knock on the door, but don’t hear anything coming from the inside. ";
			if (player.weapons>1 && mapGrid[player.x][player.y].defence<5){
				result+= "You climb up to a poorly boarded up window, and bash it in.  Inside you find 2 zombies who must have eaten the rest of the hold outs. "+combatZombies(2)+ " A couple of weapons, and a flat of beans.  And all the booze you can drink. ";
				lootfood+=4;
				increaseWeapons();
				mapGrid[player.x][player.y].defence=5;
			}
			else {
				result+= " You look around for a chance to get inside, but can’t find any easy way in.  A herd of zombies find you, and you decide to leave instead of fighting for a chance to get in. ";
			};
			break;
			case 3:
			case 4:
			result+= "The kitchen has been looted, and an investigation of the store room finds a pair of people who drank themselves to death. You do find a baseball bat behind the bar tho, so it’s not a total loss. ";
			increaseWeapons("Baseball Bat");
			break;
			case 5:
			case 6:
			case 7:
			result+= "The food is all spoiled, but you find a case of beer in a crawl space.  A liquid meal isn’t a terrible idea if you can find a secure enough place to pass out tonight. "
			lootfood+=2;
			break;
			case 8:
			case 9:
			case 10:
			result+= "Three zombies defend the bar.  "+combatZombies(3)+  " After defeating them, all you can find is broken bottles and spoiled food. A couple of tables can be broken down into basic defensive supplies.";
			lootsupply+=3;
		};
		break;
		case "pharmacy":
		lootmed+=Math.floor(Math.random()*5)+1;
		switch (randomSeed){
			case 1:
			case 2:
			case 3:
			result+= "It looks like this was initially a meeting space for survivors, and was overrun by the dead.  You begin to scavenge basic medical supplies, but are soon forced to abandon the salvage as zombies attack you. "+combatZombies(2);
			lootmed+=13;
			break;
			case 4:
			result+= "The main part of the pharmacy looks to have been looted, but a closer search reveals the backroom is curiously untouched. As you break the door open you see why, the pair of zombies trapped within shamble towards you. " +combatZombies(2)+ " After defeating the lot you take stock of the room; a few basic medical supplies plus enough unspoiled food for a few days. ";
			lootmed+=3;
			lootfood+=5;
			break;
			case 5:
			case 6:
			result+= "It looks like this place was hit by a few groups of looters.  The drug supply area has been thoroughly ransacked, with both high end drugs, and basic first aid supplies missing.  However, you do spot a crate of meal replacement shakes meant for the elderly.  As long as you don’t mind chocolate, this will keep you full for a week. "
			lootfood+=8;
			break;
			case 7:
			case 8:
			case 9:
			case 10:
			result+= "There are a lot of zombies here, former clients most likely.  The somewhat surreal experience of being chased by elderly zombies is disturbing.  You manage to grab some quick first aid supplies before you find yourself cornered by the remains of an elderly man with a walker. "+combatZombies(1);
			lootmed+=8;
		};
		break;
		default:
		lootmed+=Math.floor(Math.random()*3);
		lootfood+=Math.floor(Math.random()*3);
		lootsupply+=Math.floor(Math.random()*3);
		switch (randomSeed){
			case 1:
			case 2:
			result+= "You are able to find enough food for 2 days.  You also find enough zombies to make you not want to look further.  "+combatZombies(2);
			lootfood+=5;
			break;
			case 3:
			case 4:
			result+= "This shop was boarded up before the owner abandoned it. While pretty much everything of value is missing, you salvage some of the defensive materials."
			lootsupply+=3;
			break;
			case 5:
			case 6:
			case 7:
			result+= "A former survivor was overrun by walkers looting this shop, you clear the lingering dead who had been feeding slowly on his corpse. "+combatZombies(3)+ " He was carrying a couple granola bars, and a crowbar. ";
			lootfood+=2;
			increaseWeapons("Crowbar");
			break;
			case 8:
			case 9:
			case 10:
			result+= "The store is thoroughly looted, and a small fire broke out near the back.  Still a first aid kit is easy enough to salvage. ";
			lootmed+=10;	
		};
	};
	var lootTally="You found a total of "+lootmed+" medical supplies, "+lootfood+" units of food and "+lootsupply+" defence supply units";
	result+= ""+lootTally;
	report("Looting "+name,result);
	player.food+=lootfood;
	player.med+=lootmed;
	player.defenceSupply+=lootsupply;
};