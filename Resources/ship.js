	// Create my ship instance
	var myship = platino.createSprite({image:'graphics/Ship.png', width:47, height:41});
	
	// Transform object that reacts to user interaction
	var myshipMover = platino.createTransform();
	

	function initMyShip() {
	    myship.x = (game.screen.width * 0.5) - (myship.width * 0.5);
	    myship.y = game.screen.height - (myship.height * 1.5);
	    myship.z = 1;
	    myship.alive = true;
	}
	

	/*
	 * Check to see if ship collides with zap, thus ending the game!
	 */
	function checkShip() {
		for (var i = 0; i < MAX_ENEMY_SHOTS; i++)
		{
			if (!zaps[i].ready && myship.collidesWith(zaps[i])) {
				shipExplosions[i].x = myship.x + (myship.width * 0.5);
				shipExplosions[i].y = myship.y + (myship.height * 0.5);
				shipExplosions[i].z = myship.z + 1;
				
				shipExplosions[i].restart();
				//shipKill.play();
				
				myship.hide();
				myship.clearTransforms();
				myship.alive = false;
				
				zaps[i].hide();
				zaps[i].ready = true;
				endGame(false);
				
				break;
			}
		}
	}
	

	var movingShip = false;
	
	game.addEventListener('touchstart', function(e) {
		if (fireButton.contains(game.locationInView(e).x,game.locationInView(e).y)) {
			fireShot();
		}
		else {
			oX = myship.x - game.locationInView(e).x;
			movingShip = true;
		}
	});
	
	game.addEventListener("touchmove", function(e){
		if(movingShip){
			myship.x = game.locationInView(e).x + oX;
		}
	});

	game.addEventListener("touchend", function(e) {
		movingShip = false;
	});