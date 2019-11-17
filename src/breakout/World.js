import Point2D from '../sat/geometry/Point2D';
import Vector2D from '../sat/geometry/Vector2D';
import Shape from '../sat/geometry/Shape';
import Rectangle from '../sat/geometry/Rectangle';
import Circle from '../sat/geometry/Circle';
import Triangle from '../sat/geometry/Triangle';
import {
	VECTOR_FORMS,
	SHAPE_TYPES
} from '../sat/geometry/constants';
import Player from './Player';
import Brick from './Brick';
import Ball from './Ball';
import Wall from './Wall';
import {
	WIN_FLAG, 
	LOSS_FLAG, 
	GAME_UNFINISHED_FLAG,
	WORLD_HEIGHT,
	WORLD_WIDTH,
} from './constants';
import Materials from './Materials';


class World {
	constructor(pic) {
		this.pic = pic;

		// gameobjects
		this.player = null;
		this.ball = null;
		this.bricks = [];
		this.walls = [];
		this.freedomWall = null;
		this.deathWall = null;
		
		this.init();
	}


	update(deltaT) {
		this.player.update(deltaT);
		this.ball.update(deltaT);
		let collisions = this.detectAllCollisions();
		this.resolveCollisions(collisions);
		this.removeDestroyedShapes();
		// do win condition checking here
		return this.checkGameOver();
	}

	detectAllCollisions() {
		let collisions = [];
		let curCol = null;

		// collisions between moving shapes
		curCol = Shape.collisionDetection(this.ball, this.player);
		if (curCol !== null) {
			collisions.push(curCol);
		}

		let movingObjects = [this.ball, this.player];
		// collisions between moving shapes and static shapes
		for (let ms of movingObjects) {
			// moving shapes and obstacles
			for (let brick of this.bricks) {
				curCol = Shape.collisionDetection(ms, brick);
				if (curCol !== null) {
					collisions.push(curCol);
				}
			}
			// moving shapes and walls
			for (let wall of this.walls) {
				curCol = Shape.collisionDetection(ms, wall);
				if (curCol !== null) {
					collisions.push(curCol);
				}
			}
		}
		return collisions;
	}

	resolveCollisions(collisions) {
		for (let curCol of collisions) {
			curCol.resolve();
		}
	}

	removeDestroyedShapes() {
		let currentBrick = null;
		for (let i = this.bricks.length-1; i >= 0; i--) {
			currentBrick = this.bricks[i].shape;
			if (currentBrick.destructable && currentBrick.destroyFlag) {
				this.bricks.splice(i, 1);
			}
		}
		let currentWall = null;
		for (let i = this.walls.length-1; i >= 0; i--) {
			currentWall = this.walls[i].shape;
			if (currentWall.destructable && currentWall.destroyFlag) {
				this.walls.splice(i, 1);
			}
		}
	}

