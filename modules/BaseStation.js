const fC = 3000; // in MHz
const TX_POWER = -110;
const log = Math.log10;

let loc;

class BaseStation {
    constructor(id, x, y, users) {
        // console.log(`id:${id} | x:${x} y:${y}`);
        loc = { x: x, y: y };
    }

    rssi = (x, y) => {
        // Free-space path loss in decibels
        // https://en.wikipedia.org/wiki/Free-space_path_loss

        const dist = this.dist(x, y);
        const loss = 20 * log(fC) + 20 * log(dist) - 27.55;
        const rssi = TX_POWER + loss;
        console.log(`\t dist: ${dist}m, loss: ${loss}dB, RSSI: ${rssi}`);

        return rssi;
    };

    dist = (x, y) => {
        return Math.sqrt(
            Math.pow(Math.abs(x - loc.x), 2),
            Math.pow(Math.abs(y - loc.y), 2)
        );
    };
}

module.exports = {
    BaseStation
};
