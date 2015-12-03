/**
 * Created by timapple on 03.12.2015.
 */

function App(canvas, renderCallback) {

    this.canvas = canvas;
    this._renderCallback = renderCallback;

    this.tickPeriod = 500;

    this.init = function () {
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.engine.resize();

        this.scene = CreateScene(this.engine);
        this.neuronRenderer = new NeuronRenderer(this.scene);

        this.brain = new Brain();
        this.brain.init(13);

        this.renderBrain();

        var _this = this;
        var lastTick = window.performance.now();

        var renderFunction = function () {

            var now = window.performance.now();
            if (now >= lastTick + _this.tickPeriod) {
                if (_this.brain)
                    _this.brain.tick(now);

                lastTick = now;
            }

            if (_this.scene)
                _this.scene.render();

            if (_this._renderCallback)
                _this._renderCallback();
        };

        this.engine.runRenderLoop(renderFunction);

        this.addEventListeners();
        this.scene.onDispose = function () {
            _this.removeEventListeners();
        };
    };

    this.renderBrain = function () {
        var _this = this;
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

        // check if we are under a mesh
        var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY,
            function (mesh) {
                return mesh !== null;
            });
        if (pickInfo.hit)
            pickingInfo = pickInfo;
        else
            pickingInfo = null;
    };

    this.onPointerUp = function () {

    };

    var onPointerMove = function (evt) {
        console.log('onPointerMove');
        var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY,
            function (mesh) {
                return true;
            });
        if (pickInfo.hit) {
            var currentMesh = pickInfo.pickedMesh;
            currentMesh.material.wireframe = true;
        }
    };

    this.addEventListeners = function () { //console.log('addEventListeners');
        this.canvas.addEventListener("pointerdown", this.onPointerDown, false);
        this.canvas.addEventListener("pointerup", this.onPointerUp, false);
        this.canvas.addEventListener("pointermove", onPointerMove, false);
    };

    this.removeEventListeners = function () {
        this.canvas.removeEventListener("pointerdown", this.onPointerDown);
        this.canvas.removeEventListener("pointerup", this.onPointerUp);
        this.canvas.removeEventListener("pointermove", onPointerMove);
    };

}
