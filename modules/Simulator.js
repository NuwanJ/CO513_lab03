const { User } = require('./User');
const { BaseStation } = require('./BaseStation');
const { CallGenerator } = require('./CallGenerator');

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

        const cg = new CallGenerator(this.users, this.bs, config);
    }
}

module.exports = {
    Simulator
};
