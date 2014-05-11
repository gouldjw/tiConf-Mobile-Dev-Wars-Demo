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
	    	//shootSound.play();
	    	
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