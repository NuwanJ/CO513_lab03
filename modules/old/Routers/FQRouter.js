const { BasicRouter } = require('./BasicRouter');

var FIFOQueue = require('queue-fifo');

const PROCESSING_DELAY = 50;
const PROCESS_INTERVAL = 200;

const ALGO_FIFO = 0;
const ALGO_FQ = 1;
const ALGO_WFQ = 2;

const BUFFER_SIZE = 16;

class FQRouter extends BasicRouter {
    constructor(id, network) {
        super(id, network);

        // Debug flag
        this._debug = false;

        // The FairQueue implementation
        // Source: https://en.wikipedia.org/wiki/Fair_queuing
        this.fQueue = [new FIFOQueue(), new FIFOQueue(), new FIFOQueue()];

        // Process queues
        this.process();
    }

    process = () => {
        // Handle the queues in a fixed interval
        const that = this;
        this.i = 0;
        this.scheduler = setInterval(() => {
            // console.log(`${this.id}: processRound ${i}`);
            const q = that.selectQueue();
            that.handleQueue(q, that);
        }, PROCESS_INTERVAL);
    };

    selectQueue = () => {
        // return next non empty queue
        if (this.fQueue[this.i % 3].size() > 0) {
            this.i += 1;
            return this.fQueue[this.i % 3];
        }

        if (this.fQueue[this.i % 3].size() > 0) {
            this.i += 2;
            return this.fQueue[this.i % 3];
        }

        if (this.fQueue[this.i % 3].size() > 0) {
            this.i += 3;
            return this.fQueue[this.i % 3];
        }

        return this.fQueue[this.i % 3];
    };

    handleQueue = (queue, self) => {
        // Handle the packets in the given queue using the scheduling algorithm
        // and Route to the destination
        if (queue.size() > 0) {
            let i = 0;

            const packet = queue.dequeue();
            const nextHopId = self.routingTable[packet.dest];
            const nextHopRouter = self.network.getRouter(nextHopId);

            if (nextHopRouter == self.id) {
                // No need to forward
                self.packetBuffer[packet.fwClass_id] -= 1;
                self.packetOut[packet.fwClass_id] += 1;
            } else if (self.routingTable[packet.dest] == undefined) {
                // Destination is not reachable, drop
                self.packetBuffer[packet.fwClass_id] -= 1;
                self.packetOut[packet.fwClass_id] += 1;
                self.debug(
                    `Error: destination( ${packet.dest} ) is not available for packet ${packet.id}`
                );
            } else if (nextHopRouter != undefined) {
                self.debug(
                    `\t sent packet '${packet.id}' to R${packet.dest} via R${nextHopId} by R${self.id}`
                );

                // add a small processing delay
                const that = this;
                setTimeout(function () {
                    nextHopRouter.inBound(packet);
                    that.packetBuffer[packet.fwClass_id] -= 1;
                    that.packetOut[packet.fwClass_id] += 1;
                }, PROCESSING_DELAY);
            }
        }
    };

    inBound = (packet) => {
        // Packets received to the router from here
        // Put it to the relevent queue of the router, for processing
        const classQueue = this.fQueue[packet.fwClass_id];
        this.enqueue(classQueue, BUFFER_SIZE, packet);
        this.debug(
            `R${this.id} received the packet '${packet.id}', and put into the OutQueue`
        );
    };
}

module.exports = {
    FQRouter
};
