// rectangle class
import { EPS, SHAPE_TYPES } from './constants';
import Vector2D from './Vector2D';
import Shape from './Shape';

class Rectangle extends Shape {
	constructor(halfWidth, halfHeight, centre, 
		rotation, tvel, rspeed, collisionType, c1, c2) {
		super(centre, rotation, c1, c2, SHAPE_TYPES.POLYGON, 
			tvel, rspeed, collisionType);
		this.halfWidth = halfWidth;
		this.halfHeight = halfHeight;
	}

	getVertices() {
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

	render(ctx) {
		Shape.renderPolygon(this.getVertices(), ctx, this.activeColour);
	}

	equals(other) {
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
}

export default Rectangle;
