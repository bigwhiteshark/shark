/**
 * Created by yangxinming on 2014/10/14.
 */
define(function(require){
    var inherits = require('utils/inherits.js');
    var Vector2 = require('math/Vector2.js');
    function RenderableFace4(){

        this.v1 = new Vector2();
        this.v2 = new Vector2();
        this.v3 = new Vector2();
        this.v4 = new Vector2();

        this.z = null;

        this.color = null;
        this.material = null;
    }

    return RenderableFace4;
});