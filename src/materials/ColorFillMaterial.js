/**
 * Created by yangxinming on 2014/10/18.
 */
define(function(require){
    var Color = require('common/Color.js');
    function ColorFillMaterial(hex, opacity){
        this.color = new Color( ( opacity >= 0  ? (opacity * 0xff) << 24 : 0xff000000) | hex );
    }

    return ColorFillMaterial;
});