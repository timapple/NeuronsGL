/// <reference path="../babylon.2.2.d.ts" />

document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

var onload = function () {

    var canvas = document.getElementById("renderCanvas");
    var renderZone = document.getElementById("renderZone");
    var divFps = document.getElementById("fps");
    
    if (!BABYLON.Engine.isSupported()) {
        renderZone.innerHTML("WebGL not supported");
    }

    var engine = new BABYLON.Engine(canvas, true);
    engine.resize();

    var scene = CreateScene(engine);

    var renderFunction = function () {
        divFps.innerHTML = engine.getFps().toFixed() + " fps";

        if (scene) {
            scene.render();
        }
    };

    engine.runRenderLoop(renderFunction);


    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });

};