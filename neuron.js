var NS = NS || {};

(function (NS) {
    NS.Neuron = function (name, layer) {
        this.name = name;
        this.layer = layer;
        this.uid = this.getUid();
        this.axon = 0.0; // импульс аксона
        this.bias = -70.0; // потенциал покоя
        this.charge = this.bias; // уровень поляризации
        this.limit = -50.0; // критический уровень поляризации
        this.synapses = [];
        //this._value = 0;
    };

    NS.Neuron.prototype._processSynapse = function (synapse) {
        this.charge += synapse.value();
    };

    NS.Neuron.prototype._chargeTick = function (time, dt) {
        if (this.charge > this.bias)
            this.charge -= 10.0;
        if (this.charge < this.bias)
            this.charge += 10.0;
    };

    NS.Neuron.prototype._calc = function () {
        if (this.charge >= this.limit) {
            this.axon = 1.0; // 100-120 mV
            this.charge = -80; // следовая гиперполяризация
        }
        else
            this.axon = 0;
        return this.axon;
    };

    NS.Neuron.prototype.value = function () {
        return this.axon;
    };

    NS.Neuron.prototype.reset = function () {
        this.charge = this.bias;
        this.axon = 0;
    };

    NS.Neuron.prototype.tick = function (time, dt) {
        this.synapses.forEach(function (synapse) {
            this._processSynapse(synapse);
        }, this);
        this._chargeTick(time, dt);
        this._calc();
    };

    NS.Neuron.prototype.connect = function (connection, inhibitory) {
        var s;
        if (inhibitory)
            s = new NS.InhibitorySynapse(this, connection);
        else
            s = new NS.InhibitorySynapse(this, connection);
        this.synapses.push(s);
        return s;
    };

    var __neurons = 0;
    NS.Neuron.prototype.getUid = function () {
        return __neurons++;
    };

    //

    NS.Synapse = function (neuron, connection) {
        this.neuron = neuron;
        this.connection = connection;
        this._weight = 1.0; // one pulse to potencial diff
    };

    NS.Synapse.prototype.value = function () {
        return this._weight * this.connection.value();
    };

    //

    NS.InhibitorySynapse = function (neuron, connection) {
        this.parent.constructor.call(this, neuron, connection);
        this._weight = -1.0; // one pulse to potencial diff
    };
    __extends(NS.InhibitorySynapse, NS.Synapse);

})(NS);
