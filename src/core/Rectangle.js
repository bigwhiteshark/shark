/**
 * Created by yangxinming on 2014/10/25.
 */
define(function () {
    function Rectangle(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.resize();
        this.isEmpty = false;
    }

    var p = Rectangle.prototype;

    p.set = function (x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.resize();
        this.isEmpty = false;
    };

    p.resize = function () {
        this.width = this.x2 - this.x1;
        this.height = this.y2 - this.y1;
    };

    p.addPoint = function (x, y) {
        if (this.isEmpty) {
            this.x1 = x;
            this.y1 = y;
            this.x2 = x;
            this.y2 = y;
            this.isEmpty = false;
        } else {
            this.x1 = Math.min(this.x1, x);
            this.y1 = Math.min(this.y1, y);
            this.x2 = Math.max(this.x2, x);
            this.y2 = Math.max(this.y2, y);
        }
        this.resize();
    };

    p.addRectangle = function (r) {
        if (this.isEmpty) {
            this.x1 = r.x1;
            this.y1 = r.y1;
            this.x2 = r.x2;
            this.y2 = r.y2;
            this.isEmpty = false;
        } else {
            this.x1 = Math.min(this.x1, r.x1);
            this.y1 = Math.min(this.y1, r.y1);
            this.x2 = Math.max(this.x2, r.x2);
            this.y2 = Math.max(this.y2, r.y2);
        }
        this.resize();
    };

    p.instersects = function (r) {
        return Math.min(this.x2, r.x2) - Math.max(this.x1, r.x1) > 0 && Math.min(this.y2, r.y2) - Math.max(this.y1, r.y1) > 0;
    };

    p.empty = function () {
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
        this.resize();
        this.isEmpty = true;
    };

    p.inflate = function (v) {
        this.x1 -= v;
        this.y1 -= v;
        this.x2 += v;
        this.y2 += v;

        this.resize();
    };

    p.minSelf = function(r) {
        this.x1 = Math.max(this.x1, r.x1);
        this.y1 = Math.max(this.y1, r.y1);
        this.x2 = Math.min(this.x2, r.x2);
        this.y2 = Math.min(this.y2, r.y2);

        this.resize();
    };

    return Rectangle;
});