define(function (require) {
    var inherits = require('utils/inherits.js');
    var Vector3 = require('math/Vector3.js');
    var Vertex = require('core/Vertex.js');
    var Geometry = require('core/Geometry.js');
    var Face4 = require('core/Face4.js');

    function Cube(width, height, depth) {
        Geometry.call(this);

        var width_half = width / 2;
        var height_half = height / 2;
        var depth_half = depth / 2;

        this.v(width_half, height_half, -depth_half);
        this.v(width_half, -height_half, -depth_half);
        this.v(-width_half, -height_half, -depth_half);
        this.v(-width_half, height_half, -depth_half);
        this.v(width_half, height_half, depth_half);
        this.v(width_half, -height_half, depth_half);
        this.v(-width_half, -height_half, depth_half);
        this.v(-width_half, height_half, depth_half);

        this.f4(0, 1, 2, 3);
        this.f4(4, 7, 6, 5);
        this.f4(0, 4, 5, 1);
        this.f4(1, 5, 6, 2);
        this.f4(2, 6, 7, 3);
        this.f4(4, 0, 3, 7);
    }

    inherits(Cube, Geometry);
    var p = Cube.prototype;

    p.v = function (x, y, z) {
        this.vertices.push(new Vertex(new Vector3(x, y, z)));
    };

    p.f4 = function (a, b, c, d) {
        this.faces.push(new Face4(a, b, c, d));
    };

    return Cube;
});