class CollidableObject {
    constructor() {
        this.shape = null;
    }

    addShape(shape) {
        this.shape = shape;
    }

    reactToCollision(mtv, otherCollidable) {
        console.log('implement me!');
    }
}

export default CollidableObject;