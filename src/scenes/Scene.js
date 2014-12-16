define(function () {
    function Scene() {
        this.objects = [];
    }
    var p = Scene.prototype;

    p.addObject = function (object) {
        this.objects.push(object);
    };

    p.removeObject = function (object) {
        var objects = this.objects;
        for (var i = 0, l = objects.length; i < l; i++) {
            if (object == this.objects[i]) {
                objects.splice(i, 1);
                return;
            }
        }
    };

    return Scene;
});