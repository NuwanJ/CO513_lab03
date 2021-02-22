const { BasicRouter } = require('./BasicRouter');

var FIFOQueue = require('queue-fifo');

const PROCESSING_DELAY = 50;
const PROCESS_INTERVAL = 200;
const BUFFER_SIZE = 16;

class FIFORouter extends BasicRouter {
    constructor(id, network) {
        super(id, network);

        // Debug flag
        this._debug = false;

        // A FIFO Queue
        this.queue = new FIFOQueue();

        // Process queues
        this.process();
    }

    process = () => {
        // Handle outQueue by a fixed interval
        const that = this;
        this.scheduler = setInterval(() => {
            // console.log(`${this.id}: processRound ${i}`);
            that.handleQueue(this.queue, that);
        }, PROCESS_INTERVAL);
    };

    handleQueue = (queue, self) => {
        // Handle the packets in outQueue using the given algorithm
        // Route to the destination
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
                const that = self;
                setTimeout(function () {
                    if (packet != undefined) {
                        nextHopRouter.inBound(packet);
                        that.packetBuffer[packet.fwClass_id] -= 1;
                        that.packetOut[packet.fwClass_id] += 1;
                    }
                }, PROCESSING_DELAY);
            }
        }
    };

    inBound = (packet) => {
        // Packets received to the router from here
        // Put it to the relevent queue of the router, for processing
        this.enqueue(this.queue, BUFFER_SIZE, packet);
        this.debug(
            `R${this.id} received the packet '${packet.id}', and put into the OutQueue`
        );
    };
}

module.exports = {
    FIFORouter
};
