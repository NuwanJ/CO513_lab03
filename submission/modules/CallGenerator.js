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
