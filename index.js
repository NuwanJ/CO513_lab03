const { Simulator } = require('./modules/Simulator');

const simulationTime = 5000;

const config = {
    width: 10000,
    height: 10000,
    bs: [
        { x: 0, y: 0 },
        { x: 10000, y: 0 },
        { x: 5000, y: 10000 }
    ]
};

const simulator = new Simulator(simulationTime, config);
