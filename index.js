const { Simulator } = require('./modules/Simulator');

const config = {
    width: 10000,
    height: 10000,
    bs: [
        { x: 100, y: 100 },
        { x: 9900, y: 100 },
        { x: 4900, y: 9900 }
    ]
};

const simulator = new Simulator(config);
