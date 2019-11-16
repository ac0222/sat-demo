// circle class
import { EPS, SHAPE_TYPES } from './constants';
import Shape from './Shape';

class Circle extends Shape {
	constructor(radius, centre, rotation, 
		tvel, rspeed, collisionType, c1, c2) {
		super(centre, rotation, c1, c2, SHAPE_TYPES.CIRCLE, 
			tvel, rspeed, collisionType);
		this.radius = radius;
	}

	render(ctx) {
		Shape.renderCircle(this.radius, this.centre, ctx, this.activeColour);
	}

	equals(other) {
		if (!Shape.prototype.equals.call(this, other)) {
			return false;
		}
		if (Math.abs(this.radius - other.radius) > EPS) {
			return false;
		}
		return true;
	}
}

export default Circle;