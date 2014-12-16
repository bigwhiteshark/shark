define(function () {
    function Color(hex) {
        this.styleString = "rgba(0,0,0,1)";
        this.setHex(hex || 0xff000000);
    }

    var p = Color.prototype;

    p.setHex = function (hex) {
        this.hex = hex;
        this.updateRGBA();
        this.updateStyleString();
    };

    p.setRGBA = function (r, g, b, a) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;

        this.updateHex();
        this.updateStyleString();
    };

    p.updateHex = function () {
        this.hex =  Math.floor(this.a * 255) << 24 | this.r << 16 | this.g << 8 | this.b;
    };

    p.updateRGBA = function () {
        this.r = this.hex >> 16 & 0xff;
        this.g = this.hex >> 8 & 0xff;
        this.b = this.hex & 0xff;
        this.a = (this.hex >> 24 & 0xff) / 255;
    };

    p.updateStyleString = function () {
        this.styleString = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + (this.a) + ')';
    };

    return Color;
});