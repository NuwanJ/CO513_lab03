const MOVE_INTERVAL = 1000;
const SPEED = 100; // distance per 'MOVE_INTERVAL'

let x, y, heading;
let config;

class User {
    constructor(id, simulator) {
        this.id = id;
        this.simulator = simulator;
        config = simulator.config;

        x = this.getRandomInt(config.width);
        y = this.getRandomInt(config.height);
        heading = this.getRandomInt(359); // [0,359]

        const loop = setInterval(() => {
            this.move();

            this.simulator.bs[0].rssi(x, y);
        }, MOVE_INTERVAL);
    }

    move = () => {
        // Mobility Model: Moving toward a random direction
        // const dTheta = this.getRandomInt(30) - 15; // only 15 deg change at step
        const dx = SPEED * Math.cos(heading * (Math.PI / 180));
        const dy = SPEED * Math.cos(heading * (Math.PI / 180));

        x = this.coordinateLimit(x + dx, 0, config.width);
        y = this.coordinateLimit(y + dy, 0, config.height);

        console.log(`${this.id} moving: (${x},${y}) ^${heading}`);
    };

    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    };

    coordinateLimit(coord, min, max) {
        if (coord < min) {
            // Hit the border > change heading
            heading = this.getRandomInt(360);
            return min;
        } else if (coord > max) {
            // Hit the border > change heading
            heading = this.getRandomInt(360);
            return max;
        }
        return Math.round(coord);
    }
}

module.exports = {
    User
};
