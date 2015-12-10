var Neuron = function (name, diameter) {
	this.name = name;
	this.diameter = diameter;
	this.position = new BABYLON.Vector3(0, 0, 0);
    this.selectable = true;
};

//Neuron.prototype.