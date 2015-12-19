var NS = NS || {};

(function (NS) {
    NS.NeuronLayer = function (name, brain) {
        this.name = name;
        this.brain = brain;
        this.uid = this.getUid();
        this.neurons = [];
        this.inputs = [];
        this.outputs = [];
        this.inputConnections = [];
        this.outputConnections = [];
        this.neuronConnections = [];
    };

    NS.NeuronLayer.prototype.addInputConnection = function (inputNo, toNeuron, inhibitory) {
        if (this.inputs[inputNo] == undefined)
            this.inputs[inputNo] = new NS.LayerInput(this, inputNo);

        var input = this.inputs[inputNo];
        var c = new NS.LayerInputConnection(input, toNeuron, inhibitory);
        this.inputConnections.push(c);
        return c;
    };

    NS.NeuronLayer.prototype.addOutputConnection = function (outputNo, fromNeuron) {
        if (this.outputs[outputNo] == undefined)
            this.outputs[outputNo] = new NS.LayerOutput(this, outputNo);

        var output = this.outputs[outputNo];
        var c = new NS.LayerOutputConnection(output, fromNeuron);
        this.outputConnections.push(c);
        return c;
    };

    NS.NeuronLayer.prototype.addNeuronConnection = function (fromNeuron, toNeuron, inhibitory) {
        var c = new NS.NeuronConnection(fromNeuron, toNeuron, inhibitory);
        this.neuronConnections.push(c);
        return c;
    };

    NS.NeuronLayer.prototype.pulseInput = function (inputNo) {
        if (this.inputs[inputNo] == undefined) return;
        this.inputs[inputNo].processPulse(1.0);
    };

    NS.NeuronLayer.prototype.getOutput = function (outputNo) {
        if (this.outputs[outputNo] == undefined) return;
        return this.outputs[outputNo].value();
    };

    NS.NeuronLayer.prototype.tick = function (time, dt) {
        //
        this.neurons.forEach(function (neuron) {
            neuron.tick(time, dt);
        }, this);

        this.outputs.forEach(function (output) {
            output.calc();
        }, this);

        // reset inputs
        /*this.inputs.forEach(function (input) {
         input.reset();
         }, this);*/
    };

    var __layers = 0;
    NS.NeuronLayer.prototype.getUid = function () {
        return __layers++;
    };

    //

    NS.LayerInput = function (layer, inputNo) {
        this.layer = layer;
        this.index = inputNo;
        this._value = 0;
    };

    NS.LayerInput.prototype.value = function () {
        return this._value;
    };

    NS.LayerInput.prototype.processPulse = function (pulse) {
        this._value += pulse;
    };

    NS.LayerInput.prototype.reset = function () {
        this._value = 0;
    };

    //

    NS.LayerOutput = function (layer, outputNo) {
        this.layer = layer;
        this.index = outputNo;
        this._value = 0;
        this._connections = [];
    };

    NS.LayerOutput.prototype.value = function () {
        return this._value;
    };

    NS.LayerOutput.prototype.connect = function (connection) {
        this._connections.push(connection);
    };

    NS.LayerOutput.prototype.calc = function () {
        this._value = 0;
        this._connections.forEach(function (connection) {
            this._value += connection.value();
        }, this);

        return this._value;
    };

})(NS);