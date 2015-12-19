var Neuron = function (name, brain) {
    this.name = name;
    this.uid = this.getUid();
    this.brain = brain;

    this.tick = function (time, dt) {

    };
};

(function () {
    var neurons = 0;
    //var connections = 0;
    Neuron.getUid = function () {
        return neurons++;
    };
    /*Neuron.connection.uid = function() {
     return connections++;
     }
     Neuron.quantity = function() {
     return {
     neurons: neurons,
     connections: connections
     }
     }*/
})();
