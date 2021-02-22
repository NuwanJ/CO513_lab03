const MOVE_INTERVAL = 100;
const SPEED = 10; // distance per 'MOVE_INTERVAL'

// let x, y, heading;
let config;

class User {
    constructor(id, simulator) {
        this.id = id;
        this.simulator = simulator;
        this._status = 'IDEAL';

        config = simulator.config;

        this.x = this.getRandomInt(config.width);
        this.y = this.getRandomInt(config.height);
        this.heading = this.getRandomInt(359); // [0,359]

        const loop = setInterval(() => {
            this.move();

            this.simulator.bs[0].rssi(this.x, this.y);
        }, MOVE_INTERVAL);
    }
    get getX() {
        return this.x;
    }

    get getY() {
        return this.y;
    }

    get status() {
        return this._status;
    }

    set status(s) {
        this._status = s;
    }

    move = () => {
        // Mobility Model: Moving toward a random direction
        // const dTheta = this.getRandomInt(30) - 15; // only 15 deg change at step
        const dx = SPEED * Math.cos(this.heading * (Math.PI / 180));
        const dy = SPEED * Math.cos(this.heading * (Math.PI / 180));

        this.x = this.coordinateLimit(this.x + dx, 0, config.width);
        this.y = this.coordinateLimit(this.y + dy, 0, config.height);

        // console.log(`${this.id} moving: (${x},${y}) ^${heading}`);
    };

    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    };

    coordinateLimit(coord, min, max) {
        if (coord < min) {
            // Hit the border > change heading
            this.heading = this.getRandomInt(360);
            return min;
        } else if (coord > max) {
            // Hit the border > change heading
            this.heading = this.getRandomInt(360);
            return max;
        }
        return Math.round(coord);
    }
}

module.exports = {
    User
};
