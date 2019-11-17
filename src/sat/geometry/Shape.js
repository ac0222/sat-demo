// shape super class
import { 
	EPS, 
	SHAPE_TYPES, 
	VECTOR_FORMS 
} from './constants';
import Interval from './Interval';
import Point2D from './Point2D';
import Vector2D from './Vector2D';
import Collision from './Collision';

class Shape {
	constructor(centre, rotation, c1, c2, shapeType, 
		tvelocity, rspeed) {
		this.centre = centre;
		this.rotation = rotation;
		this.c1 = c1;
		this.c2 = c2;
		this.activeColour = this.c1;
		this.shapeType = shapeType;
		this.tvelocity = tvelocity;
		this.rspeed = rspeed;
		//this.collisionType = collisionType;
		this.hitCounter = 0;
		this.destroyFlag = false;
		this.destructable = true;
	}
	
	equals(other) {
		if (!this.centre.equals(other.centre)) {
			return false;
		} 
		if (Math.abs(this.rotation - other.rotation) > EPS) {
			return false;
		}
		if (this.c1!=other.c1 || this.c2!=other.c2) {
			return false;
		}
		if (this.shapeType != other.shapeType) {
			return false;
		}
		if (!this.tvelocity.equals(other.tvelocity)) {
			return false;
		}
		if (Math.abs(this.rspeed - other.rspeed) > EPS) {
			return false;
		}
		// if (this.collisionType != other.collisionType) {
		// 	return false;
		// }
		return true;
	}
	
	setIndestructable() {
		this.destructable = false;
	}
	
	enterCollisionState() {
		this.activeColour = this.c2;
	}
	
	exitCollisionState() {
		this.activeColour = this.c1;
	}
	
	isActive() {
		if (this.tvelocity.isZero()==false || this.rspeed != 0) {
			return true;
		} else {
			return false;
		}
	}
	
	move(deltaT) {
		this.centre.x += this.tvelocity.x1*(deltaT/1000);
		this.centre.y += this.tvelocity.x2*(deltaT/1000);
		this.rotation += this.rspeed*(deltaT/1000);
	}
	
	update(deltaT) {
		if (this.isActive()) {
			this.move(deltaT);
		}
	}
	
	// reactToCollision(mtv, destroyFlag) {
	// 	if (this.collisionType == COLLISION_TYPES.BOUNCE) {
	// 		// add the TWICE the translation vector, as we are bouncing off! 
	// 		this.centre = this.centre.toVector().add(mtv.scalarMultiply(2)).toPoint();
	// 		// get the new velocity by reflecting across the mtv
	// 		this.tvelocity = this.tvelocity.reflectAcross(mtv);
	
	// 	} else if (this.collisionType == COLLISION_TYPES.STICK) {
	// 		this.centre = this.centre.toVector().add(mtv).toPoint();
	
	// 	} else if (this.collisionType == COLLISION_TYPES.STATIC) {
	// 		// do nothing
	
	// 	} else {
	// 		console.log("unrecognized collision type of shape");
	// 	}
	// 	this.destroyFlag = destroyFlag;
	// 	this.hitCounter++;
	// }
	
	// A bunch of class methods
	static getEdgeVectors(vertices) {
		let evs = [];
		let i = 0;
		while (i < vertices.length-1) {
			evs[i] = vertices[i+1].subtract(vertices[i]);
			i++;
		}
		evs[i] = vertices[0].subtract(vertices[i]);
		return evs;
	}
	
	// the orthogonals computed all face 'outwards' from the polygon
	static getEdgeOrthogonals(vertices) {
		let evs = Shape.getEdgeVectors(vertices);
		let ovs = [];
		for (let i = 0; i < evs.length; i++) {
			ovs[i] = evs[i].rotateVector(-Math.PI/2);
		}
		return ovs;
	}
	
	// rendering
	static renderPolygon(vertices, ctx, fillStyle) {
		ctx.beginPath();
		ctx.moveTo(vertices[0].x1, vertices[0].x2);
		for (let i = 1; i < vertices.length; i++) {
			ctx.lineTo(vertices[i].x1, vertices[i].x2);
		}
		ctx.lineTo(vertices[0].x1, vertices[0].x2);
		ctx.fillStyle = fillStyle;
		ctx.fill();
		ctx.closePath();
	}
	
