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