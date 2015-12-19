/**
 * Created by timapple on 05.12.2015.
 */

function Repulsion(editor, onlyOnce) {
    this.editor = editor;
    this.onlyOnce = onlyOnce || false;
    this._done_one = false;

    this.tick = function (dt) {
        if (this.onlyOnce && this._done_one)
            return;
        var o = [];
        this.editor.objects.forEach(function (obj) {
            if (obj.target instanceof Neuron)
                o.push({
                    o: obj,
                    d: 10,
                    velosity: BABYLON.Vector3.Zero()
                });
        });
        var isWorked = false;
        for (var i = 0; i < o.length; i++) {
            for (var j = i + 1; j < o.length; j++) {
                var r = (o[i].d / 2 + o[j].d / 2) * 1.5;
                var r2 = r * r;

                var s = o[i].o.position.subtract(o[j].o.position);
                var d2 = s.length() * s.length();

                while (d2 < 0.0001) {
                    s.copyFromFloats(0.5 - Math.random(), 0.5 - Math.random(), 0.5 - Math.random());
                    d2 = s.length() * s.length();
                }
                //console.log(d2);
                if (d2 < r2) {
                    s.normalize();

                    //var f = o[i].d * o[j].d / d2;
                    var f = 10;
                    s.scaleInPlace(f);
                    o[i].velosity.addInPlace(s);
                    o[j].velosity.addInPlace(s.negate());

                    isWorked = true;
                }
            }
            o[i].o.position.x += o[i].velosity.x * dt / 1000;
            o[i].o.position.y += o[i].velosity.y * dt / 1000;
        }
        if (!isWorked)
            this._done_one = true;
    };
}