class Collision {
    constructor(collider1, collider2, mtv) {
        this.collider1 = collider1;
        this.collider2 = collider2;
        this.mtv = mtv;
    }

    resolve() {
        this.collider1.reactToCollision(this.mtv, this.collider2);
        this.collider2.reactToCollision(this.mtv.scalarMultiply(-1), this.collider1);
    }
}

export default Collision;