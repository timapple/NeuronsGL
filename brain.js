function Brain() {
    this.neurons = [];

    this.init = function (count) {
        for (var i = 0; i < count; i++) {
            this.addNeuron("neuron" + i);
        }
    };

    this.addNeuron = function (name) {
        var n = new Neuron(name, this);
        this.neurons.push(n);
    };

    this.hasNeuron = function (n) {
        return this.neurons.indexOf(n) != -1;
    };

    this.tick = function (time, dt) {
        this.neurons.forEach(function (n) {
            n.tick(time, dt);
        });
    };

}