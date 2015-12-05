/**
 * Created by timapple on 05.12.2015.
 */

function Editor(app) {
    var _this = this;
    this.app = app;
    this.scene = app.scene;
    this.moveArrows = new MoveArrows(this.scene);
    this.moveArrows.init();

    this.onPointerDown = function (evt) {
        if (evt.button == 0) {
            this.handleLeftButton(evt);
        }
    };

    this.onPointerUp = function (evt) {
        if (_this.moving) {
            _this.moving = false;
            _this.scene.activeCamera.attachControl(_this.app.canvas, false);
        }
    };

    this.onPointerMove = function (evt) {
        if (_this.moving) {
            //this.handle
        }
        else {
            _this.handleMoveOver(evt);
        }
    };

    var currentMesh;
    this.handleMoveOver = function (evt) {
        var pickInfo = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY,
            function (mesh) {
                return mesh && mesh.material;
            });

        if (currentMesh && currentMesh != pickInfo.pickedMesh)
        //currentMesh.material.wireframe = false;
            currentMesh.material.emissiveColor = BABYLON.Color3.Black();

        if (pickInfo.hit) {
            if (currentMesh != pickInfo.pickedMesh) {
                currentMesh = pickInfo.pickedMesh;
                //currentMesh.material.wireframe = true;
                currentMesh.material.emissiveColor = currentMesh.material.diffuseColor.clone();
            }
        }
        else
            currentMesh = null;

        //console.dir(currentMesh);
    };

    this.handleLeftButton = function (evt) {
        var pickInfo = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY,
            function (mesh) {
                return mesh;
            });

        if (pickInfo.hit) {
            if (pickInfo.pickedMesh.owner) {
                var object = pickInfo.pickedMesh.owner;
                if (object instanceof Neuron)
                    _this.pickNeuron(object);

                if (object instanceof MoveArrows)
                    _this.pickArrow(object);
            }
        }
        else {
            _this.pickNothing();
        }
    };

    this.pickNeuron = function (n) {
        var p = n.position;
        //console.dir(p);
        this.moveArrows.show(p);
    };

    this.pickNothing = function () {
        this.moveArrows.hide();
    };

    this.pickArrow = function (a) {
        this.moving = true;
        this.scene.activeCamera.detachControl(this.app.canvas);
        //TODO: handle arrow pick
    };
}


function MoveArrows(scene) {
    this.scene = scene;
    //this._visible = false;

    this.init = function () {
        this.axeXMat = new BABYLON.StandardMaterial("axeXMat", this.scene);
        this.axeXMat.diffuseColor = new BABYLON.Color3.Red();
        this.axeYMat = new BABYLON.StandardMaterial("axeYMat", this.scene);
        this.axeYMat.diffuseColor = new BABYLON.Color3.Green();
        this.axeZMat = new BABYLON.StandardMaterial("axeZMat", this.scene);
        this.axeZMat.diffuseColor = new BABYLON.Color3.Blue();


        this.meshP = BABYLON.Mesh.CreateSphere("arrowsP", 1, 3, this.scene);
        this.meshP.isVisible = false;

        this.meshCY = BABYLON.Mesh.CreateCylinder("arrowsCY", 18, 1, 1, 6, 1, scene);
        this.meshCY.material = this.axeYMat;
        this.meshCY.parent = this.meshP;
        this.meshCY.owner = this;

        this.meshCX = this.meshCY.clone();
        this.meshCX.rotation.z = Math.PI / 2;
        this.meshCX.material = this.axeXMat;
        this.meshCX.parent = this.meshP;
        this.meshCX.owner = this;

        this.meshCZ = this.meshCY.clone();
        this.meshCZ.rotation.x = Math.PI / 2;
        this.meshCZ.material = this.axeZMat;
        this.meshCZ.parent = this.meshP;
        this.meshCZ.owner = this;

        this.hide();
    };

    this.show = function (position) {
        if (position)
            this.meshP.position = position.clone();
        this.meshCX.isVisible = true;
        this.meshCY.isVisible = true;
        this.meshCZ.isVisible = true;
    };

    this.hide = function () {
        this.meshCX.isVisible = false;
        this.meshCY.isVisible = false;
        this.meshCZ.isVisible = false;
    };
}

/*
 Object.defineProperty(MoveArrows, 'visible', {
 get: function() { return this.meshP.isVisible; },
 set: function(v) { v ? this.show() : this.hide(); }
 });*/
