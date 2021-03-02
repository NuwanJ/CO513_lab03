const MOVE_INTERVAL = 500;
const SPEED = 50; // distance per 'MOVE_INTERVAL'

// let x, y, heading;
let config;

class User {
    constructor(id, simulator) {
        this.id = id;
        this.simulator = simulator;
        this._status = 'IDEAL';
        this._baseStationId = null;
        this._inCall = false;
        this.connected = false;

        config = simulator.config;

        this.x = this.getRandomInt(config.width);
        this.y = this.getRandomInt(config.height);
        this.heading = this.getRandomInt(359); // [0,359]

        // console.log(id, this.heading);

        const loop = setInterval(() => {
            this.move();
            this.updateStatus();
        }, MOVE_INTERVAL);
    }

    updateStatus = () => {
        // Calculate RSSI and find the best Base station
        let dist = [];
        let minDist = Number.NEGATIVE_INFINITY;

        if (this._baseStationId != null) {
            // If connected to a BS, lets check signal strength and
            // disconnect from it if it is so far
            const distForCurrentBS = this.simulator.bs[this._baseStationId].dist(
                this.x,
                this.y
            );
            if (distForCurrentBS > this.simulator.bs[this._baseStationId].txDist) {
                // To far, disconnect
                this.simulator.bs[this._baseStationId].disconnect(this.id);
                // console.log(`${this.id} disconnected from ${this._baseStationId}`);
                this._baseStationId == null;
                this.connected = false;
                this._inCall = false; // cut the call
            }
        }

        if (this.connected == false) {
            // Not connected to any BS. Lets try to connect
            for (let i = 0; i < this.simulator.config.bs.length; i++) {
                dist[i] = this.simulator.bs[i].dist(this.x, this.y);

                if (dist[i] < this.simulator.bs[i].txDist) {
                    // Try to connect, First found, first try
                    if (this.simulator.bs[i].connect(this.id) === true) {
                        // Connected
                        // console.log(dist[i], this.simulator.bs[i].txDist);
                        // console.log(`${this.id} connected to  ${i}`);
                        this.connected = true;
                        this._baseStationId = i;
                        break;
                    }
                    // minDist = dist[i];
                    // bestBS = i;
                }
            }
        }

        // console.log(rssi, 'Connect:', bestBS, sinr);
    };

    findSINR = (rssi) => {
        let sinr = [];
        let sum = 0;

        // SINR = RSSI - avg(RSSI), since RSSI is a log scale
        for (let i = 0; i < rssi.length; i++) {
            sum += rssi[i];
        }

        let noise = sum / rssi.length;

        for (let i = 0; i < rssi.length; i++) {
            sinr[i] = Math.round((rssi[i] - noise) * 100) / 100;
        }

        return sinr;
    };

    move = () => {
        // Mobility Model: Moving toward a random direction
        // const dTheta = this.getRandomInt(30) - 15; // only 15 deg change at step
        const dx = SPEED * Math.cos(this.heading * (Math.PI / 180));
        const dy = SPEED * Math.sin(this.heading * (Math.PI / 180));

        this.x = this.coordinateLimit(this.x + dx, 0, config.width);
        this.y = this.coordinateLimit(this.y + dy, 0, config.height);

        // console.log(`${this.id} moving: (${x},${y}) ^${heading}`);
    };

    getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
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

    get inCall() {
        return this._inCall;
    }
    set inCall(s) {
        this._inCall = s;
    }

    get connectWith() {
        return this._baseStationId;
    }
    set connectWith(bs) {
        this._baseStationId = bs;
    }
}

module.exports = {
    User
};
