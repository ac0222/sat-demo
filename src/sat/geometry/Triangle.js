import { EPS, SHAPE_TYPES, VECTOR_FORMS } from './constants';
import Vector2D from './Vector2D';
import Shape from './Shape';

class Triangle extends Shape{
	constructor(halfDistance, centre, 
		rotation, tvel, rspeed, collisionType, c1, c2) {
		super(centre, rotation, c1, c2, SHAPE_TYPES.POLYGON, 
			tvel, rspeed, collisionType);
		this.halfDistance = halfDistance;
	}

	getVertices() {
		var vertices = [];
		var h1 = new Vector2D(this.halfDistance, this.rotation, VECTOR_FORMS.POLAR);
		var h2 = new Vector2D(this.halfDistance, this.rotation + (2/3)*Math.PI, VECTOR_FORMS.POLAR);
		var h3 = new Vector2D(this.halfDistance, this.rotation + (4/3)*Math.PI, VECTOR_FORMS.POLAR);

		// represent centre as a position vector
		var ctv = new Vector2D(this.centre.x, this.centre.y, VECTOR_FORMS.CARTESIAN);

		// compute vertices clockwise (in terms of the cartesian plane,
		// with y axis inverted (as it is in canvas))
		vertices[0] = ctv.add(h1);
		vertices[1] = ctv.add(h2);
		vertices[2] = ctv.add(h3);

		return vertices;
	}

	render(ctx) {
		Shape.renderPolygon(this.getVertices(), ctx, this.activeColour);
	}

	equals(other) {
		if (!Shape.prototype.equals.call(this, other)) {
			return false;
		}
		if (Math.abs(this.halfDistance - other.halfDistance) > EPS) {
			return false;
		}
		return true;
	}
}

export default Triangle;
