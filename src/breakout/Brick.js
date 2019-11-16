import CollidableObject from './CollidableObject';
import Ball from './Ball';

class Brick extends CollidableObject {
    constructor(material) {
        super();
        this.material = material;
    }

    reactToCollision(mtv, otherCollidable) {
        if (otherCollidable instanceof Ball && 
            otherCollidable.material >= this.material){
            this.shape.destroyFlag = true;
        }
    }
}

export default Brick;