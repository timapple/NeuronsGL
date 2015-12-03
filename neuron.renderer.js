
function NeuronRenderer (scene) {
	this.scene = scene;
}

NeuronRenderer.prototype.render = function(neuron) {
    var soma = BABYLON.Mesh.CreateSphere("soma", 32, 20, this.scene);
    var somaMat = new BABYLON.StandardMaterial("somaMat", this.scene);
    somaMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    somaMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    //somaMat.emissiveColor = BABYLON.Color3.Red();
    soma.material = somaMat;
    soma.position = neuron.position;
};