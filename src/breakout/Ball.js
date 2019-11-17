import CollidableObject from './CollidableObject';
import Materials from './Materials';
import Circle from '../sat/geometry/Circle';

class Ball extends CollidableObject {
    constructor(material, radius, centre, tvel) {
        super();
        this.material = material;
        this.shape = new Circle(
            radius, 
			centre,
			0,
            tvel, 
            0, 
            "yellow", 
            "red");
        this.shape.setIndestructable();
        this.setColours();
    }

    setColours() {
        let c1 = null;
        let c2 = null;
        if (this.material === Materials.BRICK) {
            c1 = "red";
            c2 = "red";
        } else if (this.material === Materials.STEEL) {
            c1 = "black"
            c2 = "black"
        } else if (this.material === Materials.ADAMANTIUM) {
            c1 = "blue";
            c2 = "blue";
        } else {
            c1 = "yellow";
            c2 = "yellow";
        }
        this.shape.c1 = c1;
        this.shape.activeColour = c1;
        this.shape.c2 = c2;
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