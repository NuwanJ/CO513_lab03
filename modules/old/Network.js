const { FIFORouter, FQRouter } = require('./Routers/index.js');
const { Packet } = require('./Packet');

class Network {
    constructor(simulationTime) {
        this.routers = {};

        const numOfRouters = 5;
        let i;

        for (i = 1; i <= numOfRouters; i++) {
            // Creates a FIFO based router
            this.routers[i] = new FIFORouter(i, this);

            // Creates a FairQueue Router
            //this.routers[i] = new FQRouter(i, this);

            // Prepare the routing table for linear connectivity
            let j;
            for (j = 1; j <= numOfRouters; j++) {
                if (j > i) {
                    // j routes to the i+1 router
                    this.routers[i].addRoute(j, i + 1);
                } else if (j < i) {
                    // j routes to the i-1 router
                    this.routers[i].addRoute(j, i - 1);
                } else {
                    // route into itself
                }
            }
        }

        const that = this;
        const rate = 20;
        const interval = 50;

        console.log(`Network simulation for ${simulationTime}ms`);
        console.log(`rate: ${rate} packets at every ${interval}ms interval`);

        const simulation = setInterval(function () {
            let k = 0;
            for (k = 0; k < rate; k++) {
                that.generateRandomPacket(that, numOfRouters);
            }
        }, interval);

        setTimeout(function () {
            console.log('Simulation ends\n');
            clearInterval(simulation);
        }, simulationTime);

        // Print the logs of choosen routers
        setTimeout(function () {
            // that.routers[1].log();
            // that.routers[2].log();
            that.routers[3].log();
            // that.routers[4].log();
            // that.routers[5].log();
        }, simulationTime + 500);
    }

    generateRandomPacket = (that, routerCount) => {
        const randomSource = that.getRandomInt(routerCount);
        const randomDest = that.getRandomInt(routerCount);

        const p = that.createPacket(randomDest, 'This is a sample');
        // console.log(`${randomSource}, ${randomDest} FC=${p.fwClass}`);

        that.routers[randomSource].inBound(p);
    };

    getRouter(id) {
        return this.routers[id];
    }

    getRandomInt = (max) => {
        // return a number between [1,max]
        return 1 + Math.floor(Math.random() * max);
    };

    createPacket = (dest, msg) => {
        let forwardingClass;
        const rand = Math.random();

        // 50% of the traffic will be delivered best effort,
        // 25% will be tagged DSCP-22 and the rest will be tagged DSCP-46
        const p = [0.5, 0.25, 0.25];

        if (rand <= p[0]) forwardingClass = 0;
        else if (rand <= p[0] + p[1]) forwardingClass = 1;
        else forwardingClass = 2;

        const id = Math.round(Math.random() * 1000);
        return new Packet(id, dest, msg, forwardingClass);
    };
}

module.exports = {
    Network
};