	static renderCircle(radius, centre, ctx, fillStyle) {
		ctx.beginPath();
		ctx.arc(centre.x, centre.y, radius, 0, Math.PI*2);
		ctx.fillStyle = fillStyle;
		ctx.fill();
		ctx.closePath();
	}
	
	// Collision detection functions
	static projectShapeFromPoint(shape, point, direction) {
		let scalarProjections = [];
		if (shape.shapeType == SHAPE_TYPES.CIRCLE) {
			let circCentre = new Vector2D(shape.centre.x, shape.centre.y, VECTOR_FORMS.CARTESIAN);
			let centreToPoint = circCentre.subtract(point);
			scalarProjections.push(
				centreToPoint.scalarProjection(direction) - shape.radius);
			scalarProjections.push(
				centreToPoint.scalarProjection(direction) + shape.radius);
		} else if (shape.shapeType == SHAPE_TYPES.POLYGON) {
			let polyVecs = [];
			let polyVertices = shape.getVertices();
			for (let i = 0; i < polyVertices.length; i++) {
				polyVecs[i] = polyVertices[i].subtract(point);
			}
			for (let i = 0; i < polyVecs.length; i++) {
				scalarProjections.push(
					polyVecs[i].scalarProjection(direction));
			}
		} else {
			console.log("unrecognized shape type");
			scalarProjections = null;
		}
		return scalarProjections;
	}
	
	// Collision detection between two convex polygons
	static ppCollisionDetection(poly1, poly2) {
		var poly1Centre = poly1.centre.toVector();
		var poly2Centre = poly2.centre.toVector();
		var distanceBetweenCentres = poly1Centre.subtract(poly2Centre).magnitude();
		var poly1Vertices = poly1.getVertices();
		var poly2Vertices = poly2.getVertices();
		var directions = Shape.getEdgeOrthogonals(poly1Vertices).concat(
			Shape.getEdgeOrthogonals(poly2Vertices));
	
		var overlapInfo = null;
		var mtvSize = Number.MAX_VALUE;
		var mtvIndex = -1; 
		var mtv = null;
		var poly1sps = [];
		var poly2sps = [];
		var currentDirection = null;
		var poly1Interval = null;
		var poly2Interval = null;
	
		for (var i = 0; i < directions.length; i++) {
			currentDirection = directions[i];
			poly1sps = Shape.projectShapeFromPoint(poly1, 
				poly1Centre, currentDirection);
			poly2sps = Shape.projectShapeFromPoint(poly2, 
				poly1Centre, currentDirection);
			poly1Interval = new Interval(Math.min.apply(Math, poly1sps),
				Math.max.apply(Math, poly1sps));
			poly2Interval = new Interval(Math.min.apply(Math, poly2sps),
				Math.max.apply(Math, poly2sps));
	
			overlapInfo = poly1Interval.getOverlapInfo(poly2Interval);
			if (overlapInfo == null) {
				return null
			} else {
				if (overlapInfo.osize < mtvSize) {
					mtvSize = overlapInfo.osize;
					mtvIndex = i;
				}
			}
		}
		// no gaps found
		mtv = directions[mtvIndex].getUnitVector().scalarMultiply(mtvSize);
		if (poly1Centre.add(mtv).subtract(poly2Centre).magnitude() > 
			distanceBetweenCentres) {
			// after we move along the mtv, the centres should be further away
			mtv = mtv;
		} else {
			mtv = mtv.scalarMultiply(-1);
		}
		// returns mtv needed to move polygon1!!!! the mtv to move polygon2 will
		// be the negative vector returned here!
		return new Collision(poly1, poly2, mtv);
		
	}
	