	checkGameOver() {
		if (this.freedomWall.shape.destroyFlag) {
			return WIN_FLAG;
		} 
		if (this.deathWall.shape.destroyFlag) {
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
		this.ball.render(ctx)
		for (let brick of this.bricks) {
			brick.render(ctx);
		}
		for (let wall of this.walls) {
			wall.render(ctx);
		}	
	}

	init() {
		// reset everything
		this.player = null;
		this.ball = null;
		this.bricks = [];
		this.walls = [];
		this.freedomWall = null;
		this.deathWall = null;

		this.initWalls();
		this.initBricks();
		this.initBall();
		this.initPlayers();
	}

	initPlayers() {
		var playerShape = new Rectangle(50, 5,
					new Point2D(200, 450),
					0,
					new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0,
					"green", "red");
		playerShape.setIndestructable();
		this.player = new Player(
			playerShape,
			150,
			2.5,
			this.pic);
	}

	initBall() {
		this.ball = new Ball(
			Materials.BRICK, 
			10, 
			new Point2D(200, 400), 
			new Vector2D(180, 180, VECTOR_FORMS.CARTESIAN));
	}

	level1Obstacles() {
		let rectangleArgs = {
			colliderType: 'rectangle',
			halfWidth: 15,
			halfLength: 8
		};
		let triangleArgs = {
			colliderType: 'triangle',
			halfDistance: 15
		};
		let circleArgs = {
			colliderType: 'circle', 
			radius: 13
		};
		let obs = []
		let currentBrick = null;
		// rectangles
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 3; j++) {
				if (i == 0 && j == 1) {
					currentBrick = new Brick(Materials.ADAMANTIUM, new Point2D(40*j + 25, 30*i + 20), circleArgs);
					obs.push(currentBrick);
					continue;
				}
				currentBrick = new Brick(Materials.BRICK, new Point2D(40*j + 25, 30*i + 20), rectangleArgs);
				obs.push(currentBrick);
			}
		}
		// triangles
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 3; j++) {
				if (i ==0 && j == 1) {
					currentBrick = new Brick(Materials.ADAMANTIUM, new Point2D(40*j + 290, 30*i + 20), circleArgs);
					obs.push(currentBrick);
					continue;
				}
				currentBrick = new Brick(Materials.STEEL, new Point2D(40*j + 290, 30*i + 20), triangleArgs);
				obs.push(currentBrick);
			}
		}

		// middle
		for (let i = 0; i < 8; i++) {
			currentBrick = new Brick(Materials.ADAMANTIUM, new Point2D(160, 30*i + 20), triangleArgs);
			obs.push(currentBrick);
			currentBrick = new Brick(Materials.ADAMANTIUM, new Point2D(200, 30*i + 20), rectangleArgs);
			obs.push(currentBrick);
			currentBrick = new Brick(Materials.ADAMANTIUM, new Point2D(240, 30*i + 20), circleArgs);
			obs.push(currentBrick);
		}
		return obs;
	}

	initBricks() {
		let l1shapes = this.level1Obstacles();
		for (let s of l1shapes) {
			this.bricks.push(s);
		}
	}

	initWalls() {
		// the walls are actually just long thin rectangles which
		// we collide with
		let leftWallShape = new Rectangle(5, WORLD_HEIGHT/2,
							new Point2D(0, WORLD_HEIGHT/2),
							0,
							new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0,
							"black", "black");
		let rightWallShape = new Rectangle(5, WORLD_HEIGHT/2,
							new Point2D(WORLD_WIDTH, WORLD_HEIGHT/2),
							0,
							new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0,
							"black", "black");
		let topWallShape = new Rectangle(WORLD_WIDTH/2, 5,
							new Point2D(WORLD_WIDTH/2, 0),
							0,
							new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0,
							"black", "black");
		let bottomWallShape = new Rectangle(WORLD_WIDTH/2, 5,
							new Point2D(WORLD_WIDTH/2, WORLD_HEIGHT),
							0,
							new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0,
							"black", "black");

		let leftPartitionShape = new Rectangle(5, WORLD_HEIGHT/4,
			new Point2D(WORLD_WIDTH/3, WORLD_HEIGHT/4),
			0,
			new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0,
			"black", "black");
		
		let rightPartitionShape = new Rectangle(5, WORLD_HEIGHT/4,
			new Point2D(WORLD_WIDTH*(2/3), WORLD_HEIGHT/4),
			0,
			new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 0,
			"black", "black");
		
		leftWallShape.setIndestructable();
		rightWallShape.setIndestructable();
		leftPartitionShape.setIndestructable();
		rightPartitionShape.setIndestructable();

		let leftWall = new Wall();
		let rightWall = new Wall();
		let topWall = new Wall();
		let bottomWall = new Wall();
		let leftPartition = new Wall();
		let rightPartition = new Wall();

		leftWall.shape = leftWallShape;
		rightWall.shape = rightWallShape;
		topWall.shape = topWallShape;
		bottomWall.shape = bottomWallShape;
		leftPartition.shape = leftPartitionShape;
		rightPartition.shape = rightPartitionShape;

		this.walls.push(leftWall)
		this.walls.push(rightWall);
		this.walls.push(topWall);
		this.walls.push(bottomWall);
		this.walls.push(leftPartition);
		this.walls.push(rightPartition);

		this.freedomWall = topWall;
		this.deathWall = bottomWall;
	}
}


export default World;