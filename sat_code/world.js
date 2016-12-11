var World = function(pic) {
	this.pic = pic;
	this.player = null;
	this.shapes = [];
	this.movingShapes = [];
	this.init();
}

World.prototype.update = function(deltaT) {
	this.player.update(deltaT);
	for (var i = 0; i < this.shapes.length; i++) {
		this.shapes[i].update(deltaT);
	}
	this.handleCollisions();
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
		curCol = collisions[key];
		curCol.s1.reactToCollision(curCol.mtv.scalarMultiply(1));
		// the other shape of course recives the negative of the mtv
		curCol.s2.reactToCollision(curCol.mtv.scalarMultiply(-1));
	}
}

World.prototype.render = function(canvas) {
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	this.player.render(ctx);
	for (var i = 0; i < this.shapes.length; i++) {
		this.shapes[i].render(ctx);
	}	
}

World.prototype.makeWalls = function() {
	// the walls are actually just long thin rectangles which
	// we collide with
	// left wall
	this.shapes.push(new Rectangle(5, WORLD_HEIGHT/2,
						new Point2D(0, WORLD_HEIGHT/2),
						0,
						new Vector2D(0, 0, "cartesian"), 0, "static",
						"black", "black")
	);
	// right wall
	this.shapes.push(new Rectangle(5, WORLD_HEIGHT/2,
						new Point2D(WORLD_WIDTH, WORLD_HEIGHT/2),
						0,
						new Vector2D(0, 0, "cartesian"), 0, "static",
						"black", "black")
	);
	// top wall
	this.shapes.push(new Rectangle(WORLD_WIDTH/2, 5,
						new Point2D(WORLD_WIDTH/2, 0),
						0,
						new Vector2D(0, 0, "cartesian"), 0, "static",
						"black", "black")
	);
	// bottom wall
	this.shapes.push(new Rectangle(WORLD_WIDTH/2, 5,
						new Point2D(WORLD_WIDTH/2, WORLD_HEIGHT),
						0,
						new Vector2D(0, 0, "cartesian"), 0, "static",
						"black", "black")
	);
}

World.prototype.init = function() {
	// make the walls first
	this.makeWalls();
	// initialise the player
	var playerShape = new Circle(5,
				new Point2D(200, 400),
				0,
				new Vector2D(0, 0, "cartesian"), 0, "stick",
				"green", "red");

	this.player = new Player(
		playerShape,
		150,
		2.5,
		this.pic);
	
	// initialise the shapes
	this.shapes.push(new Rectangle(15, 20, 
		new Point2D(50, 50),
		0.75,
		new Vector2D(75, 75, "cartesian"), 2, "bounce",
		"green", "red"));
	
	this.shapes.push(new Rectangle(5, 30, 
		new Point2D(100, 100),
		1.212,
		new Vector2D(80, 80, "cartesian"), 10, "bounce",
		"green", "red"));
	
	this.shapes.push(new Rectangle(50, 50, 
		new Point2D(300, 300),
		0.34,
		new Vector2D(50, 50, "cartesian"), -1, "bounce",
		"green", "red"));
	
	this.shapes.push(new Triangle(50, 
		new Point2D(80, 200),
		0.34,
		new Vector2D(200, 200, "cartesian"), 4, "bounce",
		"green", "red"));	
	
	
	this.shapes.push(new Circle(30, 
		new Point2D(200, 100),
		0,
		new Vector2D(100, 100, "cartesian"), 0, "bounce",
		"green", "red"));
	
	this.shapes.push(new Circle(10, 
		new Point2D(200, 200),
		0,
		new Vector2D(100, 100, "cartesian"), 0, "bounce",
		"green", "red"));
	
	this.shapes.push(new Circle(20, 
		new Point2D(300, 100),
		0,
		new Vector2D(200, 200, "cartesian"), 0, "bounce",
		"green", "red"));

	this.shapes.push(new Circle(80, 
		new Point2D(100, 400),
		0,
		new Vector2D(50, 50, "cartesian"), 0, "bounce",
		"green", "red"));
	
	// add moving shapes
	this.movingShapes.push(this.player.shape);
	for (var i = 0; i < this.shapes.length; i++) {
		if (this.shapes[i].isActive()) {
			this.movingShapes.push(this.shapes[i]);
		}
	}
}

