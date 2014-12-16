define(function () {
    if (typeof Float32Array !== 'undefined') {
        return Float32Array;
    }
    function GlmatArray(p0) {
        this.length = p0.length || p0;
        for (var i = 0; i < this.length; i++) {
            this[i] = p0[i] || 0;
        }
    }

    var p = GlmatArray.prototype;

    p.set = function (values, opt_offset) {
        opt_offset = opt_offset || 0;
        for (var i = 0; i < values.length && opt_offset + i < this.length; i++) {
            this[opt_offset + i] = values[i];
        }
    };

    p.toString = Array.prototype.join;

    return GlmatArray
});