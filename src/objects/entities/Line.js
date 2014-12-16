/**
 * Created by yangxinming on 2014/10/10.
 */
define(function(require){
    var Object3D = require('core/Object3D.js');
    var inherits = require('utils/inherits.js');

    function Line(geometry,material){
        Object3D.call(this, material);
        this.geometry = geometry;
    }
    inherits(Line,Object3D);

    return Line;
});