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