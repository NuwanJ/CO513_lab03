/* =============================================================================
To run the simulator,
1. Install NPM depedencies:
    npm run install

2. Run on development mode:
    npm run dev
    --- or ---
  Run on production mode:
    npm run start

3. Build as a web page (available in ./docs/index.html ):
    npm run bundle

// ===========================================================================*/

const { Simulator } = require('./modules/Simulator');

// configs (units in meters)
const config = {
    width: 10000,
    height: 10000,
    bs: [
        { x: 0, y: 0 },
        { x: 10000, y: 0 },
        { x: 5000, y: 10000 }
    ]
};

// Start the simulator
const simulator = new Simulator(config);
