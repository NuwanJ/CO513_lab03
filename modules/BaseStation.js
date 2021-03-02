const fC = 1800; // in MHz
const TX_POWER = 10;
const MAX_USERS = 20;

const log10 = Math.log10;

class BaseStation {
    constructor(id, x, y, users) {
        // console.log(`id:${id} | x:${x} y:${y}`);
        this.loc = { x: x, y: y };
        this.users = 0;
        this.txDist = 5000; // TODO: calculate this
    }

    rssi = (x, y) => {
        // Free-space path loss in decibels
        // https://en.wikipedia.org/wiki/Free-space_path_loss

        const dist = this.dist(x, y);
        const loss = 20 * log10(fC) + 20 * log10(dist) - 27.55;
        const rssi = Math.round((TX_POWER - loss) * 100) / 100;
        // console.log(`\t dist: ${dist}m, loss: ${loss}dB, RSSI: ${rssi}`);

        return rssi;
    };

    dist = (x, y) => {
        return Math.round(
            Math.sqrt(Math.pow(x - this.loc.x, 2) + Math.pow(y - this.loc.y, 2))
        );
    };

    get location() {
        return this.loc;
    }

    connect = (user_id) => {
        if (this.users < MAX_USERS) {
            this.users += 1;
            return true;
        }
        return false;
    };

    disconnect = (user_id) => {
        this.users -= 1;
    };
}

module.exports = {
    BaseStation
};
