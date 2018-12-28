///////////////////////////////////////
// RenderableAsteroid
//

const MIN_ASTEROID_RADIUS = 4;
const NUMBER_OF_PARTS = 3;

class RenderableAsteroid extends Renderable {

    constructor(dRadius, vectorPosition, vectorVelocity) {

        super(dRadius, 
            vectorPosition, 
            vectorVelocity);
    }

    get type() {

        return "RenderableAsteroid";
    }

    get color() {

        return "gray";
    }

    destroy(objectCollidee) {

        try {

            for (let i = 0; i < NUMBER_OF_PARTS; i++) {

                const dNewRadius = this.radius * Math.random() / Math.sqrt(NUMBER_OF_PARTS);
                if (dNewRadius > MIN_ASTEROID_RADIUS) {

                    const vectorSpread = new Vector(Math.cos(i * 2 * Math.PI / NUMBER_OF_PARTS),
                        Math.sin(i * 2 * Math.PI / NUMBER_OF_PARTS));
                    const vectorVelocity = new Vector(this.velocity.x + vectorSpread.x * this.radius,
                        this.velocity.y + vectorSpread.y * this.radius);
                    const vectorPosition = new Vector(this.position.x + vectorSpread.x * this.radius,
                        this.position.y + vectorSpread.y * this.radius);

                    this.tut.asteroidCreationCount++;
                    if (this.tut.asteroidCreationCount < 10) {

                        const raNew = new RenderableAsteroid(dNewRadius,
                            vectorPosition,
                            vectorVelocity);
                        raNew.tut = this.tut;
                        this.tut.renderables.push(raNew);
                    }
                }
            }

            return null;
        } catch (x) {

            return x;
        }
    }
}