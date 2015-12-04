/**
 * Created by timapple on 03.12.2015.
 */

function App(canvas, renderCallback) {
    var _this = this;

    this.canvas = canvas;
    this._renderCallback = renderCallback;

    this.tickPeriod = 50;

    this.init = function () {
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.resize();

        this.scene = CreateScene(this.engine);
        this.neuronRenderer = new NeuronRenderer(this.scene);

        this.brain = new Brain();
        this.brain.init(13);

        this.renderBrain();

        this.repulsion = new Repulsion(this.brain);

        this.lastTick = window.performance.now();

        this.engine.runRenderLoop(this.renderFunction);

        this.addEventListeners();
        this.scene.onDispose = function () {
            _this.removeEventListeners();
        };

    };

    this.renderFunction = function () {
        var now = window.performance.now();
        var dt = now - _this.lastTick;
        if (dt >= _this.tickPeriod) {
            _this.brain.tick(now, dt);

            _this.repulsion.tick(dt);

            _this.lastTick = now;
        }

        //if (_this.scene)
        _this.scene.render();

        //if (_this._renderCallback)
        _this._renderCallback();
    };

    this.renderBrain = function () {
        this.brain.neurons.forEach(function (n) {
            _this.neuronRenderer.render(n);
        });
    };

    // Events

    var pickingInfo;
    this.onPointerDown = function (evt) {
        if (evt.button !== 0) {
            return;
        }
        //console.log('pick');

        // check if we are under a mesh
        var pickInfo = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY,
            function (mesh) {
                return mesh !== null;
            });
        if (pickInfo.hit)
            pickingInfo = pickInfo;
        else
            pickingInfo = null;

        //console.dir(pickingInfo);
    };

    this.onPointerUp = function () {

    };

    var currentMesh;
    this.onPointerMove = function () {

        var pickInfo = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY,
            function (mesh) {
                return true;
            });

        if (currentMesh && currentMesh != pickInfo.pickedMesh)
            currentMesh.material.wireframe = false;

        if (pickInfo.hit) {
            if (currentMesh != pickInfo.pickedMesh) {
                currentMesh = pickInfo.pickedMesh;
                currentMesh.material.wireframe = true;
            }
        }
        else
            currentMesh = null;

        //console.dir(currentMesh);
    };

    this.addEventListeners = function () {
        var eventPrefix = BABYLON.Tools.GetPointerPrefix();
        this.canvas.addEventListener(eventPrefix + "down", this.onPointerDown, false);
        this.canvas.addEventListener(eventPrefix + "up", this.onPointerUp, false);
        this.canvas.addEventListener(eventPrefix + "move", this.onPointerMove, false);
    };

    this.removeEventListeners = function () {
        var eventPrefix = BABYLON.Tools.GetPointerPrefix();
        this.canvas.removeEventListener(eventPrefix + "down", this.onPointerDown);
        this.canvas.removeEventListener(eventPrefix + "up", this.onPointerUp);
        this.canvas.removeEventListener(eventPrefix + "move", this.onPointerMove);
    };

}
