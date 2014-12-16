/**
 * @class 4 Dimensional Vector
 * @name Vector4
 * @author bigwhiteshark
 */
define(function () {
    function Vector4(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = ( w !== undefined ) ? w : 1;
    }

    var p = Vector4.prototype;

    p.set = function (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

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

    p.setZ = function (z) {
        this.z = z;
        return this;
    };

    p.setW = function (w) {
        this.w = w;
        return this;
    };

    p.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = ( v.w !== undefined ) ? v.w : 1;

        return this;
    };

    p.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;
    };

    p.addScalar = function (s) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;

        return this;
    };

    p.addVectors = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;

        return this;
    };

    p.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;

        return this;
    };

    p.subVectors = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;

        return this;
    };

    p.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;

        return this;
    };

    p.transformMat4 = function (m) {
        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        var e = m.elements;
        this.x = e[0] * x + e[4] *        y + e[8] * z + e[12] * w;
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
        this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

        return this;
    };

    /**
     * Transforms the vec4 with a quat
     *
     * @param {Vector4} a the vector to transform
     * @param {quat} q quaternion to transform with
     */
    p.transformQuat = function(q) {
        var x = this.x, y = this.y, z = this.z,
            qx = q.x, qy = q.y, qz = q.z, qw = q.w,

        // calculate quat * vec
            ix = qw * x + qy * z - qz * y,
            iy = qw * y + qz * x - qx * z,
            iz = qw * z + qx * y - qy * x,
            iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
    };

    p.divideScalar = function (scalar) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
            this.w *= invScalar;

        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
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

        if (this.z > v.z) {
            this.z = v.z;
        }

        if (this.w > v.w) {
            this.w = v.w;
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

        if (this.z < v.z) {
            this.z = v.z;
        }

        if (this.w < v.w) {
            this.w = v.w;
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

        if (this.z < min.z) {
            this.z = min.z;
        } else if (this.z > max.z) {
            this.z = max.z;
        }

        if (this.w < min.w) {
            this.w = min.w;
        } else if (this.w > max.w) {
            this.w = max.w;
        }

        return this;
    };

    p.negate = function () {

        return this.multiplyScalar(-1);
    };

    p.dot = function (v) {

        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    };

    p.lengthSq = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

    };

    p.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

    };

    p.lengthManhattan = function () {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
    };

    p.normalize = function () {
        return this.divideScalar(this.length());

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
        this.z += ( v.z - this.z ) * alpha;
        this.w += ( v.w - this.w ) * alpha;

        return this;
    };

    p.equals = function (v) {
        return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );
    };

    p.fromArray = function (array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];
        this.w = array[3];

        return this;
    };

    p.toArray = function () {
        return [this.x, this.y, this.z, this.w];
    };

    p.clone = function () {
        return new Vector4(this.x, this.y, this.z, this.w);
    };

    return Vector4;
});