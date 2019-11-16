import CollidableObject from './CollidableObject';
import Ball from './Ball';

class Brick extends CollidableObject {
    constructor() {
        super();
    }

    reactToCollision(mtv, otherCollidable) {
        if (otherCollidable instanceof Ball){
            this.shape.destroyFlag = true;
        }
    }
}

export default Brick;