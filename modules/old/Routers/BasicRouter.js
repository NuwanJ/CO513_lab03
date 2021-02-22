const PROCESSING_DELAY = 50;
const PROCESS_INTERVAL = 200;

const BUFFER_SIZE = 16;

class BasicRouter {
    constructor(id, network) {
        this._debug = false;

        this.id = id;
        this.routingTable = {};
        this.network = network;

        // To monitor the classes of incomming, outgoing packets
        this.packetIn = [0, 0, 0];
        this.packetOut = [0, 0, 0];
        this.packetDrops = [0, 0, 0];
        this.packetBuffer = [0, 0, 0];
    }

    addRoute = (dest, via) => {
        this.routingTable[dest] = via;
    };

    handleQueue = (queue) => {};

    inBound = (packet) => {};

    enqueue = (queue, buffSize, packet) => {
        this.packetIn[packet.fwClass_id]++;

        if (queue.size() < buffSize) {
            // Add only if queue has enough space
            this.packetBuffer[packet.fwClass_id]++;
            queue.enqueue(packet);
        } else {
            //console.error('Packet drop');
            this.packetDrops[packet.fwClass_id]++;
        }
    };

    debug = (msg) => {
        if (this._debug) {
            console.log(msg);
        }
    };

    log = () => {
        // const packetBuffer = [
        //     this.packetIn[0] - this.packetOut[0] - this.packetDrops[0],
        //     this.packetIn[1] - this.packetOut[1] - this.packetDrops[1],
        //     this.packetIn[2] - this.packetOut[2] - this.packetDrops[2]
        // ];

        const inputPkts = this.listSum(this.packetIn);
        const outputPkts = this.listSum(this.packetOut);
        const dropPkts = this.listSum(this.packetDrops);
        const bufferPkts = this.listSum(this.packetBuffer);

        const dropProb = Math.round((dropPkts / inputPkts) * 1000) / 1000;
        const drops = [
            this.round3(this.packetDrops[0] / this.packetIn[0]),
            this.round3(this.packetDrops[1] / this.packetIn[1]),
            this.round3(this.packetDrops[2] / this.packetIn[2])
        ];

        console.log(`Router:\tR${this.id}`);
        console.log('\t Inputs   :', inputPkts, this.packetIn);
        console.log('\t Outputs  :', outputPkts, this.packetOut);
        console.log('\t Drops    :', dropPkts, this.packetDrops);
        console.log('\t Buffer   :', bufferPkts, this.packetBuffer);
        console.log('\t DropProb = ', dropProb, drops);
    };

    listSum = (list) => {
        return list.reduce((a, b) => a + b, 0);
    };

    round2 = (val) => {
        return Math.round(val * 100) / 100;
    };

    round3 = (val) => {
        return Math.round(val * 1000) / 1000;
    };
}

module.exports = {
    BasicRouter
};
