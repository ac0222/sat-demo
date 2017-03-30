// player
var Player = function(shape, tspeed, rspeed, pic) {
	this.shape = shape;
	this.tspeed = tspeed;
	this.rspeed = rspeed;
	this.pic = pic;
}

Player.prototype.update = function(deltaT) {
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

Player.prototype.render = function(ctx) {
	this.shape.render(ctx);
}