const { User } = require('./User');
const { BaseStation } = require('./BaseStation');
const { CallGenerator } = require('./CallGenerator');

// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;
// const { document } = new JSDOM(`...`).window;
// // global.document = new JSDOM(html).window.document;

const NUM_USERS = 10;
const SIG_STRENGHT = -100; // in dBs

class Simulator {
    constructor(simulationTime, config) {
        this.simulationTime = simulationTime;
        this.config = config;
        this.users = {};
        this.bs = {};

        for (let i = 0; i < NUM_USERS; i++) {
            // Create users: id, network
            this.users[i] = new User(i, this);
        }

        for (let i = 0; i < config.bs.length; i++) {
            // id, x, y, users
            const bs_data = config.bs[i];
            console.log(bs_data);
            this.bs[i] = new BaseStation(i, bs_data.x, bs_data.y, this.users);
        }

        // console.log('Users:', this.users);
        // console.log('BaseStations', this.bs);

        // const cg = new CallGenerator(this.users, this.bs, config);
        // const loop = setInterval(() => {
        //     this.draw(this.users);
        // }, 100);
    }

    draw = (users) => {
        var c = document.getElementById('myCanvas');
        if (c !== null) {
            var ctx = c.getContext('2d');

            ctx.clearRect(0, 0, c.width, c.height);
            ctx.fillStyle = '#FF0000';

            for (let i = 0; i < NUM_USERS; i++) {
                const x = users[i].x / 10;
                const y = users[i].y / 10;
                ctx.fillRect(x, y, 10, 10);
                console.log(x, y);
            }
            // ctx.stroke();
        }
    };
}

module.exports = {
    Simulator
};
