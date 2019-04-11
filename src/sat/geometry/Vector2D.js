import { EPS } from './constants';
import Point2D from './Point2D';

class Vector2D {
	constructor(a, b, type) {
		if (type == "polar") {
			this.r = a;
			this.theta = b;
			[this.x1, this.x2] = this.toCartesian();
			// compute again to get principal argument
			this.theta = this.computeTheta();
		} else {
			this.x1 = a;
			this.x2 = b;
			[this.r, this.theta] = this.toPolar();
		}
	}
	
	toPolar() {
		let r = this.magnitude();
		let theta = this.computeTheta();
		return [r, theta]; 
	}
	
	toCartesian() {
		let x1 = this.r*Math.cos(this.theta);
		let x2 = this.r*Math.sin(this.theta);
		return [x1, x2];
	}
	
	isZero() {
		return (Math.abs(this.x1)<EPS && Math.abs(this.x2)<EPS);
	}
	
	// reflect the vector accross another vector (the norm)
	reflectAcross(norm) {
		// this is from: http://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
		let nn = norm.getUnitVector();
		let scalingFactor = 2*this.dotProduct(nn);
		let reflectedVector = this.subtract(nn.scalarMultiply(scalingFactor));
		return reflectedVector;
	}
	
	equals(other) {
		return this.subtract(other).isZero();
	}
	
	// returns principal value i.e. theta element of (-pi, pi], 
	// of the angle between the vector and the positive x-axis
	computeTheta() {
		let phi = null;
		let theta = null;
		if (this.x1 == 0 || this.x2 == 0) {
			// we have at least one zero
			if (this.x1 == 0 && this.x2 != 0) {
				// x1 is zero and x2 not zero
				if (this.x2 > 0) {
					theta = Math.PI/2;
				} else {
					theta = -Math.PI/2;
				}
			} else if (this.x1 != 0 && this.x2 == 0) {
				// x1 is not zero and x2 is zero
				if (this.x1 > 0) {
					theta = 0;
				} else {
					theta = Math.PI;
				}
			} else {
				// both zero
				theta = 0;
			} 
		} else {
			// both x1 and x2 are non zero
			phi = Math.atan(Math.abs(this.x2)/Math.abs(this.x1));
			if (this.x1 > 0 && this.x2 > 0) {
				// first quadrant
				theta = phi;
			} else if (this.x1 < 0 && this.x2 > 0) {
				// second quadrant
				theta = Math.PI - phi;
			} else if (this.x1 < 0 && this.x2 < 0) {
				// third quadrant
				theta = -Math.PI + phi;
			} else if (this.x1 > 0 && this.x2 < 0) {
				// fourth quadrant
				theta = -phi;
			}
		}
		return theta;
	}
	
	// return a new vector
	add(v2) {
		let newx1 = this.x1 + v2.x1;
		let newx2 = this.x2 + v2.x2;
		return new Vector2D(newx1, newx2, "cartesian");
	}
	
	// return a new vector
	subtract(v2) {
		let newx1 = this.x1 - v2.x1;
		let newx2 = this.x2 - v2.x2;
		return new Vector2D(newx1, newx2, "cartesian");
	}
	
	// increase vector length by x
	extend(x) {
		return new Vector2D(this.r + Math.abs(x), this.theta, "polar");
	}
	
	// decrease vector length by x
	// if we decrease by more than the original vectors magnitude,
	// reverse the direction and extend
	withdraw(x) {
		return this.add(new Vector2D(x, this.theta, "polar").rotateVector(Math.PI));
	}
	
	scalarMultiply(x) {
		return new Vector2D(this.x1*x, this.x2*x, "cartesian");
	}
	
	// dot product of this vector with another vector
	dotProduct(v2) {
		return this.x1*v2.x1 + this.x2*v2.x2;
	}
	
	// magnitude of this vector
	magnitude() {
		return Math.sqrt(this.x1*this.x1 + this.x2*this.x2);
	}
	
	rotateVector(angle) {
		return new Vector2D(this.r, this.theta + angle, "polar");
	}
	
	// unit vector in direction of this vector
	getUnitVector() {
		let mag = this.magnitude();
		return new Vector2D(this.x1/mag, this.x2/mag, "cartesian");
	}
	
	// projection of this vector onto a vector in the direction of v2
	// formula from here: https://en.wikipedia.org/wiki/Vector_projection
	vectorProjection(v2) {
		var sp = this.scalarProjection(v2);
		return v2.getUnitVector().scalarMultiply(sp);
	}
	
	scalarProjection(v2) {
		return this.dotProduct(v2.getUnitVector());
	}
	
	toPoint() {
		return new Point2D(this.x1, this.x2);
	}
}

export default Vector2D;

