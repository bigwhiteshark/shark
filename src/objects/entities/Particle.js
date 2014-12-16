/**
 * Created by yangxinming on 2014/10/6.
 */
define(function(require){
    var Object3D = require('core/Object3D.js');
    var inherits = require('utils/inherits.js');

    function Particle(material){
        Object3D.call(this, material);
        this.size = 1;
        this.autoUpdateMatrix = false;
    }
    inherits(Particle,Object3D);

    return Particle;
});