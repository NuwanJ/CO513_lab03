const { User } = require('./User');
const { BaseStation } = require('./BaseStation');
const { CallGenerator } = require('./CallGenerator');

const NUM_USERS = 100;

class Simulator {
    constructor(config) {
        this.config = config;
        this.users = {};
        this.bs = {};

        // Generate given number of users
        for (let i = 0; i < NUM_USERS; i++) {
            this.users[i] = new User(i, this);
        }

        // Generate base stations
        for (let i = 0; i < config.bs.length; i++) {
            const bs_data = config.bs[i];
            console.log(bs_data);
            this.bs[i] = new BaseStation(i, bs_data.x, bs_data.y, this.users);
        }

        // console.log('Users:', this.users);
        // console.log('BaseStations', this.bs);

        // Enables the call generator
        const callGenerator = new CallGenerator(this.users, this.bs, config);

        // Draw the user movements and base stations on HTML canvas
        var drawSimulation = process.argv[2];
        console.log('Simulator: ', drawSimulation);

        if (drawSimulation != 'no_simulator') {
            const loop = setInterval(() => {
                this.draw(this.users, this.bs);
            }, 100);
        }

        // --- Reporting -------------------------------------------------------
        let connectedUsers = [0, 0, 0];
        let avgUsers = [];
        let counter = 0;

        // Show average number of connected users in 6s (Equal to 1 min)
        const statusLoop = setInterval(() => {
            for (let i = 0; i < config.bs.length; i++) {
                connectedUsers[i] += this.bs[i].users;
            }
            // console.log(counter, connectedUsers);
            counter++;

            if (counter == 6) {
                for (let i = 0; i < config.bs.length; i++) {
                    avgUsers[i] = connectedUsers[i] / counter;
                }
                console.log(avgUsers);
                // counter = 0;
                // connectedUsers = [0, 0, 0];
            }
        }, 1000);
    }

    // Only with HTML canvas support
    draw = (users, bs) => {
        var c = document.getElementById('myCanvas');
        if (c !== null) {
            var ctx = c.getContext('2d');

            ctx.clearRect(0, 0, c.width, c.height);

            // Draw base stations
            for (let i = 0; i < Object.keys(bs).length; i++) {
                var x = this.bs[i].location.x / 10;
                var y = this.bs[i].location.y / 10;
                ctx.beginPath();
                ctx.arc(x, y, 25, 0, 2 * Math.PI);
                ctx.fillStyle = '#000000';
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y, this.bs[i].txDist / 10, 0, 2 * Math.PI);
                ctx.stroke();
            }

            // Draw users
            for (let i = 0; i < NUM_USERS; i++) {
                const x = users[i].x / 10;
                const y = users[i].y / 10;

                if (users[i].inCall == false) {
                    if (users[i].connected == false) {
                        ctx.fillStyle = '#FF0000';
                    } else {
                        ctx.fillStyle = '#00FF00';
                    }
                } else if (users[i].inCall) {
                    ctx.fillStyle = '#ffbf00';
                }
                ctx.fillRect(x - 5, y - 5, 10, 10);
            }
        }
    };
}

module.exports = {
    Simulator
};
