import { EPS } from './constants';
import Vector2D from './Vector2D';

class Point2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;	
	}

	getDistance(p2) {
		let dx = this.x - p2.x;
		let dy = this.y - p2.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	
	toVector() {
		return new Vector2D(this.x, this.y, "cartesian");
	}
	
	equals(other) {
		if (Math.abs(this.x - other.x)<EPS && 
			Math.abs(this.y - other.y)<EPS) {
			return true;
		} else {
			return false;
		}
	}
}

export default Point2D;