import CollidableObject from './CollidableObject';

class Ball extends CollidableObject {
    constructor() {
        super();
    }

    update(deltaT) {
        this.shape.update(deltaT);
    }
    
    reactToCollision(mtv, otherCollidable) {
        // add the TWICE the translation vector, as we are bouncing off! 
        this.shape.centre = this.shape.centre.toVector().add(mtv.scalarMultiply(2)).toPoint();
        // get the new velocity by reflecting across the mtv
        this.shape.tvelocity = this.shape.tvelocity.reflectAcross(mtv);
    }
}

export default Ball;