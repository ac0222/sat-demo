import Point2D from '../sat/geometry/Point2D';
import Vector2D from '../sat/geometry/Vector2D';
import Shape from '../sat/geometry/Shape';
import Rectangle from '../sat/geometry/Rectangle';
import Circle from '../sat/geometry/Circle';
import Triangle from '../sat/geometry/Triangle';
import {
	VECTOR_FORMS,
	SHAPE_TYPES,
	COLLISION_TYPES
} from '../sat/geometry/constants';
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
					mtv = Shape.collisionDetection(currentShape, cms);

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
					new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0, COLLISION_TYPES.STICK,
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
			new Vector2D(180, 180, VECTOR_FORMS.CARTESIAN), 0, COLLISION_TYPES.BOUNCE,
			"green", "red");
		ms1.setIndestructable();
		this.movingShapes.push(ms1);

		// ok, now add all these to the 'all shapes' array
		for (var i = 0; i < this.movingShapes.length; i++) {
			this.shapes.push(this.movingShapes[i]);
		}
	}
	level1Obstacles() {
		let obs = []
		// rectangles
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 3; j++) {
				if (i ==0 && j == 1) {
					obs.push(new Circle(
						10, 
						new Point2D(40*j + 25, 30*i + 20),
						0,
						new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN),
						0,
						COLLISION_TYPES.STATIC,
						"blue",
						"red"));
					continue;
				}
				obs.push(new Rectangle(
					15, 
					8, 
					new Point2D(40*j + 25, 30*i + 20),
					0,
					new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN),
					0,
					COLLISION_TYPES.STATIC,
					"green",
					"red"));
			}
		}
		// triangles
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 3; j++) {
				if (i ==0 && j == 1) {
					obs.push(new Circle(
						10, 
						new Point2D(40*j + 290, 30*i + 20),
						45*i,
						new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN),
						0,
						COLLISION_TYPES.STATIC,
						"red",
						"red"));
					continue;
				}
				obs.push(new Triangle(
					15, 
					new Point2D(40*j + 290, 30*i + 20),
					45*i,
					new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN),
					0,
					COLLISION_TYPES.STATIC,
					"green",
					"red"));
			}
		}

		// middle
		for (let i = 0; i < 8; i++) {
			obs.push(new Triangle(
				15, 
				new Point2D(160, 30*i + 20),
				45*i,
				new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN),
				0,
				COLLISION_TYPES.STATIC,
				"green",
				"red"));
			obs.push(new Rectangle(
				15, 
				8, 
				new Point2D(200, 30*i + 20),
				0,
				new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN),
				0,
				COLLISION_TYPES.STATIC,
				"green",
				"red"));
			obs.push(new Circle(
				13, 
				new Point2D(240, 30*i + 20),
				0,
				new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN),
				0,
				COLLISION_TYPES.STATIC,
				"green",
				"red"));
		}

		return obs;
	}

	initStaticShapes() {
		let l1shapes = this.level1Obstacles();
		for (let s of l1shapes) {
			this.shapes.push(s);
		}
	}

	initWalls() {
		// the walls are actually just long thin rectangles which
		// we collide with
		let leftWall = new Rectangle(5, WORLD_HEIGHT/2,
							new Point2D(0, WORLD_HEIGHT/2),
							0,
							new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0, COLLISION_TYPES.STATIC,
							"black", "black");
		leftWall.setIndestructable();
		let rightWall = new Rectangle(5, WORLD_HEIGHT/2,
							new Point2D(WORLD_WIDTH, WORLD_HEIGHT/2),
							0,
							new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0, COLLISION_TYPES.STATIC,
							"black", "black");
		rightWall.setIndestructable();
		let topWall = new Rectangle(WORLD_WIDTH/2, 5,
							new Point2D(WORLD_WIDTH/2, 0),
							0,
							new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0, COLLISION_TYPES.STATIC,
							"black", "black");
		let bottomWall = new Rectangle(WORLD_WIDTH/2, 5,
							new Point2D(WORLD_WIDTH/2, WORLD_HEIGHT),
							0,
							new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0, COLLISION_TYPES.STATIC,
							"black", "black");

		let leftPartition = new Rectangle(5, WORLD_HEIGHT/4,
			new Point2D(WORLD_WIDTH/3, WORLD_HEIGHT/4),
			0,
			new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0, COLLISION_TYPES.STATIC,
			"black", "black");
		leftPartition.setIndestructable();
		
		let rightPartition = new Rectangle(5, WORLD_HEIGHT/4,
			new Point2D(WORLD_WIDTH*(2/3), WORLD_HEIGHT/4),
			0,
			new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0, COLLISION_TYPES.STATIC,
			"black", "black");
		rightPartition.setIndestructable();
		
		this.shapes.push(leftWall)
		this.shapes.push(rightWall);
		this.shapes.push(topWall);
		this.shapes.push(bottomWall);
		this.shapes.push(leftPartition);
		this.shapes.push(rightPartition);
		this.freedomWall = topWall;
		this.deathWall = bottomWall;
	}
}


export default World;