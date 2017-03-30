var Triangle = function(halfDistance, centre, 
	rotation, tvel, rspeed, collisionType, c1, c2) {
	Shape.call(this, centre, rotation, c1, c2, "polygon", 
		tvel, rspeed, collisionType);
	this.halfDistance = halfDistance;
}

//inheritance
Triangle.prototype = Object.create(Shape.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.getVertices = function() {
	var vertices = [];
	var h1 = new Vector2D(this.halfDistance, this.rotation, "polar");
	var h2 = new Vector2D(this.halfDistance, this.rotation + (2/3)*Math.PI, "polar");
	var h3 = new Vector2D(this.halfDistance, this.rotation + (4/3)*Math.PI, "polar");

	// represent centre as a position vector
	var ctv = new Vector2D(this.centre.x, this.centre.y, "cartesian");

	// compute vertices clockwise (in terms of the cartesian plane,
	// with y axis inverted (as it is in canvas))
	vertices[0] = ctv.add(h1);
	vertices[1] = ctv.add(h2);
	vertices[2] = ctv.add(h3);

	return vertices;
}

Triangle.prototype.render = function(ctx) {
	Shape.renderPolygon(this.getVertices(), ctx, this.activeColour);
}

Triangle.prototype.equals = function(other) {
	if (!Shape.prototype.equals.call(this, other)) {
		return false;
	}
	if (Math.abs(this.halfDistance - other.halfDistance) > EPS) {
		return false;
	}
	return true;
}