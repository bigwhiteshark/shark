define(function(require){
    var inherits = require('utils/inherits.js');
    var Object3D = require('core/Object3D.js');
    function Mesh(geometry, material){
        Object3D.call(this, material);
        this.geometry = geometry;
        this.doubleSided = false;
    }
    inherits(Mesh,Object3D);


    return Mesh;
});