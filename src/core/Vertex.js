/**
 * Created by yangxinming on 2014/10/7.
 */
define(function (require) {
    var Vector3 = require('math/Vector3.js');

    function Vertex(position, normal) {
        this.position = position || new Vector3();
        this.normal = normal || new Vector3();
        this.screen = new Vector3();

        this.visible = true;
    }

    return Vertex;
});