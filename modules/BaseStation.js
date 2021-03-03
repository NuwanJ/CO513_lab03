const fC = 1800; // in MHz
const TX_POWER = 5; // in dBm
const MAX_USERS = 20;

const log10 = Math.log10;

class BaseStation {
    constructor(id, x, y, users) {
        // console.log(`id:${id} | x:${x} y:${y}`);
        this.id = id;
        this.loc = { x: x, y: y };
        this.users = 0;

        // Max possible transmission distance if RSSI should be greater than -110 dB
        this.txDist = Math.pow(10, (TX_POWER + 110 + 27.5) / 20) / fC;
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

    // sinr = (id, rssi) => {
    //     let sum = rssi.reduce((a, b) => a + b);
    //     let sinr = [];
    //     for (let i = 0; i < rssi.length; i++) {
    //         sinr[i] = Math.round((rssi[id] / (sum - rssi[id])) * 100) / 100;
    //     }
    //     return sinr;
    // };

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
