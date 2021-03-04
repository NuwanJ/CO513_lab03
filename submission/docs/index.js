(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
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

},{"./modules/Simulator":5}],3:[function(require,module,exports){
const fC = 1800; // in MHz
const TX_POWER = 2.5; // in dBm
const MAX_USERS = 20;

const log10 = Math.log10;

class BaseStation {
    constructor(id, x, y, users) {
        this.id = id;
        this.loc = { x: x, y: y };
        this.users = 0;

        // Max possible transmission distance if RSSI should be greater than -110 dB
        // This is used to plot the circle in visualizer plot.
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
        if (this.users > 0) {
            this.users -= 1;
        }
    };
}

module.exports = {
    BaseStation
};

},{}],4:[function(require,module,exports){
const CALL_INTERVAL = 1000;
const ACTIVE_USER_PRECENTAGE = 0.25;

class CallGenerator {
    constructor(users, baseStations, config) {
        console.log('Call generator: enabled');

        this.users = users;
        this.bs = baseStations;
        this.activeUsers = 0;
        this.userCount = Object.keys(users).length;

        const that = this;
        setInterval(function() {
            // make some calls to keep 25% users active
            while (that.activeUsers < that.userCount * ACTIVE_USER_PRECENTAGE) {
                const u = that.getRandomIdealUser(that);

                if (u != null) {
                    const duration = that.getRandomInt(30, 120); // 30s - 120s
                    that.makeACall(u, duration);
                }
            }
        }, CALL_INTERVAL);
    }

    getRandomIdealUser = (that) => {
        // Get a random ideal user, return false if no one avaliable
        let id = that.getRandomInt(0, that.userCount - 1);
        let tryCount = 0;
        while (
            (that.users[id] == undefined || that.users[id].inCall == true) &&
            tryCount < 10
        ) {
            id = that.getRandomInt(0, that.userCount - 1);
            tryCount++;
        }
        return tryCount < 10 ? that.users[id] : null;
    };

    // NOTE: duration is simulated x10 times faster in here
    makeACall = (user, duration) => {
        if (user.connected == false) {
            // Mobile is not reachable
        } else {
            // console.log(`call_start:\t ${user.id} > ${duration}s`);
            this.activeUsers += 1;
            user.inCall = true;
            const that = this;
            setTimeout(function() {
                that.activeUsers -= 1;
                user.inCall = false;
                // console.log(`call_end:\t ${user.id}`);
            }, duration * 100);
        }
    };

    getRandomInt = (min, max) => {
        return min + Math.floor(Math.random() * Math.floor(max - min));
    };
}

module.exports = {
    CallGenerator
};

},{}],5:[function(require,module,exports){
(function (process){(function (){
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

}).call(this)}).call(this,require('_process'))
},{"./BaseStation":3,"./CallGenerator":4,"./User":6,"_process":1}],6:[function(require,module,exports){
const MOVE_INTERVAL = 500;
const SPEED = 50; // distance per 'MOVE_INTERVAL'

// let x, y, heading;
let config;
let simulator;

class User {
    constructor(id, sim) {
        simulator = sim;
        config = simulator.config;

        this.id = id;
        this._connected = false;
        this._status = 'IDEAL';
        this._baseStationId = null;
        this._inCall = false;

        this.x = this.getRandomInt(config.width);
        this.y = this.getRandomInt(config.height);
        this.heading = this.getRandomInt(359); // [0,359]

        // console.log(id, this.heading);

        const loop = setInterval(() => {
            this.move();

            const { rssi, sinr } = this.calculateSINR();
            this.updateStatus(rssi, sinr);
        }, MOVE_INTERVAL);
    }

    calculateSINR = () => {
        let rssi = [];
        let pow = [];
        let sinr = [];
        let sumRSSI = 0;
        let sumPow = 0;

        for (let i = 0; i < simulator.config.bs.length; i++) {
            rssi[i] = simulator.bs[i].rssi(this.x, this.y);
            pow[i] = Math.pow(10, rssi[i] / 10) / 1000;
            sumRSSI += rssi[i];
            sumPow += pow[i];
        }
        for (let i = 0; i < rssi.length; i++) {
            sinr[i] = Math.round((pow[i] / (sumPow - pow[i])) * 100) / 100;
        }
        // console.log(this.id, rssi, sumRSSI, sinr);

        return { rssi, sinr };
    };

    updateStatus = (rssi, sinr) => {
        if (this._baseStationId != null) {
            // If connected to a BS, lets check signal strength and
            // disconnect from it if it is too weak

            if (this._connected && rssi[this._baseStationId] < -110) {
                // Low SINR, disconnect
                simulator.bs[this._baseStationId].disconnect(this.id);
                // console.log(`${this.id} disconnected from ${this._baseStationId}`);
                this._baseStationId == null;
                this._connected = false;
                this._inCall = false; // cut the call
            }
        }

        if (this.connected == false) {
            // Not connected to any BS. Lets try to connect

            for (let i = 0; i < simulator.config.bs.length; i++) {
                if (rssi[i] > -110 && sinr[i] >= 1) {
                    // Try to connect, First found, first try
                    if (simulator.bs[i].connect(this.id) === true) {
                        // Connected
                        // console.log(dist[i], simulator.bs[i].txDist);
                        // console.log(`${this.id} connected to  ${i}`);
                        this.connected = true;
                        this._baseStationId = i;
                        break;
                    }
                }
            }
        }

        // console.log(rssi, 'Connect:', bestBS, sinr);
    };

    findSINR = (rssi) => {
        let sinr = [];
        let sum = 0;

        // SINR = RSSI - avg(RSSI), since RSSI is a log scale
        for (let i = 0; i < rssi.length; i++) {
            sum += rssi[i];
        }

        let noise = sum / rssi.length;

        for (let i = 0; i < rssi.length; i++) {
            sinr[i] = Math.round((rssi[i] - noise) * 100) / 100;
        }

        return sinr;
    };

    move = () => {
        // Mobility Model: Moving toward a random direction
        // const dTheta = this.getRandomInt(30) - 15; // only 15 deg change at step
        const dx = SPEED * Math.cos(this.heading * (Math.PI / 180));
        const dy = SPEED * Math.sin(this.heading * (Math.PI / 180));

        this.x = this.coordinateLimit(this.x + dx, 0, config.width);
        this.y = this.coordinateLimit(this.y + dy, 0, config.height);

        // console.log(`${this.id} moving: (${x},${y}) ^${heading}`);
    };

    getRandomInt = (max) => {
        return Math.floor(Math.random() * max);
    };

    coordinateLimit(coord, min, max) {
        if (coord < min) {
            // Hit the border > change heading
            this.heading = this.getRandomInt(350);
            return min;
        } else if (coord > max) {
            // Hit the border > change heading
            this.heading = this.getRandomInt(350);
            return max;
        }
        return Math.round(coord);
    }

    get getX() {
        return this.x;
    }

    get getY() {
        return this.y;
    }

    get status() {
        return this._status;
    }

    set status(s) {
        this._status = s;
    }

    get inCall() {
        return this._inCall;
    }
    set inCall(s) {
        this._inCall = s;
    }

    get connectWith() {
        return this._baseStationId;
    }
    set connectWith(bs) {
        this._baseStationId = bs;
    }

    get connected() {
        return this._connected;
    }
    set connected(bs) {
        this._connected = bs;
    }
}

module.exports = {
    User
};

},{}]},{},[2]);
