/**
 * @author bigwhiteshark
 */

define(function () {
    function Vector2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    var p = Vector2.prototype;

    p.set = function (x, y) {
        this.x = x;
        this.y = y;

        return this;
    };

    p.setX = function (x) {
        this.x = x;

        return this;
    };

    p.setY = function (y) {
        this.y = y;

        return this;
    };

    p.setComponent = function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            default:
                throw new Error("index is out of range: " + index);
        }
    };

    p.getComponent = function (index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            default:
                throw new Error("index is out of range: " + index);
        }
    };

    p.copy = function (v) {
        this.x = v.x;
        this.y = v.y;

        return this;
    };

    p.add = function (v) {
        this.x += v.x;
        this.y += v.y;

        return this;
    };

    p.addVectors = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;
    };

    p.addScaler = function (s) {
        this.x += s;
        this.y += s;
    };

    p.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;

        return this;
    };

    p.subVectors = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;

        return this;
    };


    p.multiplyScalar = function (s) {
        this.x *= s;
        this.y *= s;

        return this;
    };

    p.divideScalar = function (scalar) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;

        } else {
            this.x = 0;
            this.y = 0;

        }
        return this;
    };

    p.min = function (v) {
        if (this.x > v.x) {
            this.x = v.x;

        }
        if (this.y > v.y) {
            this.y = v.y;
        }

        return this;
    };

    p.max = function (v) {
        if (this.x < v.x) {
            this.x = v.x;
        }
        if (this.y < v.y) {
            this.y = v.y;
        }

        return this;
    };

    p.clamp = function (min, max) {
        // This function assumes min < max, if this assumption isn't true it will not operate correctly
        if (this.x < min.x) {
            this.x = min.x;
        } else if (this.x > max.x) {
            this.x = max.x;
        }

        if (this.y < min.y) {
            this.y = min.y;

        } else if (this.y > max.y) {
            this.y = max.y;
        }

        return this;
    };

    p.negate = function () {
        return this.multiplyScalar(-1);
    };

    p.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };

    p.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };

    p.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };

    p.normalize = function () {
        return this.divideScalar(this.length());
    };

    p.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };

    p.distanceToSquared = function (v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;
        return dx * dx + dy * dy;
    };

    p.setLength = function (l) {
        var oldLength = this.length();
        if (oldLength !== 0 && l !== oldLength) {
            this.multiplyScalar(l / oldLength);
        }
        return this;
    };

    p.lerp = function (v, alpha) {
        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;

        return this;
    };

    p.equals = function (v) {
        return ( ( v.x === this.x ) && ( v.y === this.y ) );

    };

    p.fromArray = function (array) {
        this.x = array[0];
        this.y = array[1];

        return this;
    };

    p.toArray = function () {
        return [this.x, this.y];
    };

    p.clone = function () {
        return new Vector2(this.x, this.y);
    };

    return Vector2;
});