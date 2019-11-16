import CollidableObject from './CollidableObject';
import Ball from './Ball';

class Wall extends CollidableObject {
    constructor() {
        super();
    }

    reactToCollision(mtv, otherCollidable) {
        if (otherCollidable instanceof Ball && this.shape.destructable == true) {
            this.shape.destroyFlag = true;
        }
    }
}

export default Wall;