import CollidableObject from './CollidableObject';
import Brick from './Brick';
import Wall from './Wall';
// player
class Player extends CollidableObject{
	constructor(shape, tspeed, rspeed, pic) {
		super();
		this.shape = shape;
		this.tspeed = tspeed;
		this.rspeed = rspeed;
		this.pic = pic;
	}
	
	update(deltaT) {
		if (this.pic.leftPressed == true) {
			this.shape.centre.x -= Math.abs(this.tspeed)*(deltaT/1000);
		}
		if (this.pic.rightPressed == true) {
			this.shape.centre.x += Math.abs(this.tspeed)*(deltaT/1000);
		}
		if (this.pic.upPressed == true) {
			this.shape.centre.y -= Math.abs(this.tspeed)*(deltaT/1000);
		}
		if (this.pic.downPressed == true) {
			this.shape.centre.y += Math.abs(this.tspeed)*(deltaT/1000);
		}
		if (this.pic.rotateClockwise == true) {
			this.shape.rotation += Math.abs(this.rspeed)*(deltaT/1000);
		}
		if (this.pic.rotateAntiClockwise == true) {
			this.shape.rotation -= Math.abs(this.rspeed)*(deltaT/1000);
		}
	}
	
	render(ctx) {
		this.shape.render(ctx);
	}

	reactToCollision(mtv, otherCollidable) {
		if (otherCollidable instanceof Brick || otherCollidable instanceof Wall) {
			this.shape.centre = this.shape.centre.toVector().add(mtv).toPoint();
		}
	}
}

export default Player;

