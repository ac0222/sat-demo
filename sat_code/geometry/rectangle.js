// rectangle class
var Rectangle = function(halfWidth, halfHeight, centre, 
	rotation, tvel, rspeed, collisionType, c1, c2) {
	Shape.call(this, centre, rotation, c1, c2, "polygon", 
		tvel, rspeed, collisionType);
	this.halfWidth = halfWidth;
	this.halfHeight = halfHeight;
}

// inheritance
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getVertices = function() {
	var vertices = [];
	var hwv = new Vector2D(this.halfWidth, this.rotation, "polar");
	var hhv = new Vector2D( this.halfHeight, this.rotation + Math.PI/2, "polar");
	// represent centre as a position vector
	var ctv = new Vector2D(this.centre.x, this.centre.y, "cartesian");

	// compute vertices clockwise (in terms of the cartesian plane,
	// with y axis inverted (as it is in canvas))
	vertices[0] = ctv.add(hwv).add(hhv);
	vertices[1] = ctv.subtract(hwv).add(hhv);
	vertices[2] = ctv.subtract(hwv).subtract(hhv);
	vertices[3] = ctv.add(hwv).subtract(hhv);

	return vertices;
}

Rectangle.prototype.render = function(ctx) {
	Shape.renderPolygon(this.getVertices(), ctx, this.activeColour);
}

Rectangle.prototype.equals = function(other) {
	if (!Shape.prototype.equals.call(this, other)) {
		return false;
	}
	if (Math.abs(this.halfwidth - other.halfWidth) > EPS) {
		return false
	}
	if (Math.abs(this.halfHeight - other.halfHeight) > EPS) {
		return false
	}
	return true
}