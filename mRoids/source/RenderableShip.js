///////////////////////////////////////
// RenderableShip
//

const SHIP_SPIRE_LENGTH = 50;
const SHIP_ROTATE_RADIANS_STEP = 2 * Math.PI / 16;
const SHIP_ACCELERATION_FACTOR = 50;
const SHIP_BULLET_SPEED = 500;
const MAX_SHIP_VELOCITY_MAGNITUDE = 750;

class RenderableShip extends Renderable {

    constructor(dRadius, vectorPosition, vectorVelocity) {

        super(dRadius, 
            vectorPosition, 
            vectorVelocity);

        this.heading = 0;
    }

    get type() {

        return "RenderableShip";
    }

    innerRender() {

        this.tut.context.beginPath();
        this.tut.context.moveTo(this.position.x,
            this.position.y);
        this.tut.context.lineTo(this.position.x + SHIP_SPIRE_LENGTH * Math.cos(this.heading),
            this.position.y + SHIP_SPIRE_LENGTH * Math.sin(this.heading));
        this.tut.context.strokeStyle = "white";
        this.tut.context.lineWidth = 8;
        this.tut.context.stroke();
        this.tut.context.lineWidth = 1;
    }

    get heading() {

        return this.m_dHeading;
    }
    set heading(dValue) {

        this.m_dHeading = dValue;
    }

    create() {

        try {

            // Attach keyboard handling events.
            this.keyHandler = this.onKey.bind(this);
            window.addEventListener("keydown", 
                this.keyHandler);

            this.createTime = (new Date()).getTime();

            return null;
        } catch (x) {

            return x;
        }
    }

    destroy(objectCollidee) {

        try {

            console.log(`Ship blown up by: ${objectCollidee.type}.`);

            // Disconnect keyboard handling events.
            window.removeEventListener("keydown", 
                this.keyHandler);

            // .
            this.tut.notHavingPlacedTheShip = true;
            this.tut.totalDuration = 0;
            this.tut.theFirstNowMS = null;
            this.tut.theShip = null;
            this.tut.theScore = this.score;

            return null;
        } catch (x) {

            return x;
        }
    }

    get score() {

        return parseInt(
                ( 
                    (
                        (
                            new Date()
                        ).getTime() 
                        - 
                        this.createTime 
                    )
                    /
                    1000
                ).toFixed(0)
            );
    }

    onKey(e) {

        try {

            this.tut.notHavingTypedAKey = false;

            if (e.key === "ArrowLeft") {

                // Rotate counter-clockwise
                this.heading -= SHIP_ROTATE_RADIANS_STEP;
            } else if (e.key === "ArrowRight") {

                // Rotate clockwise
                this.heading += SHIP_ROTATE_RADIANS_STEP;
            } else if (e.key === "ArrowUp") {

                // Accelerate
                this.velocity = new Vector(this.velocity.x + SHIP_ACCELERATION_FACTOR * Math.cos(this.heading),
                    this.velocity.y + SHIP_ACCELERATION_FACTOR * Math.sin(this.heading));
            } else if (e.key === "ArrowDown") {

                // Accelerate
                this.velocity = new Vector(this.velocity.x - SHIP_ACCELERATION_FACTOR * Math.cos(this.heading),
                    this.velocity.y - SHIP_ACCELERATION_FACTOR * Math.sin(this.heading));
            } else if (e.key === " ") {

                // Fire
                const vectorPosition = new Vector(this.position.x + (this.radius + 10 + Math.abs(this.velocity.x * this.frameMS / 1000)) * Math.cos(this.heading), 
                    this.position.y + (this.radius + 10 + Math.abs(this.velocity.y * this.frameMS / 1000)) * Math.sin(this.heading));

                const vectorHeading = new Vector(SHIP_BULLET_SPEED * Math.cos(this.heading),
                    SHIP_BULLET_SPEED * Math.sin(this.heading));
                const vectorVelocity = new Vector(this.velocity.x + vectorHeading.x,
                    this.velocity.y + vectorHeading.y);

                const rbNew = new RenderableBullet(4, 
                    vectorPosition,
                    vectorVelocity);
                rbNew.tut = this.tut;
                this.tut.renderables.push(rbNew);
            } else if (e.key === "LeftShift") {

                // Shield
            }
        } catch (x) {

            alert(x.message);
        }
    }

    innerUpdate() {

        if (this.velocity.magnitude > MAX_SHIP_VELOCITY_MAGNITUDE) {

            this.velocity = new Vector(this.velocity.x / this.velocity.magnitude * MAX_SHIP_VELOCITY_MAGNITUDE,
                this.velocity.y / this.velocity.magnitude * MAX_SHIP_VELOCITY_MAGNITUDE);
        }
    }

    get color() {

        return "green";
    }
}