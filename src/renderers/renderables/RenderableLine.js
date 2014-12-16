/**
 * Created by yangxinming on 2014/10/25.
 */
define(function(){
    var Vector2 = require('math/Vector2.js');

    function RenderableLine(){
        this.v1 = new Vector2();
        this.v2 = new Vector2();

        this.z = null;

        this.color = null;
        this.material = null;
    }
    return RenderableLine;
});