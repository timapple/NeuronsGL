/**
 * Created by timapple on 05.12.2015.
 */

function Repulsion(b) {
    this.b = b;

    this.tick = function (dt) {
        var o = [];
        this.b.neurons.forEach(function (n) {
            o.push({
                n: n,
                velosity: BABYLON.Vector3.Zero()
            });
        });
        for (var i = 0; i < o.length; i++) {
            for (var j = i + 1; j < o.length; j++) {
                var r = (o[i].n.diameter / 2 + o[j].n.diameter / 2) * 1.5;
                var r2 = r * r;
                var d2 = BABYLON.Vector3.DistanceSquared(o[i].n.position, o[j].n.position);
                if (d2 < r2 * 0.2)
                    d2 = r2 * 0.2;
                if (d2 < r2) {
                    var s = o[i].n.position.subtract(o[j].n.position);
                    s.normalize();
                    var f = o[i].n.diameter * o[j].n.diameter / d2;
                    s.scaleInPlace(6.0 * f);
                    o[i].velosity.addInPlace(s);
                    o[j].velosity.addInPlace(s.negate());
                }
            }
            o[i].n.position.x += o[i].velosity.x * dt / 1000;
            o[i].n.position.y += o[i].velosity.y * dt / 1000;
        }
    }
}