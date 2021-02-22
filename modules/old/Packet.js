const fwClass = ['Default', 'DSCP-22', 'DSCP-46'];

class Packet {
    constructor(id, dest, msg, forwardingClass) {
        this._id = id;
        this._dest = dest;
        this._msg = msg;
        this._fwClass = forwardingClass;

        this.class = ['Default', 'DSCP-22', 'DSCP-46'];
        // console.log(forwardingClass, this.class[forwardingClass]);
    }

    get id() {
        return this._id;
    }

    get dest() {
        return this._dest;
    }

    get msg() {
        return this._msg;
    }

    get fwClass() {
        return fwClass[this._fwClass];
    }

    get fwClass_id() {
        return this._fwClass;
    }

    set dest(d) {
        this._dest = d;
    }
}

module.exports = {
    Packet
};
