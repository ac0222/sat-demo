// circle class
var Circle = function(radius, centre, rotation, 
	tvel, rspeed, collisionType, c1, c2) {
	Shape.call(this, centre, rotation, c1, c2, "circle", 
		tvel, rspeed, collisionType);
	this.radius = radius;
}

// inheritance
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function(ctx) {
	Shape.renderCircle(this.radius, this.centre, ctx, this.activeColour);
}

Circle.prototype.equals = function(other) {
	if (!Shape.prototype.equals.call(this, other)) {
		return false;
	}
	if (Math.abs(this.radius - other.radius) > EPS) {
		return false;
	}
	return true;
}