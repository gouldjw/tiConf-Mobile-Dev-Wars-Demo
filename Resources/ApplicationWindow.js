var platino = require('io.platino');

var ApplicationWindow = function() {
	var window = Ti.UI.createWindow({
		backgroundColor: 'black',
		orientationModes: [Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ], //others: Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT (should match your tiapp.xml)
		fullscreen: true,
		navBarHidden: true
	});

	var game = platino.createGameView();
	game.fps = 60;
	game.color(0, 0, 0);
	game.debug = false; // disables debug logs (not to be used for production)
	game.enableOnDrawFrameEvent = false; // optimization: setting to 'false' disables 'enterframe' event
	game.orientation = Ti.UI.LANDSCAPE_LEFT;

	// additional options:
	//game.keepScreenOn = false;
	//game.textureFilter = platino.OPENGL_LINEAR; // uncomment for smooth rendering
	//game.setUsePerspective(false); // for isometric
	//game.enableOnLoadSpriteEvent = false; // optimization: disables 'onloadsprite' and 'onunloadsprite' event except selected sprite by registerOnLoadSpriteName(name) or registerOnLoadSpriteTag(tag)
	//game.enableOnLoadTextureEvent = false; // optimization: disables 'onloadtexture' event except selected texture by registerOnLoadTextureName(name)
	//game.enableOnFpsEvent = false; // optimization: disables 'onfps' event
	//game.onFpsInterval = 5000; // sets 'onfps' event interval in msec (default: 5000)

	// Set your target screen resolution (in platform-specific units) below
	var targetWidth = 960;
	var targetHeight = 640;
	//var targetWidth = 1920;
	//var targetHeight = 1080;
	
	game.TARGET_SCREEN = {
		width: targetWidth,
		height: targetHeight
	};

	if ((Ti.Platform.displayCaps.platformWidth >= 768) && (Ti.Platform.displayCaps.dpi > 250)) {
        // Retina-display iPads, high resolution phones (e.g. Galaxy S4), etc.
        game.imageSuffix = '@3x';
        
	} else if (Ti.Platform.displayCaps.platformWidth >= 320) {
        // Non-retina iPads and retina-display iPhones, etc.
		if ((Ti.Platform.displayCaps.dpi > 200) || (Ti.Platform.displayCaps.platformWidth >= 640)) {
            game.imageSuffix = '@2x';
		} else {
			game.imageSuffix = '';
		}
	} else {
        // All other lower resolution devices...
        game.imageSuffix = '';   
	}

	var marginWidth = 0;

	// Sets up screen margins (useful for dynamic layouts, or if you want to implement letterboxing on some devices)
	// For a letter-boxed effect, add black bars to the HUD in the margin regions
	var updateMargins = function() {
		marginWidth = Math.ceil((game.screen.width - game.TARGET_SCREEN.width) * 0.5);
		marginWidth = 0;
		// defines where screen-within-margin begins (add x and y values when positioning sprites)
		game.STAGE_START = {
			x: marginWidth,
			y: 0
		};
		
		// defines where screen-within-margin ends
		game.STAGE_END = {
			x: game.screen.width - marginWidth,
			y: game.screen.height
		};
		
		// defines where Titanium stage starts (outside of Game View)
		game.TI_STAGE_START = {
			x: Math.floor(game.STAGE_START.x / game.touchScaleX),
			y: game.STAGE_START.y / game.touchScaleY
		};
		
		// defines where Titanium stage ends (outside of Game View)
		game.TI_STAGE_END = {
			x: Math.ceil(game.STAGE_END.x / game.touchScaleX),
			y: game.STAGE_END.y / game.touchScaleY
		};
		
		// defines Titanium stage size (outside of Game View)
		game.TI_STAGE_SIZE = {
			width: game.TI_STAGE_END.x - game.TI_STAGE_START.x,
			height: game.TI_STAGE_END.y - game.TI_STAGE_START.y
		};
	};

	// Updates screen size, scale, and margins
	var updateScreenSize = function() {
		var screenScale = game.size.height / game.TARGET_SCREEN.height;
		game.screen = {
			width: game.size.width / screenScale,
			height: game.size.height / screenScale
		};

		game.touchScaleX = game.screen.width  / game.size.width; // * (Ti.Platform.displayCaps.platformWidth / game.size.width);
		game.touchScaleY = game.screen.height / game.size.height; // * (Ti.Platform.displayCaps.platformHeight / game.size.height);
		game.screenScale = game.screen.height / game.TARGET_SCREEN.height;
		
		//Ti.API.info(game.size.height + '\n' + game.screen.height + '\n' + (game.size.height / game.TARGET_SCREEN.height));
		//Ti.API.info(game.size.width + '\n' + game.screen.width);
		//Ti.API.info(game.touchScaleX + ' ' + game.touchScaleY + ' ' + game.screenScale);
		//Ti.API.info(Ti.Platform.displayCaps.platformHeight + ' ' + Ti.Platform.displayCaps.platformWidth);
		
		updateMargins();
	};

	// Loads HomeScene.js as starting point to the app
	game.addEventListener('onload', function(e) {
		//game.size = {width: 1920, height: 1080};
		//game.screen = {width: 1920, height: 1080};
		//Ti.API.info(game.size.width + ' ' + game.size.height);
		//Ti.API.info(game.screen.width + ' ' + game.screen.height);
		updateScreenSize();

		var HomeScene  = require("HomeScene");
		game.currentScene = new HomeScene(window, game);

		// push loading scene and start the game
		game.pushScene(game.currentScene);
		game.start();
	});

	game.addEventListener('onsurfacechanged', function(e) {
		game.orientation = e.orientation;
		updateScreenSize();
	});

	// Convenience function to convert Titanium coordinate from a Platino coordinate
	game.getTiScale = function(x, y) {
		return {
			x: (x / game.touchScaleX),
			y: (y / game.touchScaleY)
		};
	};

	// Whenever a sprite is created, you should call this function to ensure width and height
	// properties always return the expected value depending on the device screen
	game.setupSpriteSize = function(sprite) {
		var width = sprite.width / game.screenScale;
		var height = sprite.height / game.screenScale;
		sprite.width = (width < 1) ? 1 : width;
		sprite.height = (height < 1) ? 1 : height;
	};

	// Converts screen touch event coordinates to Platino GameView coordinates
	game.locationInView = function(_e) {
        var e = { type:_e.type, x:_e.x, y:_e.y, source:_e.source };
        var x = e.x * game.touchScaleX;
        var y = e.y * game.touchScaleY;
        e.x = x;
        e.y = y;
        return e;
	};
	
	game.translateTouch = function(_e) {
		var e = { type:_e.type, x:_e.x, y:_e.y, source:_e.source };
		var isAndroid = Ti.Platform.osname == 'android';
		var x;
		var y;
		
		if (isAndroid) {
			x = e.x / game.touchScaleX;
        	y = e.y / game.touchScaleY;
		}
		else {
			x = e.x * game.touchScaleX;
        	y = e.y * game.touchScaleY;
		}
		
        e.x = x;
        e.y = y;
		return e;
	};

	// Handle android back button on a per-scene basis by adding defining a scene.backButtonHandler()
	// function within your scenes (or delete contents of below function to handle back button globally)
	window.addEventListener('androidback', function(e) {
		if ((game.currentScene) && (game.currentScene.backButtonHandler)) {
			game.currentScene.backButtonHandler();
		};
	});

	// Free up game resources when window is closed
	window.addEventListener('close', function(e) {
		game = null;
	});

	window.add(game);
	return window;
};

module.exports = ApplicationWindow;