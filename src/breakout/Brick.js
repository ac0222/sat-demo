import CollidableObject from './CollidableObject';
import Ball from './Ball';
import Vector2D from '../sat/geometry/Vector2D';
import { VECTOR_FORMS } from '../sat/geometry/constants';
import Rectangle from '../sat/geometry/Rectangle';
import Circle from '../sat/geometry/Circle';
import Triangle from '../sat/geometry/Triangle';
import Materials from './Materials';

class Brick extends CollidableObject {
    constructor(material, centre, colliderArgs) {
        super();
        this.material = material;
        this.setShape(centre, colliderArgs);
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

    setShape(centre, colliderArgs) {
        if (colliderArgs.colliderType === "rectangle") {
            this.shape = new Rectangle(
                colliderArgs.halfWidth,
                colliderArgs.halfLength, 
                centre,
                0,
                new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 
                0, 
                "yellow", 
                "red");
        } else if (colliderArgs.colliderType === "triangle") {
            this.shape = new Triangle(
                colliderArgs.halfDistance, 
                centre,
                0,
                new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 
                0, 
                "yellow", 
                "red");
        } else {
            this.shape = new Circle(
                colliderArgs.radius, 
                centre,
                0,
                new Vector2D(0, 0, VECTOR_FORMS.CARTESIAN), 
                0, 
                "yellow", 
                "red");
        }  
    }

    reactToCollision(mtv, otherCollidable) {
        if (otherCollidable instanceof Ball && 
            otherCollidable.material >= this.material){
            this.shape.destroyFlag = true;
        }
    }
}

export default Brick;