var Skewer = {};

Skewer.FPS = 60;
Skewer.LPS = 60;
Skewer.canvas = null;
Skewer.canvasWidth = null;
Skewer.canvasHeight = null;
Skewer.context = null;
Skewer.keysDown = [];
Skewer.lastLoopTime = Date.now();
Skewer.lastRenderTime = Date.now();
Skewer.lastLogicTime = Date.now();
Skewer.lastInputTime = Date.now();
Skewer.renderRate = Skewer.FPS / 1000;
Skewer.logicRate = Skewer.LPS / 1000;
Skewer.inputRate = 1;
Skewer.currentEnemies = [];
Skewer.currentLevel = 1;
Skewer.RenderList = [];

/* Models */
Skewer.Models = {};
Skewer.Models.Model = function () {
	var that = {};
	that.xPosition = 300;
	that.yPosition = 300;
	that.xSize = 5;
	that.ySize = 5;
	that.render = function () {
		return 0;
	};
	return that;
};

Skewer.Models.Player = function () {
	var that = Skewer.Models.Model();
	that.xPosition = Skewer.canvasWidth / 2 - 40;
	that.yPosition = Skewer.canvasHeight / 2 - 1;
	that.xSize = 80;
	that.ySize = 3;
	that.currentRotation = 45;
	that.render = function (currentContext) {
		currentContext.save();
		currentContext.translate(that.xPosition+40, that.yPosition);
		currentContext.rotate(that.currentRotation * Math.PI / 180);
		currentContext.fillStyle = "rgb(18,114,178)";
		currentContext.fillRect(0-40, 0-1, that.xSize, 1);
		currentContext.fillStyle = "rgb(0,157,255)";
		currentContext.fillRect(0+2-40, 0, that.xSize, 1);
		currentContext.fillStyle = "rgb(18,114,178)";
		currentContext.fillRect(0-40, 0+1, that.xSize, 1);
		currentContext.fillStyle = "rgb(18,114,178)";
		currentContext.fillRect(0+9-40, 0-4, 15, 9);
		currentContext.restore();
	}
	return that;
};

Skewer.Models.Foods = {};
Skewer.Models.Foods.List = [];
Skewer.Models.Foods.Food = function () {
	var that = Skewer.Models.Model();
	that.xSize = 20;
	that.ySize = 20;
	that.xVelocity = 0;
	that.yVelocity = 0;
	that.xPosition = 0;
	that.yPosition = 0;
	that.rotation = 0;
	that.color = "rgb(155,155,155)";
	that.render = function (currentContext) {
		currentContext.save();
		currentContext.fillStyle = that.color;
		currentContext.beginPath();
		currentContext.arc(that.xPosition + that.xSize / 2, that.yPosition + that.ySize / 2, that.xSize / 2, 360 * (Math.PI / 180), false);
		currentContext.closePath();
		currentContext.fill();
		currentContext.restore();
	};
	return that;
};
Skewer.Models.Foods.Carrot = function () {
	var that = Skewer.Models.Foods.Food();
	that.color = "rgb(255,150,0)";
	Skewer.RenderList.push(that);
	return that;	
} 
Skewer.Models.Foods.List.push(Skewer.Models.Foods.Carrot);

/* Views */
Skewer.Views = {};

/* Controllers */
Skewer.Controllers = {};
Skewer.Controllers.Controller = function () {
	var that;

	return that;
};

Skewer.GameLoop = function () {
	var now = Date.now(),
	    delta = now - Skewer.lastLoopTime;
	
	Skewer.Input();
	if (now - Skewer.lastLogicTime > Skewer.logicRate) {
		Skewer.Logic();
		Skewer.lastLogicTime = Date.now();
	}
	if (now - Skewer.lastRenderTime > Skewer.renderRate) {
		Skewer.Render();
		Skewer.lastRenderTime = Date.now();	
	} 
};

Skewer.Logic = function () {
	// Move things

	// AI: Determine next move
	// Hit detection
	// Spawn more stuff
	if (Skewer.currentEnemies.length < 5 + Skewer.currentLevel) {
		Skewer.currentEnemies.push(Skewer.Models.Foods.List[Math.floor(Math.random() * Skewer.Models.Foods.List.length)]());
	}
};

Skewer.Input = function () {
	if (37 in this.keysDown) {
		Skewer.currentGame.player.currentRotation = Skewer.currentGame.player.currentRotation - 1;

	}
	if (39 in this.keysDown) {
		Skewer.currentGame.player.currentRotation = Skewer.currentGame.player.currentRotation + 1;
	}
	if (38 in this.keysDown) {
		Skewer.currentGame.player.xPosition = Skewer.currentGame.player.xPosition + Math.cos(Skewer.currentGame.player.currentRotation * Math.PI / 180);
		Skewer.currentGame.player.yPosition = Skewer.currentGame.player.yPosition + Math.sin(Skewer.currentGame.player.currentRotation * Math.PI / 180);
	}
	if (40 in this.keysDown) {
		Skewer.currentGame.player.xPosition = Skewer.currentGame.player.xPosition - Math.cos(Skewer.currentGame.player.currentRotation * Math.PI / 180);
		Skewer.currentGame.player.yPosition = Skewer.currentGame.player.yPosition - Math.sin(Skewer.currentGame.player.currentRotation * Math.PI / 180);	
	}
};

Skewer.CheckForSupport = function () {
	this.canvas = document.getElementById('skewerCanvas');
	if(this.canvas.getContext) {
		this.context = this.canvas.getContext('2d');
		this.canvasWidth = this.canvas.width;
		this.canvasHeight = this.canvas.height;
		return true;
	} else {
		return false;
	}
};

Skewer.Render = function () {
	Skewer.context.clearRect(0,0,Skewer.canvasWidth, Skewer.canvasHeight)
	for(var i = 0; i < this.RenderList.length; i += 1) {
		this.RenderList[i].render(Skewer.context);
	}
};

Skewer.SpawnPlayer = function () {
	for(var renderableObject in this.RenderList) {
		if (renderableObject = Skewer.currentGame.player) {
			
		}
	}
	Skewer.currentGame.player = null;
	Skewer.currentGame.player = Skewer.Models.Player();
	Skewer.RenderList.push(Skewer.currentGame.player);
};


Skewer.NewGame = function () {
	Skewer.currentGame = {};
	Skewer.currentGame.player = Skewer.Models.Player();
	Skewer.RenderList.push(Skewer.currentGame.player);
	setInterval(Skewer.GameLoop, 1);
};

Skewer.Initialize = function () {
	if(this.CheckForSupport()) {
		Skewer.NewGame();
	}
};

addEventListener("keydown", function (e) {
	Skewer.keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete Skewer.keysDown[e.keyCode];
}, false);