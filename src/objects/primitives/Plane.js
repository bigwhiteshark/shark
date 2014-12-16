define(function (require) {
    var inherits = require('utils/inherits.js');
    var Vector2 = require('math/Vector2.js');
    var Vector3 = require('math/Vector3.js');
    var Vertex = require('core/Vertex.js');
    var Geometry = require('core/Geometry.js');
    var Face4 = require('core/Face4.js');
    var Face3 = require('core/Face3.js');

    function Plane(width, height, widthSegments, heightSegments) {
        Geometry.call(this);

        var widthHalf = width / 2,
            heightHalf = height / 2,

            gridX = widthSegments || 1,
            gridY = heightSegments || 1,
            gridX1 = gridX + 1,
            gridY1 = gridY + 1,
            segment_width = width / gridX,
            segment_height = height / gridY;


        for (var iy = 0; iy < gridY1; iy++) {
            for (var ix = 0; ix < gridX1; ix++) {
                var x = ix * segment_width - widthHalf;
                var y = iy * segment_height - heightHalf;
                this.vertices.push(new Vertex(new Vector3(x, -y, 0)));
            }

        }

        for (iy = 0; iy < gridY; iy++) {
            for (ix = 0; ix < gridX; ix++) {
                var a = ix + gridX1 * iy;
                var b = ix + gridX1 * ( iy + 1 );
                var c = ( ix + 1 ) + gridX1 * iy;
                this.faces.push(new Face3(a, b, c));
                this.uvs.push([
                    new Vector2(ix / gridX, iy / gridY),
                    new Vector2(ix / gridX, ( iy + 1 ) / gridY),
                    new Vector2((ix + 1) / gridX, iy / gridY)
                ]);

                a = ( ix + 1 ) + gridX1 * ( iy + 1 );
                b = ( ix + 1 ) + gridX1 * iy;
                c = ix + gridX1 * ( iy + 1 );
                this.faces.push(new Face3(a, b, c));
                this.uvs.push([
                    new Vector2((ix + 1) / gridX, ( iy + 1 ) / gridY),
                    new Vector2((ix + 1) / gridX, iy / gridY),
                    new Vector2(ix / gridX, ( iy + 1 ) / gridY)
                ]);
            }
        }
    }

    inherits(Plane, Geometry);
    return Plane;
});