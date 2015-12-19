var NS = NS || {};

(function (NS) {
    NS.Connection = function () {
        this.uid = this.getUid();
    };

    NS.Connection.prototype.value = function () {
        return 0;
    };

    var __connections = 0;
    NS.Connection.prototype.getUid = function () {
        return __connections++;
    };

    //

    NS.LayerInputConnection = function (input, toNeuron, inhibitory) {
        this.parent.constructor.call(this);
        this.input = input;
        //this.toNeuron = toNeuron;
        //this.synapse = toNeuron.connect(this, inhibitory);
        toNeuron.connect(this, inhibitory);
    };
    __extends(NS.LayerInputConnection, NS.Connection);

    NS.LayerInputConnection.prototype.value = function () {
        return this.input.value();
    };


    NS.LayerOutputConnection = function (output, fromNeuron) {
        this.parent.constructor.call(this);
        this.fromNeuron = fromNeuron;
        //this.output = output;
        output.connect(this);
    };
    __extends(NS.LayerOutputConnection, NS.Connection);

    NS.LayerOutputConnection.prototype.value = function () {
        return this.fromNeuron.value();
    };

    //

    NS.NeuronConnection = function (fromNeuron, toNeuron, inhibitory) {
        this.parent.constructor.call(this);
        this.fromNeuron = fromNeuron;
        //this.toNeuron = toNeuron;
        //this.synapse = toNeuron.connect(this, inhibitory);
        toNeuron.connect(this, inhibitory);
    };
    __extends(NS.NeuronConnection, NS.Connection);

    NS.NeuronConnection.prototype.value = function () {
        return this.fromNeuron.value();
    };

})(NS);