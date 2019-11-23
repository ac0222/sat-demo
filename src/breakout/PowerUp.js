import Brick from './Brick';
import Materials from './Materials';
import Ball from './Ball';

class PowerUp extends Brick {
    constructor(centre, colliderArgs) {
        super(Materials.BRICK, centre, colliderArgs);
    }

    reactToCollision(mtv, otherCollidable) {
        if (otherCollidable instanceof Ball){
            this.shape.destroyFlag = true;
            otherCollidable.upgrade();
        }
    }
}

export default PowerUp;