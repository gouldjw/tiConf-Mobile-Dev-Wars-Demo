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
            //moveSound[currentSound].play();
            //if (currentSound == 3) {currentSound = 0;}
            //else {currentSound++;}
			
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
		                    //invaderKill.play();
		                    
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