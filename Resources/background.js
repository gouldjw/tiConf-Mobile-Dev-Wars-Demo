	var backgrounds;
	var backgroundMover;
	var backgroundFollowMover;
	

	/*
	 * Initialize background
	 */
	// I'm not going to use this!
	function createBackground() {
	    backgrounds = [
	        platino.createSpriteSheet({image: 'graphics/cloud.xml', frame:0}),
	        platino.createSpriteSheet({image: 'graphics/cloud.xml', frame:1}),
	        platino.createSpriteSheet({image: 'graphics/cloud.xml', frame:2}),
	        platino.createSpriteSheet({image: 'graphics/cloud.xml', frame:3}),
	        platino.createSpriteSheet({image: 'graphics/cloud.xml', frame:4})
	    ];
	    
	    backgroundMover = new Array(backgrounds.length);
	    backgroundFollowMover = new Array(backgrounds.length);
	    
	    for (var i = 0; i < backgrounds.length; i++) {
	        backgrounds[i].x = Math.random() * (game.screen.width - backgrounds[i].width);
	        backgrounds[i].y = Math.random() * (game.screen.height - backgrounds[i].height);
	        backgrounds[i].z = 0;
	        backgrounds[i].ready = true;
	        
	        scene.add(backgrounds[i]);
	        
	        backgroundMover[i] = platino.createTransform();
	        backgroundMover[i].index = i;
	        backgroundMover[i].addEventListener('complete', backgroundCompleted);
	        
	        backgroundFollowMover[i] = platino.createTransform();
	    }
	}
	
	var backgroundCompleted = function(e) {
	    backgrounds[e.source.index].ready = true;
	};
	
	
	// Using this instead!
	function createBackground() {
		backgroundRandom = platino.createParticles({image:'graphics/StarField.pex'});
		backgroundRandom.x = game.screen.width / 2;
		backgroundRandom.y = game.screen.height / 2;
		backgroundRandom.z = 0;
		scene.add(backgroundRandom);
	}