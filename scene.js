var CreateScene = function (engine) {
    var canvas = engine.getRenderingCanvas();
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(20, 200, 400));
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


    

    // Events
    
    //var startingPoint;
    var pickingInfo;

    var onPointerDown = function (evt) {
        if (evt.button !== 0) {
            return;
        }

        // check if we are under a mesh
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, 
            function (mesh) { 
                return mesh !== null; 
            });
        if (pickInfo.hit)
            pickingInfo = pickInfo;
        else
            pickingInfo = null;
    }

    var onPointerUp = function () {

    }

    var onPointerMove = function (evt) {

    }

    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);

    scene.onDispose = function () {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
    }

    return scene;
};