var World = function(pic) {
	this.pic = pic;
	this.player = null;
	this.shapes = null;
	this.movingShapes = null;
	this.freedomWall = null;
	this.deathWall = null;
	this.init();
}

World.prototype.update = function(deltaT) {
	this.player.update(deltaT);
	for (var i = 0; i < this.shapes.length; i++) {
		this.shapes[i].update(deltaT);
	}
	this.handleCollisions();
	this.removeDestroyedShapes();
	// do win condition checking here
	return this.checkGameOver();
}

World.prototype.handleCollisions = function() {
	var cms = null;
	var currentShape = null;
	var collisions = {};
	var curCol = null;

	// first, find all the collisions
	for (var i = 0; i < this.movingShapes.length; i++) {
		cms = this.movingShapes[i];
		for (var j = 0; j < this.shapes.length; j++) {
			// we need a new mtv every time
			var mtv = null;
			currentShape = this.shapes[j];
			// dont compare the same shape to itself
			if (!cms.equals(currentShape)) {
				if (cms.shapeType == "circle") {
					if (currentShape.shapeType == "circle") {
						mtv = Shape.ccCollisionDetection(currentShape, cms);
					} else {
						mtv = Shape.pcCollisionDetection(currentShape, cms);
					}
				} else {
					if (currentShape.shapeType == "circle") {
						mtv = Shape.pcCollisionDetection(cms, currentShape);
					} else {
						mtv = Shape.ppCollisionDetection(cms, currentShape);
					}
				}

				if (mtv != null) {
					var newCol = {};
					if (cms.shapeType == "circle") {
						newCol.s1 = currentShape;
						newCol.s2 = cms;
					} else {
						newCol.s1 = cms;
						newCol.s2 = currentShape;
					}
					newCol.mtv = mtv;
					// only allow 2 shapes to collide once per frame
					// create a key out of stringifying the two shapes
					var newKey = JSON.stringify(newCol.s1) + 
									JSON.stringify(newCol.s2);
					var possibleVariant = JSON.stringify(newCol.s2) + 
											JSON.stringify(newCol.s1);
					if (!(newKey in collisions) && 
						!(possibleVariant in collisions)) {
						collisions[newKey] = newCol;
					}
				}
			}
		}
	}
	// now resolve the collisions
	for (var key in collisions) {
		var destroyFlag = null;
		curCol = collisions[key];
		// player can't destroy shapes
		if (curCol.s1.equals(this.player.shape) || 
			curCol.s2.equals(this.player.shape)) {
			destroyFlag = false;
		} else {
			destroyFlag = true;
		}
		curCol.s1.reactToCollision(curCol.mtv.scalarMultiply(1), destroyFlag);
		// the other shape of course recives the negative of the mtv
		curCol.s2.reactToCollision(curCol.mtv.scalarMultiply(-1), destroyFlag);
	}
}

World.prototype.removeDestroyedShapes = function() {
	var currentShape = null;
	for (var i = this.shapes.length-1; i >= 0; i--) {
		currentShape = this.shapes[i];
		if (currentShape.destructable) {
			if (currentShape.destroyFlag) {
				this.shapes.splice(i, 1);
			}
		}
	}
}

World.prototype.checkGameOver = function() {
	if (this.freedomWall.destroyFlag) {
		return WIN_FLAG;
	} 
	if (this.deathWall.destroyFlag) {
		return LOSS_FLAG;
	}
	return GAME_UNFINISHED_FLAG;
}

World.prototype.displayWinScreen = function(canvas) {
	var ctx2d = canvas.getContext("2d");
	ctx2d.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
	ctx2d.font = "16px Arial";
	ctx2d.fillStyle = "#0095DD";
	ctx2d.fillText("YOU DEFEATED", WORLD_WIDTH/2, WORLD_HEIGHT/2);
}

World.prototype.displayLossScreen = function(canvas) {
	var ctx2d = canvas.getContext("2d");
	ctx2d.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
	ctx2d.font = "16px Arial";
	ctx2d.fillStyle = "#0095DD";
	ctx2d.fillText("YOU DIED", WORLD_WIDTH/2, WORLD_HEIGHT/2);
}

World.prototype.render = function(canvas) {
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.player.render(ctx);
	for (var i = 0; i < this.shapes.length; i++) {
		this.shapes[i].render(ctx);
	}	
}

World.prototype.init = function() {
	// initialise empty shape arrays
	this.shapes = [];
	this.movingShapes = [];

	this.initWalls();
	this.initStaticShapes();
	this.initMovingShapes();
	this.initPlayers();
}

