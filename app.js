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

        this.neuronRenderer.renderBrain(this.brain);

        this.repulsion = new Repulsion(this.brain, true);

        this.editor = new Editor(this);

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
            _this.neuronRenderer.updateBrain(_this.brain);
            _this.editor.tick(dt);
            _this.repulsion.tick(dt);

            _this.lastTick = now;
        }

        if (_this.scene)
            _this.scene.render();

        if (_this._renderCallback)
            _this._renderCallback();
    };

    // Events

    //var pickingInfo;
    this.onPointerDown = function (evt) {
        if (_this.editor)
            _this.editor.onPointerDown(evt);
    };

    this.onPointerUp = function (evt) {
        if (_this.editor)
            _this.editor.onPointerUp(evt);
    };

    this.onPointerMove = function (evt) {
        if (_this.editor)
            _this.editor.onPointerMove(evt);
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
