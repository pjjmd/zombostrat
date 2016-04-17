function isShopType(shopName,typeArray){
	var isType=false;
	for (var i=0;i<typeArray.length;i++){
		if (shopName.toLowerCase().indexOf(typeArray[i].toLowerCase())>-1){
			isType=true;
		};
	};
	return isType;
};

function randomLoot(type,name) {
	var shopType=type;
//if (isShopType(name,["",""])){
//};

if (isShopType(name,["McDonalds","McCafe"])){
	completeAchievement("Hamburgler");
};

if (isShopType(name,["gun","hunting","arms","ammo"])){
	if (type!="bar"){
		shopType="gun";
	};
};

var randomSeed= Math.floor(Math.random() * 10) +1;
var result="";
var lootmed=0;
var bonus="";
var lootfood=0;
var lootsupply=0;
if (time>18){
	result+="It was dark on your way to  "+name+", "+combatZombies(calculateStreetWalkers()+1)+" ";
}
else if ((Math.random()*(player.wisdom-5))<2){
	result+="Random Encounter. "+combatZombies(calculateStreetWalkers()-(player.wisdom-10))+" "; 
};
switch (shopType) {
	case "car":
	lootfood+=Math.floor(Math.random()*2)+1;
	lootsupply+=Math.floor(Math.random()*3);
	switch (randomSeed){
		case 1:
		result+="You find a burned out shell. You try to salvage what you can, but it's slim pickings.";
		break;
		case 2:
		result+="A three car pileup. Two of the cars are total writeoffs, but the last one is pretty much still intact. You have to deal with the zombie stuck inside. "+combatZombies(1)+" You quickly search the car, and find a heavy flashlight you can use as a club, a moldy lunch box, and a bottle of pain killers.";
		lootmed+=5;
		bonus+="You found 1 new "+player.weaponKeyword;
		increaseWeapons("Flashlight");
		break;
		case 3:
		result+= "You find a first aid kit in the trunk, as well as a couple bottles of water.";
		lootfood+=1;
		lootmed+=5;	
		break;
		case 4:
		result+= "The rest of the car looks barren and looted, but the trunk remains closed and locked. There is a sizeable group of zombies not too far from here. ";
		if (player.weapons.length>1){
			result+= "You manage to pry open the trunk and find a bounty of boards, nails and construction tools. ";
			lootsupply+=2;
		}
		else {
			result+= "Without a proper way to get the trunk open quickly, you're forced to flee before you attract too much notice. ";
		};
		break;
		case 5:
		result+="A tipped over mail truck. You quickly scavange the insides, looking for something of use.  You can't find any food or decent weapons, but you do find a couple of people who were having perscription medication shipped to them.";
		lootmed+=5;
		break;
		case 6:
		result+= "The former driver of this vehicle is seatbelted in.  He's dead, but lunges at you when you approach the vehicle. "+combatZombies(1)+" After dealing with the restrained zombie, you find he has a particularly nasty hunting knife on his belt.";
		increaseWeapons("Hunting Knife");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 7:
		result+="It's a working bicycle, you can use this to get around much faster!";
		bonus+="Your dexterity is increased by 1.";
		player.dexterity+=1;
		break;
		case 8:
		result+= "You come across an abandoned police car, a search doesn't amount to much save for some bandages in the glove compartment, but the trunk is still locked. ";
		lootmed+=2;
		if (player.weapons.length>1){
			result+= "It takes some time and makes quite a bit of noise, attracting a couple of zombies from nearby. "+combatZombies(2)+" Once they're dealt with you finish prying the trunk open and find a pistol with some bullets. Hard to argue with that kind of firepower.";
			increaseWeapons("Pistol");
			bonus+="You found 1 new "+player.weaponKeyword;
		}
		else {
			result+= "You struggle and bash at the trunk with your hands, but it seems to be attracting too much attention, better get out before the zombies find you.";
		}
		break;
		case 9:
		result+="You come across a crashed motorcycle. The rider's lifeless body is smeared across the pavement. There isn't much to salvage here, but at the last minute you spot a heavy chain the rider must have used as a weapon. It might not be much better than fists, but it's unlikely to break.";
		bonus+="You found 1 new "+player.weaponKeyword;
		increaseWeapons("Chain");
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
		result+="You find a large box of canned food that was being collected 'for the less fortunate'. Under normal circumstances, you might have had second thoughts stealing from charity, but given the current circumstances...";
		lootfood+=8;
		break;
		case 2:
		result+="You find a group of survivors. The first living people you've seen in days! They patch your wounds as best they can, and offer you respite. You can't beleive your luck. Before you can get too comfortable, you hear a groaning coming from the back room. They are keeping zombies back there!  They insist that it's just a disease, and they are waiting for the cure. You feel very uncomfortable. You thank them for their hospitality, and promise to return soon, saying something vague about 'going to go get some supplies from your home'.  You decide it's probably for the best if you don't come back.";
		increaseHealth(10);
		bonus+="You regained 10 health, and learned a little bit more about how people are 'adapting'. +1 Wisdom.";
		player.wisdom+=1;
		break;
		case 3:
		result+= "You find a boarded up building, it looks like a group of people tried to hold out here.  "
		if (mapGrid[player.x][player.y].defence<5){
			result+= "You decide to check the place out, it might be a decent place to sleep for the night. You move your base here. ";
			mapGrid[player.x][player.x].defence=5;
		}
		else {
			result+= "You decide to check out the place for supplies.  ";
		};
		result+= "There is the remains of a few families here.  It looks like some sort of suicide pact. It seems as if they had run out of food and had poisoned their last meal. There is nothing of value here. ";
		break;
		case 4:
		result+="There is almost nothing left of the place. A makeshift memorial is set up outside. You quickly scan the pile of notes, flowers and tributes looking for anything you can scavange, but in the end, decide against it. You take a moment to reflect on all that the world has lost.";
		lootmed=0;
		lootfood=0;
		bonus+="Reading the notes from other survivors gives you some insight into how others are surviving the apocalypse. +1 wisdom";
		player.wisdom+=1;
		break;
		case 5:
		result+= "You find a wide assortment of religious icons and texts, unfortunately they won't be of much use to you. However you also manage to find an old crowbar in a side room, should prove useful. ";
		increaseWeapons("Crowbar");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 6:
		result+= "The doors to the church are flung wide open, it seems as if it has been thoroughly looted.  While you can’t find any food or weapons, a search of what was a play room for children reveals a untouched first aid kit.  Thankful for your luck, you wheel to encounter three zombies.  ";
		lootmed+=4;
		result+=combatZombies(3);
		break;
		case 7:
		result+="This place is quiet... the accoustics of the place disturb you. You hear your footsteps reverberate through the place. You decide that ripping up some of the tables in a side room would make good equipment for a barricade. But as soon as the first board cracks, you hear a stampede of the dead coming from all corners. "+combatZombies(5);
		lootsupply+=4;
		break;
		case 8:
		result+= "This place seemed to have been undergoing some sort of construction or renovations. You find a wide assortment of building supplies and tools- as well as the workers they previously belonged to. "+combatZombies(3)+" After dealing with them, this cache of supplies is yours for the taking.";
		lootsupply+=4;
		break;
		case 9:
		result+="There is a small classroom where children used to study here. Tiny chairs and tiny desks make for easy to transport barricade material... until you find tiny zombies defending them! "+combatZombies(4);
		lootsupply+=4;
		bonus+="You feel a sense of dread over what you have just done. -1 Wisdom"
		player.wisdom-=1;
		break;
		case 10:
		result+= "An apocalyptic message is scrolled on a sign outside the door.  The end times are upon us, it reminds you.  The battered down front door of the building doesn’t do much to dissuade you of this notion.  As you look inside, you can see a terribly gorey sight.  Suddenly dozens of zombies stream out.  You look down at your weapons… ";
		if (player.weapons[0].damage>5) {
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
		result+= "This particular factory looks like it hasn't been occupied for a long time. Cobwebs and dust have accumulated in every nook and cranny. After searching for some time you find a metal pipe, after picking it up you quickly lose your nerve and flee. Something seems off in there.";
		increaseWeapons("Metal Pipe");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 2:
		result+="A group of survivors had made this factory an outpost. You can see makeshift barricades and debris everywhere. You can also see that the place was overrun by what must have been a particularly nasty horde. You start poking around, hoping the survivors fled, and left some supplies behind for you. After you get past the second barricade, you notice a couple of pretty clever traps rigged up with basic materials. As you inspect the trap, you accidently set it off. Taking some damage and drawing a crowd of zombies ontop of you. "+combatZombies(5);
		bonus+="You injured yourself on the trap, taking 5 damage. You gain +1 intelligence.";
		player.intelligence+=1;
		increaseHealth(-5);
		break;
		case 3:
		result+= "The doors to this factory have been smashed open and it looks to have been looted, a quick inspection however reveals a first aid kit, looks like the looters were less than thorough in their search. ";
		lootmed+=5;
		break;
		case 4:
		result += "You find basic some heavy equipment here, as well as a few wooden pallets.  Excellent equipment for securing a defensive site!";
		lootsupply+=2;
		increaseWeapons("Hammer");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 5:
		result+="Some survivors tried to make a go of it here. The place is heavily reinforced. It would be a great place to stay if it wasn't half burned down. All you find of the previous inhabitants is the remenants of the horde that must have driven them out. "+combatZombies(4)+" After facing the zombies, you find a nailgun! Awesome!";
		bonus+="You found 1 new "+player.weaponKeyword;
		increaseWeapons("Nailgun");
		lootsupply+=2;
		case 6:
		result += "Fighting the undead with a hammer is a little cliche, but this location has a wide variety of tools that will help you in your battles with the undead, as well as help set up defences around the base.";
		lootsupply+=1;
		increaseWeapons("Hammer");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 7:
		result+="Did someone say 'metal siding', because this place has piles of sheet metal. It should be easy to put this to good use.";
		lootsupply+=5;
		break;
		case 8:
		result += "Row upon row of pallets lay here unattended.  All the flimsy wood and nails you could possibly want for boarding up windows and doors, just like in the movies!"
		lootsupply+=5;
		case 9:
		result+="The place is in pretty bad shape. You start to investigate the inside, but the lack of windows and electricity means it's almost pitch black, and the moaning is enough to make you warry of going too deep. You stick to the loading dock, and find a couple of pallets to disassemble, and a couple of zombies. "+combatZombies(2);
		lootsupply+=4;
		case 10:
		result+= "The site seems mostly abandoned, You guess if a place doesn’t have food or weapons, people don’t swarm to it during an apocalypse.  You make off with a giant pile of defensive supplies, off to reinforce your location.  You bring with you as much as you can carry, but half way along your trip, you attract the attention of a throng of zombies. ";
		if (player.weapons[0].damage>4) {
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
		result+= "You find what you can only assume is the nurses office. Bandages, medicine, some clean water and a zombie nurse to boot! "+combatZombies(1)+" You rush off with your stolen bounty before more undead faculty find you.";
		lootmed+=5;
		lootfood+=1;
		break;
		case 2:
		result+= "Science lab? Awesome!";
		if (player.intelligence>11){
			result+="You find enough chemicles to make a bunch of sterilization kits, and even some basic antibiotics. Oh, and a little bit of 'fun stuff' for home defense."
			lootsupply+=2;
			lootfood=0;
			lootmed+=10;
		}
		else {
			result+="Your intelligence stat isn't high enough to get full benefit from the science lab. You get some rubber gloves and some basic rubbing alcahol for disenfecting wounds. And a couple of books about basic chemistry to study up with."
			lootfood=0;
			lootsupply=0;
			bonus+="You read a chemistry textbook, +1 intelligence";
			lootmed+=5;
			player.intelligence+=1;
		};
		break;
		case 3:
		result+= "Class is out for the apocalypse.  Desks and chairs might not make great weapons, but they are sturdy and modular enough for some easy defensive structures.  You cart back a number of them to your base. ";
		lootsupply+=2;
		break;
		case 4:
		result+="The hallways are filled with desks and tables, making moving around quite difficult. It's a total fire hazard. There are pockets of zombies stuck among the desks here and there, when they see you they slowly start to strain against the barricades. You loot one classroom quickly and then flee.";
		lootsupply+=3;
		break;
		case 5:
		result+= "Shop class!  You quickly salvage a couple basic weapons from the location. ";
		increaseWeapons("Hammer");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 6:
		result+="Janitorial supplies.  Whoever looted this school before didn't think to check the supply room.  You find a bunch of industrial strength cleaning products. Soaking old clothes in floor cleaner makes for some pretty decent bandages.";
		lootmed+=5;
		break;
		case 7:
		result+= "Art supplies!  Whoever said you shouldn’t run with scissors clearly hadn’t survived the zombie apocalypse. You gain makeshift weapons and defensive supplies.";
		increaseWeapons("Scissors");
		bonus+="You found 1 new "+player.weaponKeyword;
		lootsupply+=2;
		break;
		case 8:
		result+="This place looks like it was initially set up to be a marshalling area for an early evacuation plan. The results aren't pretty. No barricades, no choke points, the place was quickly overrun. You find a first aid kit among a pile of supplies, as well as a detailed evacuation plan. You start to examine more, but all of a sudden a wave of the dead come from further inside. "+combatZombies(7);
		lootmed+=5;
		bonus+="The evacuation plan doesn't really cover 'zombies', but it does let you know what early first responders would have been up to on day 0. +1 wisdom";
		player.wisdom+=1;
		break;
		case 9:
		result+="Upon reflection, the stalls in the bathroom are really just modular metal plates designed to be easily attachable.  With a bit of elbow grease, you liberate a few panels for base defence.";
		lootsupply+=4;
		break;
		case 10:
		result+= "The cafeteria has been thoroughly ransacked, but there is a snack machine on the second floor just begging to get smashed and share a wealth of chocolate bars with you. ";
		if (player.weapons[0].strength>4){
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
	lootfood+=Math.floor(Math.random()*4)+1;
	switch (randomSeed){
		case 1:
		result+="Tables and chairs have been strewn about,  the dining room, and there is a terrible stench coming from the kitchen.  You don't think you want to eat anything that comes out of there, but some of the tables can make a decent barricade for tonight.";
		lootsupply+=2;
		break;
		case 2:
		result+="You are absolutely amazed how much of the food in the restaurant came from cans. Given different circumstances, you would complain.";
		lootfood+=3;
		break;
		case 3:
		result+= "This place is pretty picked over, all the food is spoiled or missing.  That being said, it looks like the chef’s tools are still intact.  You try to decide between the solid metal frying pans, or the well maintained butcher’s cleaver. Practicality wins over slapstick, and you grab the knife. ";
		increaseWeapons("Cleaver");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 4:
		result+="Tables flipped over and pressed against windows, chairs stacked to clog choke points. It looks like a couple of people turned this place into a fortress as quickly as they could. You see a small area where they had set up camp, and assume it must have been a group of survivors moving through the area who just set up camp for the night. They have picked the place clean.";
		lootfood=0;
		bonus+="You learn a bit about base defense from how efficiently the place is barricaded. +1 Wisdom";
		player.wisdom+=1;
		break;
		case 5:
		result+= "The front of this restaurant is fairly covered in dismembered zombies, you tentatively edge towards the back room and find the person who appears to be responsible. Looks like he couldn't fight off all of his stores patrons, but his knife certainly looks like it could do some damage still.";
		increaseWeapons("Chef's Knife");
		bonus+="You found 1 new "+player.weaponKeyword;
		lootfood+=3;
		break;
		case 6:
		result+="You feel certain this place is going to have some food left over, which is why you are willing to risk investigating the kitchen, dispite the moaning you hear coming from the basement. It's a great idea. You find plenty of food. You also find plenty of zombies. Maybe it wasn't a great idea afterall. "+ combatZombies(5);
		lootfood+=5;
		break;
		case 7:
		result+= "This joint was never this busy when it was open, it’s crawling with the dead.  Hoping that means it hasn’t been looted, you try to lure most of the dead away.  You end up having to fight a few.  "+combatZombies(4)+ " You finding a well stocked kitchen!  Enough food for days! ";
		lootfood+=5;
		break;
		case 8:
		result+="The freezer was still cold. Fishing around the pool of half melted ice, you are able to grab a couple servings of still frozen meat. Looks like a bbq tonight!";
		lootfood+=3;
		break;
		case 9:
		result+="The kitchen looks like a disaster. Piles of rotten produce, mixed with what you think is a dead racoon? Yep. Who knew zombies ate racoons? "+combatZombies(1);
		lootfood=0;
		bonus+="It's not a total loss, you find enough instant coffee to last you the month. +1 Intelligence"
		player.intelligence+=1;
		break;
		case 10:
		result+= "While this place is devoid of zombies, a terrible smell is coming from the kitchen.  Fearing the worst, you open the door, only to find piles of rotten food.  You hold your breath, and are able to grab a few things. ";
		lootfood+=3;
	};
	break;
	case "bar":
	lootmed+=Math.floor(Math.random()*3);
	switch (randomSeed){
		case 1:
		result+="It looks like a bunch of people holed up in here and waited for this all to blow over. It didn't. You deal with the zombies who remain. "+combatZombies(4)+" One of the fallen survivors had a rifle! You have no idea where he got it from. It doesn't have much ammo, but it's something.";
		increaseWeapons("Hunting Rifle");
		bonus+="You found 1 new "+player.weaponKeyword;
		case 2:
		result+= "The front of the club is barricaded. Looks like a few people thought it was a good idea to grab a few pints and wait for this all to blow over. You knock on the door, but don’t hear anything coming from the inside. ";
		if (player.weapons.length>1 && mapGrid[player.x][player.y].defence<5){
			result+= "You climb up to a poorly boarded up window, and bash it in.  Inside you find 2 zombies who must have eaten the rest of the hold outs. "+combatZombies(2)+ " A couple of weapons, and a flat of beans.  And all the booze you can drink. ";
			lootfood+=4;
			increaseWeapons("Baseball Bat");
		}
		else {
			result+= " You look around for a chance to get inside, but can’t find any easy way in.  A herd of zombies find you, and you decide to leave instead of fighting for a chance to get in. ";
		};
		break;
		case 3:
		result+="There must have been a big crowd in here before news of the infection hit. It looks like there was a panic, and people ended up trampling each other trying to get out. It's not a pretty sight. One of the bouncers had a collapsable baton, but as you move to take it from his cold dead hands, he lurches into unlife, along with a crowd of others. "+combatZombies(3);
		increaseWeapons("Club");
		break;
		case 4:
		result+= "The kitchen has been looted, and an investigation of the store room finds a pair of people who drank themselves to death. You do find a baseball bat behind the bar though, so it’s not a total loss. ";
		increaseWeapons("Baseball Bat");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 5:
		result+="It's like the apocalypse never happened. Chairs are stacked neatly on tables, the floor is clean, everythign is well put away. The windows and doors are really well secured, but a couple of heavy (and noisy) strikes from your "+player.weapons[0].name+" and you are in. Tables and chairs make great defensive fortifications. Booze makes good disenfectant, and beer is basically liquid bread. You pat yourself on the back for being so clever. Then a wave of zombies comes, attracted by the noise of you breaking in the door."+combatZombies(8);
		lootmed+=3;
		lootfood+=3;
		lootsupply+=1;
		break;
		case 6:
		result+="Zombies crowd the bar. You probably would leave this place alone, but you notice a number of bodies on the floor with caved in skulls. You lure the more mobile zombies away, and double back. "+combatZombies(3)+" You find the remains of the owner of the establishment. You grab the 9 iron from his grasp, and promise to put it to good use."
		increaseWeapons("Golf Club");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 7:
		result+= "The food is all spoiled, but you find a case of beer in a crawl space.  A liquid meal isn’t a terrible idea if you can find a secure enough place to pass out tonight. "
		lootfood+=2;
		break;
		case 8:
		result+="A police cruiser is parked outside. You quickly peek inside the car, and see a shotgun secured near the front seat. You guess this unit was an early responder, and didn't expect zombies. You quickly check the joint, yep, hordes of the dead. You grab the shotgun out of the cop car and consider yourself lucky.";
		increaseWeapons("Shotgun");
		lootmed=0;
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 9:
		result+="Nothing here but a bunch of broken tables, broken bottles, and zombies. You lure most of the dead away, and double back to pick over the bar. You find a couple bottles of 'the good stuff', which will make for a decent disinfectant."
		break;
		case 10:
		result+= "Three zombies defend the bar.  "+combatZombies(3)+  " After defeating them, all you can find is broken bottles and spoiled food. A couple of tables can be broken down into basic defensive supplies.";
		lootsupply+=3;
	};
	break;
	case "pharmacy":
	lootmed+=Math.floor(Math.random()*5)+1;
	switch (randomSeed){
		case 1:
		results+="The medicine is all locked down pretty securely. It looks like this place was worried about breakins.  It's a bit of a pain for you, as you figure even with a crowbar it would take a lot of work to get access to the high grade stuff. You satisfy yourself by grabing some over the counter medication.";
		lootmed+=5;
		break;
		case 2:
		result+="Most of the medication is missing, but there is a stash of wheelchairs and crutches in the back. Light weight, and fairly hard to break, you figure they wouldn't make bad tools for reinforcing a base.";
		lootsupply+=2;
		break;
		case 3:
		result+= "It looks like this was initially a meeting space for survivors, and was overrun by the dead.  You begin to scavenge basic medical supplies, but are soon forced to abandon the salvage as zombies attack you. "+combatZombies(2);
		lootmed+=7;
		break;
		case 4:
		result+= "The main part of the pharmacy looks to have been looted, but a closer search reveals the backroom is curiously untouched. As you break the door open you see why, the pair of zombies trapped within shamble towards you. " +combatZombies(2)+ " After defeating the lot you take stock of the room; a few basic medical supplies plus enough unspoiled food for a few days. ";
		lootmed+=3;
		lootfood+=5;
		break;
		case 5:
		result+= "The place has a few zombies milling about, but nothing you can't handle. "+combatZombies(3)+" You find a bunch of medicine..";
		if (intelligence>12){
			result+="[int 13+] And you are smart enough to know what to do with it. Jackpot."
			lootmed+=15;
		}
		else {
			result+="[int<13] And you can't really make heads or tails out of most of them. You do find a 3rd year biology textbook behind the desk. It's a bit advanced for you, but it is hardcover.";
			increaseWeapons("Book");
		};
		break;
		case 6:
		result+= "It looks like this place was hit by a few groups of looters.  The drug supply area has been thoroughly ransacked, with both high end drugs, and basic first aid supplies missing.  However, you do spot a crate of meal replacement shakes meant for the elderly.  As long as you don’t mind chocolate, this will keep you full for a week. "
		lootfood+=8;
		break;
		case 7:
		case 8:
		result+="It looks like they were gearing up for a blood drive. Lots of needles and medicle equipment here, you aren't too sure how much use any of it will be. But the gauze and bandages will come in handy, as will the box of cookies.";
		lootfood+=1;
		lootmed+=3;
		break;
		case 9:
		case 10:
		result+= "There are a lot of zombies here, former clients most likely.  The somewhat surreal experience of being chased by elderly zombies is disturbing.  You manage to grab some quick first aid supplies before you find yourself cornered by the remains of an elderly man with a walker. "+combatZombies(1);
		lootmed+=8;
	};
	break;
	case "cafe":
	switch (randomSeed){
		case 1:
		case 2:
		result+="The place is trashed, and all of the baked goods are rotten.  There is a bag of chocolate chips behind the counter, which will have to do."
		lootfood+=2;
		break;
		case 3:
		case 4:
		result+="It's a bad scene in here. You thought the staff was in a bad mood before the apocalypse, now they are literally going to bite your head off. "+combatZombies(2)+" You are able to scavange a few meals.";
		lootfood+=3;
		break;
		case 5:
		case 6:
		result+="It looks like a group of survivors had turned this place into a camp. One of them had a first year electrical engineering book that they had marked up.";
		bonus+="You gain a bit of insight into the fundementals of scavenging electrical good. +1 Intelligence and +1 "+player.weaponKeyword;
		increaseWeapons("Book");
		player.intelligence+=1;
		break;
		case 7:
		case 8:
		result+="Some of the zombies here are slowly chewing on coffee beans from a ripped open bag in the back. Strange. They move a bit slower than you expected. "+combatZombies(3)+" One of the zombies had a hammer on a toolbelt.";
		increaseWeapons("Hammer");
		bonus+="You gain 1 New "+player.weaponKeyword;
		break;
		case 9:
		case 10:
		result+="The place has been thoroughly looted, but there are enough tables and chairs that you can salvage some defensive supplies.";
		lootsupply +=2;
	};
	break;
	case "gun":
	switch (randomSeed){
		case 1:
		case 2:
		case 3:
		result+="Just what you need in a zombie apocalypse, firepower. The shop seems like it was overrun by panicking customers in the early hours of the outbreak. A lot of the stuff on the display floor is smashed, but there are still plenty of guns to grab. What's missing is ammo. You find a sturdily constructed hunting rifle, and take it to use as a club, hoping that you can find ammo for it later.";
		increaseWeapons("Unloaded Gun");
		bonus+="You find 1 "+player.weaponKeyword;
		break;
		case 4:
		case 5:
		result+="The place is bolted down very securely, it looks like the owner suspected trouble and had a plan in place for looters. Heck, maybe even one of the few places in town that might have had a 'zombie preparedness plan'. It takes a lot of bashing to get inside, but you figure it's got to be worth it.  The noise attracts a few zombies. "+combatZombies(4)+" When you finally get in, you find almost everything is missing, there is a note on the counter. 'John, i've gone up to the cabin until... well until civilization comes back. Theres a weapon for you and Ann inside the fridge. Hope you can make it.'"
		bonus+="You take 1 pistol, and leave 1 for John. +1"+player.weaponKeyword;
		increaseWeapons("Pistol");
		break;
		case 6:
		case 7:
		case 8:
		result+="The place has been ransacked, and a fire has spread through the joint, rendering most everything unusable. You poke around for a while, not willing to give up on the dream of finding a firearm. You stay longer than you probably should, and the dead find you. "+combatZombies(3)+" Your patience is rewarded, you eventually find a hunting riffle with a small box of ammo.";
		increaseWeapons("Hunting Rifle");
		bonus+="You find 1 "+player.weaponKeyword;
		break;
		case 9:
		case 10:
		result+="This place has been turned into a virtual fortress. A field of zombies with collapsed heads litter the ground around the shop. A shout is heard from the top of the building: 'Great to see another survivor! We're a little light on supplies here, so we can't take you in, but if you leave us some food, we'll drop a gun down for you. ";
		if (player.food>30){
			result+="You have more than enough food to share. You drop a weeks worth of rations infront of the place, and are rewarded with a shower of firearms.";
			lootfood-=21;
			bonus+="You found 3 "+player.weaponKeyword;
			increaseWeapons("Hunting Rifle");
			increaseWeapons("Shotgun");
			increaseWeapons("Pistol");
		}
		else if (player.food>15){
			result+="You have plenty of food, and leave 3 days worth of food infront of the store. They thank you and toss down a rifle."
			lootfood-=9;
			bonus+="You find 1 "+player.weaponKeyword;
			increaseWeapons("Hunting Rifle");
		}
		else if (player.food>6){
			result+="Food is kind of tight, but you leave them 3 square meals. They toss you down a loaded revolver, and wish you good luck.";
			lootfood-=3;
			increaseWeapons("Pistol");
		}
		else {
			result+="You explain that you are low on supplies yourself. They seem sympathetic and toss you down an unloaded rifle, explaining that ammo is tight. Atleast you aren't leaving empty handed.";
			increaseWeapons("Unloaded Gun");
		};
	};
	break;
	default:
	lootmed+=Math.floor(Math.random()*3);
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
		result+="You can't be sure, but you think you should be able to scavange some supplies from here.  You make a quiet approach, but it's all for nothing. No sooner than you arrive than a passing herd forces you to flee.";
		lootmed=0;
		lootsupply=0;
		bonus+="You start to get a better sense for how herds of zombies move. +1 wisdom";
		player.wisdom+=1;
		break;
		case 6:
		results+="It looks like you weren't the first person to think of coming here. Much of what was useful is gone. What you do find is that some folks must have used this place as a makeshift fort to spend the night.";
		case 7:
		result+= "A former survivor was overrun by walkers looting this shop, you clear the lingering dead who had been feeding slowly on his corpse. "+combatZombies(3)+ " He was carrying a couple granola bars, and a crowbar. ";
		lootfood+=2;
		increaseWeapons("Crowbar");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 8:
		result+="Most of this place has been picked over, and what's left isn't really what you are looking for.  A bit of creative thinking gets you a few defensive supplies.";
		lootsupply+=1;
		case 9:
		result+="Looters have beaten you to this site. Everything of value is gone, but you find a number of fallen zombie corpses, pinned to the ground with modified 'lawn darts'. Seems like some survivor groups are using these as methods of thinning herds/engaging walkers from range. You pick up a few that had been left behind, so it's not a total loss.";
		increaseWeapons("Lawn Darts");
		bonus+="You found 1 new "+player.weaponKeyword;
		break;
		case 10:
		result+= "The store is thoroughly looted, and a small fire broke out near the back.  Still a first aid kit is easy enough to salvage. ";
		lootmed+=5;	
	};
};
var lootTally="";
if (lootmed>0){
lootTally+="<li>You found a total of "+lootmed+" "+player.medicineKeyword+".</li>";
};
if (lootfood>0){
lootTally+="<li>You found "+lootfood+" "+player.foodKeyword+"</li>";
};
if (lootsupply>0){
	lootTally+="<li>You found "+lootsupply+ " " +player.defenceKeyword+".</li>";
};
result+= ""+lootTally+"<li>"+bonus+"</li>";
report("Looting "+name,result);
player.food+=lootfood;
if (player.food>31){
	player.food=31;
};
player.med+=lootmed;
player.defenceSupply+=lootsupply;
};