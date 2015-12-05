
function NeuronRenderer (scene) {
	this.scene = scene;
}

NeuronRenderer.prototype.renderNeuron = function (neuron) {
    var somaMesh = BABYLON.Mesh.CreateSphere("soma", 6, neuron.diameter, this.scene);
    var somaMat = new BABYLON.StandardMaterial("somaMat", this.scene);
    somaMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    somaMat.specularColor = new BABYLON.Color3.White();
    //somaMat.emissiveColor = BABYLON.Color3.Red();
    somaMesh.material = somaMat;
    somaMesh.position = neuron.position;

    somaMesh.owner = neuron;
    neuron.somaMesh = somaMesh;
};

NeuronRenderer.prototype.renderBrain = function (brain) {
    var _this = this;
    brain.neurons.forEach(function (n) {
        _this.renderNeuron(n);
    });
};