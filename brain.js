function Brain() {
    this.neurons = [];

    this.init = function (count) {
        for (var i = 0; i < count; i++) {
            var n = new Neuron("neuron" + i);
            n.position.x = 30 - Math.random() * 60;
            n.position.y = 30 - Math.random() * 60;

            this.neurons.push(n);
        }
    };

    this.tick = function (time) {

    };

}