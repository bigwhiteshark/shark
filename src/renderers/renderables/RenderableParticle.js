/**
 * Created by yangxinming on 2014/10/14.
 */
define(function(require){
    var inherits = require('utils/inherits.js');
    var Vector2 = require('math/Vector2.js');
    function RenderableParticle(){
        this.x = null;
        this.y = null;

        this.z = null;

        this.color = null;
        this.material = null;
    }

    return RenderableParticle;
});