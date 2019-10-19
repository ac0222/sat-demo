import Point2D from '../sat/geometry/Point2D';
import Vector2D from '../sat/geometry/Vector2D';
import Shape from '../sat/geometry/Shape';
import Rectangle from '../sat/geometry/Rectangle';
import Circle from '../sat/geometry/Circle';
import Triangle from '../sat/geometry/Triangle';
import Player from './Player';
import {
	WIN_FLAG, 
	LOSS_FLAG, 
	GAME_UNFINISHED_FLAG,
	WORLD_HEIGHT,
	WORLD_WIDTH,
} from './constants';


class World {
	constructor(pic) {
		this.pic = pic;
		this.player = null;
		this.shapes = null;
		this.movingShapes = null;
		this.freedomWall = null;
		this.deathWall = null;
		this.init();
	}


	update(deltaT) {
		this.player.update(deltaT);
		for (let i = 0; i < this.shapes.length; i++) {
			this.shapes[i].update(deltaT);
		}
		this.handleCollisions();
		this.removeDestroyedShapes();
		// do win condition checking here
		return this.checkGameOver();
	}

	handleCollisions() {
		let cms = null;
		let currentShape = null;
		let collisions = {};
		let curCol = null;

		// first, find all the collisions
		for (let i = 0; i < this.movingShapes.length; i++) {
			cms = this.movingShapes[i];
			for (let j = 0; j < this.shapes.length; j++) {
				// we need a new mtv every time
				let mtv = null;
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
						let newCol = {};
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
						let newKey = JSON.stringify(newCol.s1) + 
										JSON.stringify(newCol.s2);
						let possibleVariant = JSON.stringify(newCol.s2) + 
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
		for (let key in collisions) {
			let destroyFlag = null;
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

	removeDestroyedShapes() {
		let currentShape = null;
		for (let i = this.shapes.length-1; i >= 0; i--) {
			currentShape = this.shapes[i];
			if (currentShape.destructable) {
				if (currentShape.destroyFlag) {
					this.shapes.splice(i, 1);
				}
			}
		}
	}

	checkGameOver() {
		if (this.freedomWall.destroyFlag) {
			return WIN_FLAG;
		} 
		if (this.deathWall.destroyFlag) {
			return LOSS_FLAG;
		}
		return GAME_UNFINISHED_FLAG;
	}

	displayWinScreen(canvas) {
		let ctx2d = canvas.getContext("2d");
		ctx2d.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
		ctx2d.font = "16px Arial";
		ctx2d.fillStyle = "#0095DD";
		ctx2d.fillText("YOU DEFEATED", WORLD_WIDTH/2, WORLD_HEIGHT/2);
	}

	displayLossScreen(canvas) {
		let ctx2d = canvas.getContext("2d");
		ctx2d.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
		ctx2d.font = "16px Arial";
		ctx2d.fillStyle = "#0095DD";
		ctx2d.fillText("YOU DIED", WORLD_WIDTH/2, WORLD_HEIGHT/2);
	}

	render(canvas) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.player.render(ctx);
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].render(ctx);
		}	
	}

	init() {
		// initialise empty shape arrays
		this.shapes = [];
		this.movingShapes = [];

		this.initWalls();
		this.initStaticShapes();
		this.initMovingShapes();
		this.initPlayers();
	}

	initPlayers() {
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

	initMovingShapes() {
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

	initStaticShapes() {
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
	}

	initWalls() {
		// the walls are actually just long thin rectangles which
		// we collide with
		let leftWall = new Rectangle(5, WORLD_HEIGHT/2,
							new Point2D(0, WORLD_HEIGHT/2),
							0,
							new Vector2D(0, 0, "cartesian"), 0, "static",
							"black", "black");
		leftWall.setIndestructable();
		let rightWall = new Rectangle(5, WORLD_HEIGHT/2,
							new Point2D(WORLD_WIDTH, WORLD_HEIGHT/2),
							0,
							new Vector2D(0, 0, "cartesian"), 0, "static",
							"black", "black");
		rightWall.setIndestructable();
		let topWall = new Rectangle(WORLD_WIDTH/2, 5,
							new Point2D(WORLD_WIDTH/2, 0),
							0,
							new Vector2D(0, 0, "cartesian"), 0, "static",
							"black", "black");
		topWall.setIndestructable();
		let bottomWall = new Rectangle(WORLD_WIDTH/2, 5,
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
}


export default World;