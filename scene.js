﻿var CreateScene = function (engine) {
    var canvas = engine.getRenderingCanvas();
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 0, 50));
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
    camera.lowerRadiusLimit = 150;

    camera.attachControl(canvas, false);

    scene.clearColor = new BABYLON.Color3(0, 0, 0);

    // Light
    //var light = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, 0), scene);
    var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
    light0.diffuse = new BABYLON.Color3(1, 1, 1);
    light0.specular = new BABYLON.Color3(1, 1, 1);
    light0.groundColor = new BABYLON.Color3(0, 0, 0);
    light0.intensity = .8;

    // Ground
    // var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
    // var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    // groundMaterial.specularColor = BABYLON.Color3.Black();
    // //groundMaterial.emissiveColor = new BABYLON.Color3(.2, .2, .2);
    // ground.material = groundMaterial;

    // Meshes


    



    return scene;
};