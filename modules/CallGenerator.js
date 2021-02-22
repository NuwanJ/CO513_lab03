const CALL_INTERVAL = 1000;
const ACTIVE_USER_PRECENTAGE = 0.25;

class CallGenerator {
    constructor(users, baseStations, config) {
        console.log('Call generator');

        this.users = users;
        this.bs = baseStations;
        this.activeUsers = 0;
        this.userCount = Object.keys(users).length;
        const that = this;

        setInterval(function() {
            // make some calls to keep 25% users active

            while (that.activeUsers < that.userCount * ACTIVE_USER_PRECENTAGE) {
                const u = that.getRandomIdealUser(that);
                const duration = that.getRandomInt(30, 120); // 30s - 120s
                that.makeACall(u, duration);
                console.log(`call_start:\t ${u.id} > ${duration}s`);
            }

            console.log('active calls:', that.activeUsers);
        }, CALL_INTERVAL);
    }

    getRandomIdealUser = (that) => {
        // Get a random ideal user
        let id = that.getRandomInt(0, that.userCount - 1);
        while (that.users[id] == undefined || that.users[id].status != 'IDEAL') {
            // console.log(`${id} > ${that.users[id].status}`);
            id = that.getRandomInt(0, that.userCount - 1);
        }
        return that.users[id];
    };

    makeACall = (user, duration) => {
        this.activeUsers += 1;
        user.status = 'IN_CALL';
        const that = this;
        setTimeout(function() {
            that.activeUsers -= 1;
            user.status = 'IDEAL';
            console.log(`call_end:\t ${user.id}`);
        }, duration * 100);
    };

    getRandomInt = (min, max) => {
        return min + Math.floor(Math.random() * Math.floor(max - min));
    };
}

module.exports = {
    CallGenerator
};