	// Collision detection between polygon and circle
	static pcCollisionDetection(poly, circ) {
		var polyVertices = poly.getVertices();
		var polyCentre = poly.centre.toVector();
		var circCentre = circ.centre.toVector();
		var directions = Shape.getEdgeOrthogonals(polyVertices);
		var pcToCc = circCentre.subtract(polyCentre);
		var distances = [];
	
		// bonus direction! Its the vector from  [the vertex closest
		// to the centre of the circle], to [the centre of the circle]
		for (var i = 0; i < polyVertices.length; i++) {
			distances[i] = circCentre.subtract(polyVertices[i]).magnitude();
		}
		var maxIndex = distances.indexOf(Math.max.apply(Math, distances));
		directions.push(circCentre.subtract(polyVertices[maxIndex]));
	
		var overlapInfo = null;
		var mtvSize = Number.MAX_VALUE;
		var mtvIndex = -1; 
		var mtv = null;
		var polyInterval = null;
		var circInterval = null;
	
		var polysps = [];
		var circsps = [];
		
		for (var i = 0; i < directions.length; i++) {
			polysps = Shape.projectShapeFromPoint(poly, polyCentre, directions[i]);
			circsps = Shape.projectShapeFromPoint(circ, polyCentre, directions[i]);
			polyInterval = new Interval(Math.min.apply(Math, polysps), 
				Math.max.apply(Math, polysps));
			circInterval = new Interval(Math.min.apply(Math, circsps),
				Math.max.apply(Math, circsps));
	
			overlapInfo = polyInterval.getOverlapInfo(circInterval);
			if (overlapInfo == null) {
				return null;
			} else {
				if (overlapInfo.osize < mtvSize) {
					mtvSize = overlapInfo.osize;
					mtvIndex = i;
				}
			}
		}
	
		mtv = directions[mtvIndex].getUnitVector().scalarMultiply(mtvSize);
		if (polyCentre.add(mtv).subtract(circCentre).magnitude() > 
			pcToCc.magnitude()) {
			// after we move along the mtv, the centres should be further away
			mtv = mtv;
		} else {
			mtv = mtv.scalarMultiply(-1);
		}
		return new Collision(poly, circ, mtv);
	}
	
	// collision detection between 2 circles
	static ccCollisionDetection(circ1, circ2) {
		var circ1Centre = circ1.centre.toVector();
		var circ2Centre = circ2.centre.toVector();
		var c2c = circ2Centre.subtract(circ1Centre);
		var overlap = circ1.radius + circ2.radius - c2c.magnitude();
		var mtv = null;
		if (overlap > 0) {
			// the mtv is always the vector between the circle centres
			mtv = c2c.getUnitVector().scalarMultiply(overlap);
			if (circ1Centre.add(mtv).subtract(circ2Centre).magnitude >
				c2c.magnitude()) {
				// after we move along mtv, the centres should be further away
				mtv = mtv;
			} else {
				mtv = mtv.scalarMultiply(-1);
			}
			return new Collision(circ1, circ2, mtv);
		} else {
			return null;
		}
	}

	static collisionDetection(obj1, obj2, opts) {
		let shape1 = null;
		let shape2 = null;
		let collision = null;
		
		if (opts && opts.inputType === 'shape') {
			shape1 = obj1;
			shape2 = obj2;
		} else {
			shape1 = obj1.shape;
			shape2 = obj2.shape;
		}

		if ((shape1.shapeType === SHAPE_TYPES.CIRCLE) &&
		(shape2.shapeType === SHAPE_TYPES.CIRCLE)) {
			collision = this.ccCollisionDetection(shape1, shape2)
		} else if ((shape1.shapeType === SHAPE_TYPES.POLYGON) &&
		(shape2.shapeType === SHAPE_TYPES.POLYGON)) {
			collision = this.ppCollisionDetection(shape1, shape2);
		} else {
			if (shape1.shapeType === SHAPE_TYPES.POLYGON) {
				// shape2 must be the circle
				collision = this.pcCollisionDetection(shape1, shape2);
			} else {
				// shape1 must be the circle, so shape2 must be the polygon
				collision = this.pcCollisionDetection(shape2, shape1);
			}
		}
		if (collision) {
			if (collision.collider1.equals(shape1)) {
				return new Collision(obj1, obj2, collision.mtv);
			} else {
				return new Collision(obj2, obj1, collision.mtv);
			}
		} else {
			return null;
		}
	}
}

export default Shape;

