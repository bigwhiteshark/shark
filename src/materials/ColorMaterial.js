/**
 * Created by yangxinming on 2014/10/6.
 */
define(function(require){
    var Color = require('common/Color.js');
    function ColorMaterial(hex, opacity){
        this.color = new Color( (opacity ? (opacity * 0xff) << 24 : 0xff000000) | hex );
    }

    return ColorMaterial;
});