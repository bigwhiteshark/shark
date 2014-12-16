/**
 * Created by yangxinming on 2014/10/10.
 */
define(function(require){
    var inherits = require('utils/inherits.js');
    var Vector2 = require('math/Vector2.js');
    function RenderableFace3(){

        this.v1 = new Vector2();
        this.v2 = new Vector2();
        this.v3 = new Vector2();

        this.z = null;

        this.color = null;
        this.material = null;
    }

    return RenderableFace3;
});