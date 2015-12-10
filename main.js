/// <reference path="../babylon.2.2.d.ts" />

document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

var onload = function () {

    var canvas = document.getElementById("renderCanvas");
    var renderZone = document.getElementById("renderZone");
    var divFps = document.getElementById("fps");
    
    if (!BABYLON.Engine.isSupported()) {
        renderZone.innerHTML = "WebGL not supported";
    }

    divFps.innerHTML = "Loading...";

    var app = new App(canvas, function () {
        divFps.innerHTML = app.engine.getFps().toFixed() + " fps";
    });
    app.init();

    // Events

    window.addEventListener("resize", function () {
        app.engine.resize();
    });

};