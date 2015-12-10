/**
 * Created by timapple on 05.12.2015.
 */

function Editor(app) {
    var _this = this;
    this.app = app;
    this.scene = app.scene;
    this.moveArrows = new MoveArrows(this.scene);
    this.moveArrows.init();
    this.selectedObject = null;

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
        //console.log('editor.onPointerMove');
        if (_this.moving) {
            //console.log('editor.onPointerMove');
            this.handleMovingWithPointer(evt);
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
            _this.pickedMesh = pickInfo.pickedMesh;
            if (pickInfo.pickedMesh.owner) {
                _this.pickedObject = pickInfo.pickedMesh.owner;

                if (_this.pickedObject.selectable)
                    _this.selectedObject = _this.pickedObject;

                if (_this.pickedObject instanceof Neuron)
                    _this.pickNeuron(_this.pickedObject);

                if (_this.pickedObject instanceof MoveArrows)
                    _this.pickArrow(_this.pickedObject);
            }
        }
        else {
            _this.pickNothing();
        }
    };

    this.pickNeuron = function (n) {
        //var p = n.position;
        //console.dir(p);
        this.moveArrows.target = n;
        this.moveArrows.show();
    };

    this.pickNothing = function () {
        this.moveArrows.hide();
        this.moveArrows.target = null;
        this.selectedObject = null;
    };

    this.pickArrow = function (a) {
        this.moving = true;
        this.scene.activeCamera.detachControl(this.app.canvas);
        this.moveArrows.pickAxisByMesh(this.pickedMesh);
    };

    this.handleMovingWithPointer = function (evt) {
        var canvasRect = this.app.engine.getRenderingCanvasClientRect();
        this.pointerX = evt.clientX - canvasRect.left;
        this.pointerY = evt.clientY - canvasRect.top;

        var screenVector = new BABYLON.Vector3(this.pointerX, this.pointerY, 0);
        var view = this.scene.activeCamera.viewport.toGlobal(this.app.engine);

        //var viewM = this.scene.getViewMatrix();
        //var projM = this.scene.getProjectionMatrix();
        //var b = BABYLON.Vector3.UnprojectFromTransform( screenVector, view.width, view.height,
        //    BABYLON.Matrix.Identity(), projM );
        //var b = BABYLON.Vector3.Unproject( screenVector, view.width, view.height,
        //    BABYLON.Matrix.Identity(), viewM, projM );

        var ray = this.scene.createPickingRay(this.pointerX, this.pointerY, BABYLON.Matrix.Identity());
        var p2 = ray.origin, b = ray.direction;
        var p1 = this.moveArrows.target.position, a = this.moveArrows.pickedAxis;
        var pp = p2.subtract(p1);
        //console.log('a: ' + a.x + ', ' + a.y + ', ' + a.z);
        //console.log('b: ' + b.x + ', ' + b.y + ', ' + b.z);

        var n = BABYLON.Vector3.Cross(a, b);
        //console.log('n: ' + n.x + ', ' + n.y + ', ' + n.z);
        var A = BABYLON.Matrix.FromValues(a.x, -b.x, -n.x, 0, a.y, -b.y, -n.y, 0, a.z, -b.z, -n.z, 0, 0, 0, 0, 1);
        var det = A.determinant();
        if (Math.abs(det) > 1e-6) {
            var An = A.clone();
            An.m[0] = pp.x;
            An.m[4] = pp.y;
            An.m[8] = pp.z;
            var detn = An.determinant();
            var s = detn / det;
            //console.log('s: ' + s);

            var _p1 = a.scale(s);
            _p1.addInPlace(p1);
            this.moveArrows.target.position = _p1;
            //this.moveArrows
        }

    };

    this.tick = function () {
        this.moveArrows.tick();
    };
}


function MoveArrows(scene, target) {
    this.scene = scene;
    this.pickedAxis = null;
    this.selectable = false;
    this.target = target;

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

    this.show = function () {
        if (this.target && this.target.position) {
            this.meshP.position = this.target.position.clone();
            this.meshCX.isVisible = true;
            this.meshCY.isVisible = true;
            this.meshCZ.isVisible = true;
        }
    };

    this.hide = function () {
        this.meshCX.isVisible = false;
        this.meshCY.isVisible = false;
        this.meshCZ.isVisible = false;
    };

    this.tick = function () {
        if (this.target && this.target.position)
            this.meshP.position = this.target.position.clone();
    };

    this.pickAxisByMesh = function (mesh) {
        this.pickedAxis = null;
        if (mesh == this.meshCX) {
            this.pickedAxis = new BABYLON.Vector3(1, 0, 0);
        }
        if (mesh == this.meshCY) {
            this.pickedAxis = new BABYLON.Vector3(0, 1, 0);
        }
        if (mesh == this.meshCZ) {
            this.pickedAxis = new BABYLON.Vector3(0, 0, 1);
        }
        if (this.pickedAxis) {
            //console.log('pickedAxis: ' + this.pickedAxis);
            //TODO: take into account parent's rotation
            //var m = mesh.parent.getWorldMatrix();
            //BABYLON.Vector3.TransformCoordinatesToRef(this.pickedAxis, m, this.pickedAxis);
            //this.pickedAxis.normalize();
        }

    };
}

/*
 Object.defineProperty(MoveArrows, 'visible', {
 get: function() { return this.meshP.isVisible; },
 set: function(v) { v ? this.show() : this.hide(); }
 });*/
