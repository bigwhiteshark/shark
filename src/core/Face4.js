define(function(require){
    var Color = require('common/Color.js');
    var Vector3 = require('math/Vector3.js');

    function Face4(a, b, c, d, normal, color){

        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;


        this.normal = normal || new Vector3();
        this.screen = new Vector3();

        this.color = color || new Color(0x000000);
    }

    return Face4;
});