// Neuron representation in editor/3D

function NeuronRenderer(scene) {
    this.scene = scene;
}

NeuronRenderer.prototype.render = function (o) {
    var diameter = this.diameterFor(o.target);
    var somaMesh = BABYLON.Mesh.CreateSphere("soma", 6, diameter, this.scene);
    var somaMat = new BABYLON.StandardMaterial("somaMat", this.scene);
    somaMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    somaMat.specularColor = new BABYLON.Color3.White();
    //somaMat.emissiveColor = BABYLON.Color3.Red();
    somaMesh.material = somaMat;

    somaMesh.position = o.position;

    somaMesh.owner = o;
    o.meshes = o.meshes || [];
    o.meshes.push(somaMesh);
};

NeuronRenderer.prototype.update = function (o) {
    o.meshes.forEach(function (m) {
        if (!m.parent) {
            m.position = o.position;
        }
    });
};

NeuronRenderer.prototype.diameterFor = function (neuron) {
    return 10;
};

