var platino = require('co.lanica.platino');

var HomeScene = function(window, game) {
	var scene = platino.createScene();

	// forward declarations
	var updateTimerID;
	var touchScaleX = 1;
	var touchScaleY = 1;


	// Using this instead!
	function createBackground() {
		backgroundRandom = platino.createParticles({image:'graphics/StarField.pex'});
		backgroundRandom.x = game.screen.width / 2;
		backgroundRandom.y = game.screen.height / 2;
		backgroundRandom.z = 0;
		scene.add(backgroundRandom);
	}

	var A_ROWS = 1;
	var B_ROWS = 2;
	var C_ROWS = 2;
	var INVADERS_PER_ROW = 10;
	var MAX_FRIENDLY_SHOTS = 2;
	var MAX_ENEMY_SHOTS = 1;
	var invaderCheckCounter = 0;
	var pauseDuration = 20;
	var invadersDirection = 'right';
	var moveDown = false;
	var oX;
	
		// Create game sounds
	var moveSound = new Array(4);
	moveSound[0] = Ti.Media.createSound({url:"sounds/fastinvader1.wav"});
	moveSound[1] = Ti.Media.createSound({url:"sounds/fastinvader2.wav"});
	moveSound[2] = Ti.Media.createSound({url:"sounds/fastinvader3.wav"});
	moveSound[3] = Ti.Media.createSound({url:"sounds/fastinvader4.wav"});
	var currentSound = 0;
	var invaderKill = Ti.Media.createSound({url:"sounds/invaderkilled.wav"});
	var shipKill = Ti.Media.createSound({url:"sounds/explosion.wav"});
	var shootSound = Ti.Media.createSound({url:"sounds/shoot.wav"});
	
	var invaders = new Array(A_ROWS+B_ROWS+C_ROWS);
	var invadersMover = new Array(A_ROWS+B_ROWS+C_ROWS);
	for (var i = 0; i < A_ROWS+B_ROWS+C_ROWS; i++)
	{
		invaders[i] = new Array(INVADERS_PER_ROW);
		invadersMover[i] = new Array(INVADERS_PER_ROW);
	}
	

	/*
	 * Initialize invaders
	 */
	function createInvaderGroup() {
	    
	    var invaderSprites = [
	        {image:'graphics/Invader1.png', width:47, height:47, frame:0},
	        {image:'graphics/Invader2.png', width:47, height:47, frame:0},
	        {image:'graphics/Invader3.png', width:47, height:47, frame:0}
	    ];
	    
	    for (var i = 0; i < A_ROWS+B_ROWS+C_ROWS; i++) {
	    	for (var j = 0; j < INVADERS_PER_ROW; j++)
	    	{
	    		var invaderPicker;
	    		if (i < A_ROWS)
	    			invaderPicker = 0;
	    		else if (i < A_ROWS + B_ROWS)
	    			invaderPicker = 1;
	    		else
	    			invaderPicker = 2;
		        invaders[i][j] = platino.createSprite(invaderSprites[invaderPicker]);
		        if (i % 2 == 1) {
		        	invaders[i][j].rotate(90);
		        	invaders[i][j].rotated = true;
		        }
		        else { invaders[i][j].rotated = false; }
		        invaders[i][j].alive = true;
		        invadersMover[i][j] = platino.createTransform();
		        invadersMover[i][j].rowIndex = i;
		        invadersMover[i][j].columnIndex = j;
		        
		        invaders[i][j].x = (game.screen.width * 0.05) + (j * 65);
		        invaders[i][j].y = 100 + (i * 65);
		        invaders[i][j].z = 99;
		        
		        scene.add(invaders[i][j]);
		        invaders[i][j].show();
	        }
	    }
	}
	

	/*
	 * Check if invaders collide with shots or should keep moving
	 */
	function checkInvaders() {
		var moveToX = 0;
		var moveToY = 0;
		var moveInvaders = false;
		var switchDirection = false;
		
		if (invaderCheckCounter >= pauseDuration) {
			moveInvaders = true;
			invaderCheckCounter = 0;
			
			//Play movement sound
            moveSound[currentSound].play();
            if (currentSound == 3) {currentSound = 0;}
            else {currentSound++;}
			
			//Check for downward movement
			if (moveDown) {moveToX = 0; moveToY = 60; moveDown = false;}
			else {
				if (invadersDirection == 'right') { moveToX = 60; }
				else { moveToX = -60; }
			}
		}
		else {
			invaderCheckCounter++;
		}
		
		for (var i = 0; i < A_ROWS+B_ROWS+C_ROWS; i++) {
			for (var j = 0; j < INVADERS_PER_ROW; j++) {
				if (invaders[i][j].alive) {
					// First check for collisions with shots
					
					for (var k = 0; k < MAX_FRIENDLY_SHOTS; k++) {
		                if (!shots[k].ready && invaders[i][j].collidesWith(shots[k])) {
		                    explosions[k].x = invaders[i][j].x + (invaders[i][j].width  * 0.5);
		                    explosions[k].y = invaders[i][j].y + (invaders[i][j].height * 0.5);
		                    explosions[k].z = invaders[i][j].z + 1;
		                    // Restart the explosion particle effect
		                    explosions[k].restart();
		                    invaderKill.play();
		                    
		                    invaders[i][j].hide();
		                    invaders[i][j].clearTransforms();
		                    invaders[i][j].alive = false;
		                    
		                    shots[k].hide();
		                    shots[k].ready = true;
		                    
		                    break;
		                }
		            }
				}
				if (invaders[i][j].alive && moveInvaders) {
		            // Then move invaders
					
					invadersMover[i][j].x = invaders[i][j].x + moveToX;
					invadersMover[i][j].y = invaders[i][j].y + moveToY;
					invadersMover[i][j].duration = pauseDuration * 4;
					if (invaders[i][j].rotated) {
						invadersMover[i][j].rotate(0);
						invaders[i][j].rotated = false;
					}
					else {
						invadersMover[i][j].rotate(invadersDirection == 'right' ? 90 : -90);
						invaders[i][j].rotated = true;
					}
					
					invaders[i][j].transform(invadersMover[i][j]);
					
					if ((invadersMover[i][j].x + 65 >= game.screen.width * 0.95 && invadersDirection == 'right') || (invadersMover[i][j].x <= game.screen.width * 0.05 && invadersDirection == 'left')) {
						switchDirection = true;
					}
					
					if (invaders[i][j].y + invaders[i][j].height > game.screen.height - invaders[i][j].height) {
						endGame(false);
					}
				}
				continue;
			}
		}
		if (switchDirection) {
			if (invadersDirection == 'right') {invadersDirection = 'left';}
			else {invadersDirection = 'right';}
			
			pauseDuration -= 2;
			moveDown = true;
		}
	}

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
				shipKill.play();
				
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
		Ti.API.info('Fire button X: ' + fireButton.x + ' Fire button width: ' + fireButton.width);
		Ti.API.info('Fire button Y: ' + fireButton.y + ' Fire button height: ' + fireButton.height);
		Ti.API.info('Touch X: ' + e.x + ' Touch Y: ' + e.y);
		if (fireButton.contains(e.x, e.y - 200)) {
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

	// Initialize bullets, enemies and background
	var shots = new Array(MAX_FRIENDLY_SHOTS);
	var shotsMover = new Array(MAX_FRIENDLY_SHOTS);
	var explosions = new Array(MAX_FRIENDLY_SHOTS);
	var shotIndex = 0;
	

	/*
	 * Initialize shots
	 */
	function createShots() {
	    for (var i = 0; i < MAX_FRIENDLY_SHOTS; i++) {
	        shots[i] = platino.createSprite({image:'graphics/Bullet.png'});
	        shots[i].hide();
	        shots[i].ready = true;
	        
	        explosions[i] = platino.createParticles({image:'graphics/EnemyExplosion.pex'});
	        explosions[i].stop();
	        
	        shotsMover[i] = platino.createTransform();
	        shotsMover[i].index = i;
	        
	        shotsMover[i].addEventListener('complete', shotsCompleted);
	        scene.add(shots[i]);
	        scene.add(explosions[i]);
	    }
	}
	

	var shotsCompleted = function(e) {
	    shots[e.source.index].hide();
	    shots[e.source.index].ready = true;
	};
	

	function getInitialShotYPosition() {
	    return myship.y - (shots[0].height);
	}
	function getInitialShotXPosition(){
	    return myship.x + (myship.width * 0.5) - (shots[0].width * 0.5);
	}
	
	var lastTimeShotFired = 0;
	
	/*
	 * Fire next bullet
	 */
	function fireShot() {
	    // Wait 200 msec for firing next bullet
	    if (myship.alive && +new Date() - lastTimeShotFired > 200 && shots[shotIndex].ready) {
	    	shootSound.play();
	    	
	        shots[shotIndex].clearTransform(shotsMover[shotIndex]);
	        
	        shots[shotIndex].x = getInitialShotXPosition();
	        shots[shotIndex].y = getInitialShotYPosition();
	        shots[shotIndex].z = myship.z + 1;
	        shots[shotIndex].ready = false;
	        shots[shotIndex].show();
	        shotsMover[shotIndex].x = getInitialShotXPosition();
	        shotsMover[shotIndex].y = -shots[shotIndex].height;
	        shotsMover[shotIndex].duration = (shots[shotIndex].y + shots[shotIndex].height) / 150 * 200;
	        shots[shotIndex].transform(shotsMover[shotIndex]);
	        
	        shotIndex++;
	        if (shotIndex >= MAX_FRIENDLY_SHOTS) {
	            shotIndex = 0;
	        }
	        
	        lastTimeShotFired = +new Date();
	    }
	}
	// Create fire button
	var fireButton = platino.createSprite({image:'graphics/FireButton.png', width:200, height:200});
	
	
	function initFireButton() {
	    fireButton.x = 40;
	    fireButton.y = game.screen.height - fireButton.height - 40;
	    fireButton.z = 0;
	    fireButton.alpha = 0.2;
	}

	var zaps = new Array(MAX_ENEMY_SHOTS);
	var zapsMover = new Array(MAX_ENEMY_SHOTS);
	var shipExplosions = new Array(MAX_ENEMY_SHOTS);
	var zapIndex = 0;
	

	/*
	 * Initialize zaps
	 */
	function createZaps() {
	    for (var i = 0; i < MAX_ENEMY_SHOTS; i++) {
	        zaps[i] = platino.createSprite({image:'graphics/Zap.png'});
	        zaps[i].hide();
	        zaps[i].ready = true;
	        
	        shipExplosions[i] = platino.createParticles({image:'graphics/ShipExplosion.pex'});
	        shipExplosions[i].stop();
	        
	        zapsMover[i] = platino.createTransform();
	        zapsMover[i].index = i;
	        
	        zapsMover[i].addEventListener('complete', zapsCompleted);
	        scene.add(zaps[i]);
	        scene.add(shipExplosions[i]);
	    }
	}
	

	var zapsCompleted = function(e) {
	    zaps[e.source.index].hide();
	    zaps[e.source.index].ready = true;
	};
	

	var firingInvaderRow = 0;
	var firingInvaderCol = 0;
	
	function getInitialZapYPosition() {
	    return invaders[firingInvaderRow][firingInvaderCol].y + (invaders[0][0].height);
	}
	function getInitialZapXPosition(){
	    return invaders[firingInvaderRow][firingInvaderCol].x + (invaders[0][0].width * 0.5) - (zaps[0].width * 0.5);
	}
	
	var lastTimeZapFired = 0;
	
	/*
	 * Fire next Zap
	 */
	function fireZap() {
		var i;
		var j;
		var found = false;
		
	    // Wait 200 msec for firing next bullet
	    if (+new Date() - lastTimeZapFired > 200 && zaps[zapIndex].ready) {
	    	for (i = A_ROWS+B_ROWS+C_ROWS - 1; i >= 0; i--) {
    			for (j = 0; j < INVADERS_PER_ROW; j++) {
    				//Ti.API.info(i + ' ' + j);
    				if (invaders[i][j].alive) {found = true; break;}
    			}
    			if (found) {break;}
    		}
    		firingInvaderRow = i;
    		firingInvaderCol = j;
	        zaps[zapIndex].clearTransform(zapsMover[zapIndex]);
	        
	        zaps[zapIndex].x = getInitialZapXPosition();
	        zaps[zapIndex].y = getInitialZapYPosition();
	        zaps[zapIndex].z = myship.z + 1;
	        zaps[zapIndex].ready = false;
	        zaps[zapIndex].show();
	        zapsMover[zapIndex].x = getInitialZapXPosition();
	        zapsMover[zapIndex].y = game.screen.height - zaps[zapIndex].height;
	        zapsMover[zapIndex].duration = (game.screen.height - (zaps[zapIndex].y + zaps[zapIndex].height)) / 150 * 500;
	        zaps[zapIndex].transform(zapsMover[zapIndex]);
	        
	        zapIndex++;
	        if (zapIndex >= MAX_ENEMY_SHOTS) {
	            zapIndex = 0;
	        }
	        
	        lastTimeZapFired = +new Date();
	    }
	}





	// scene 'activated' event listener function (scene entry-point)
	var onSceneActivated = function(e) {

		Ti.API.info("HomeScene has been activated.");
	
	    createBackground();
		
		createInvaderGroup();
	    
	    createZaps();
	    createShots();
		
	    initMyShip();
	    scene.add(myship);
	    initFireButton();
	    scene.add(fireButton);
	
//		fireButton.addEventListener('click', function(e) {
//			fireShot();
//		});
	    
	    createUpdateTimer();
	};

	// scene 'deactivated' event listener function (scene exit-point)
	var onSceneDeactivated = function(e) {

		Ti.API.info("HomeScene has been deactivated.");
		scene.dispose();
		scene = null;
	};

	// called when user presses the Android hardware back button
	// when this scene is the current scene
	scene.backButtonHandler = function() {

		// ---- your code here ----

	};
	

	
	
	function createUpdateTimer() {
	    updateTimerID = setInterval(function(e) {

	        fireZap();
	        checkInvaders();
	        checkShip();
	    }, 50);
	}
	
	
	
	
	/*
	 * End the game
	 */
	function endGame(youWon) {
		clearInterval(updateTimerID);
		
		if (!youWon) {
			var finalMessageBox = Ti.UI.createView({
				backgroundColor: 'red',
				width: 0.1 * game.screen.width,
				height: 0.1 * game.screen.height
			});
			var finalMessage = Ti.UI.createLabel({
				color: 'black',
				text: 'Game Over',
				fontSize: '26px'
			});
			finalMessageBox.add(finalMessage);
			window.add(finalMessageBox);
		}
	}
	
	
	
	var transform_camera = platino.createTransform();
	//
	// 3D camera transfromation
	//
	function transform_3d() {
	    transform_camera.is3d = true;
	    transform_camera.duration = 3000;
	    transform_camera.lookAt_eyeY = game.screen.height;
	    transform_camera.lookAt_eyeZ = 64;
	    transform_camera.lookAt_centerY = 0;
	    transform_camera.easing = platino.ANIMATION_CURVE_LINEAR;
	    
	    game.moveCamera(transform_camera);
	    fireButton.x = 400;
	}
	
	function transform_2d() {
	    var default2dCameraSetting = game.defaultCamera;
	
	    transform_camera.is3d = false;
	    transform_camera.duration = 3000;
	    transform_camera.lookAt_eyeX = default2dCameraSetting.eyeX;
	    transform_camera.lookAt_eyeY = default2dCameraSetting.eyeY;
	    transform_camera.lookAt_eyeZ = default2dCameraSetting.eyeZ;
	    transform_camera.lookAt_centerX = default2dCameraSetting.centerX;
	    transform_camera.lookAt_centerY = default2dCameraSetting.centerY;
	    transform_camera.easing = platino.ANIMATION_CURVE_LINEAR;
	    
	    game.moveCamera(transform_camera);
	    fireButton.x = 40;
	}
	
	
	function resetCamera() {
	    game.resetCamera();
	    transform_camera.is3d = false;
	}
	
	/*
	 * Double-tap to transform to 2.5D camera
	 */
//	game.addEventListener('doubletap', function(e) {
//	    if (transform_camera.is3d) {
//	        transform_2d();
//	    } else {
//	        transform_3d();
//	    }
//	});



	scene.addEventListener('activated', onSceneActivated);
	scene.addEventListener('deactivated', onSceneDeactivated);
	return scene;
};

module.exports = HomeScene;