World.prototype.initPlayers = function() {
	var playerShape = new Rectangle(50, 5,
				new Point2D(200, 450),
				0,
				new Vector2D(0, 0, "cartesian"), 0, "stick",
				"green", "red");
	playerShape.setIndestructable();
	this.player = new Player(
		playerShape,
		150,
		2.5,
		this.pic);

	// add to the shapes array
	this.shapes.push(this.player.shape);
	// the player moves, so add their shape to the moving shape category
	this.movingShapes.push(this.player.shape);
}

World.prototype.initMovingShapes = function() {
	var ms1 = new Circle(10, 
		new Point2D(200, 400),
		0,
		new Vector2D(180, 180, "cartesian"), 0, "bounce",
		"green", "red");
	ms1.setIndestructable();
	this.movingShapes.push(ms1);

	// ok, now add all these to the 'all shapes' array
	for (var i = 0; i < this.movingShapes.length; i++) {
		this.shapes.push(this.movingShapes[i]);
	}
}

World.prototype.initStaticShapes = function() {
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 5; j++) {
			if (i*j % 3 == 0) {
				this.shapes.push(new Rectangle(15, 30, 
					new Point2D(50*i, 50*j),
					Math.random()*2*Math.PI,
					new Vector2D(0, 0, "cartesian"), 0, "static",
					"green", "red"));
			} else if (i*j % 3 == 1) {
				this.shapes.push(new Triangle(30, 
					new Point2D(50*i, 50*j),
					Math.random()*2*Math.PI,
					new Vector2D(0, 0, "cartesian"), 0, "static",
					"green", "red"));
			} else {
				this.shapes.push(new Circle(30, 
					new Point2D(50*i, 50*j),
					0,
					new Vector2D(0, 0, "cartesian"), 0, "static",
					"green", "red"));
			}
		}
	}
	/*
	this.shapes.push(new Rectangle(15, 20, 
		new Point2D(50, 50),
		0.75,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));

	this.shapes.push(new Rectangle(15, 20, 
		new Point2D(50, 50),
		0.75,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));

	this.shapes.push(new Rectangle(15, 20, 
		new Point2D(50, 50),
		0.75,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));
	this.shapes.push(new Rectangle(15, 20, 
		new Point2D(50, 50),
		0.75,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));
	this.shapes.push(new Rectangle(15, 20, 
		new Point2D(50, 50),
		0.75,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));
	this.shapes.push(new Rectangle(5, 30, 
		new Point2D(100, 100),
		1.212,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));
	
	this.shapes.push(new Rectangle(50, 50, 
		new Point2D(300, 300),
		0.34,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));
	
	this.shapes.push(new Triangle(50, 
		new Point2D(80, 200),
		0.34,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));	
	/*
	this.shapes.push(new Circle(10, 
		new Point2D(200, 200),
		0,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));
	
	this.shapes.push(new Circle(20, 
		new Point2D(300, 100),
		0,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));

	this.shapes.push(new Circle(80, 
		new Point2D(100, 400),
		0,
		new Vector2D(0, 0, "cartesian"), 0, "static",
		"green", "red"));
	*/
}

World.prototype.initWalls = function() {
	// the walls are actually just long thin rectangles which
	// we collide with
	leftWall = new Rectangle(5, WORLD_HEIGHT/2,
						new Point2D(0, WORLD_HEIGHT/2),
						0,
						new Vector2D(0, 0, "cartesian"), 0, "static",
						"black", "black");
	leftWall.setIndestructable();
	rightWall = new Rectangle(5, WORLD_HEIGHT/2,
						new Point2D(WORLD_WIDTH, WORLD_HEIGHT/2),
						0,
						new Vector2D(0, 0, "cartesian"), 0, "static",
						"black", "black");
	rightWall.setIndestructable();
	topWall = new Rectangle(WORLD_WIDTH/2, 5,
						new Point2D(WORLD_WIDTH/2, 0),
						0,
						new Vector2D(0, 0, "cartesian"), 0, "static",
						"black", "black");
	topWall.setIndestructable();
	bottomWall = new Rectangle(WORLD_WIDTH/2, 5,
						new Point2D(WORLD_WIDTH/2, WORLD_HEIGHT),
						0,
						new Vector2D(0, 0, "cartesian"), 0, "static",
						"black", "black");
	bottomWall.setIndestructable();
	this.shapes.push(leftWall);
	this.shapes.push(rightWall);
	this.shapes.push(topWall);
	this.shapes.push(bottomWall);
	this.freedomWall = topWall;
	this.deathWall = bottomWall;
}