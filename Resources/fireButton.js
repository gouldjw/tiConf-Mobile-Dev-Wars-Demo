	// Create fire button
	var fireButton = platino.createSprite({image:'graphics/FireButton.png', width:200, height:200});
	
	
	function initFireButton() {
	    fireButton.x = 40;
	    fireButton.y = game.screen.height - fireButton.height - 40;
	    fireButton.z = 0;
	    fireButton.alpha = 0.2;
	}