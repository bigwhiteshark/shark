/**
 * @class 3 Dimensional Vector
 * @name Vector3
 * @author bigwhiteshark
 */
define(function () {
    var Float32Array = require("common/Float32Array.js");

    function Vector3(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    var p = Vector3.prototype;

    p.set = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

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

    p.setComponent = function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
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
            case 2:
                return this.z;
            default:
                throw new Error("index is out of range: " + index);
        }
    };

    p.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;
    };

    p.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;
    };

    p.addScaler = function (s) {
        this.x += s;
        this.y += s;
        this.z += s;

        return this;
    };

    p.addVectors = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;

        return this;
    };

    p.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;

        return this;
    };

    p.subVectors = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;
    };

    p.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;

        return this;
    };

    p.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    };

    p.multiplyVectors = function (a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;

        return this;
    };

    /**
     * Transforms the vector3 with a matrix3.
     *
     * @param {Matrix3} m the 3x3 matrix to transform with
     * @returns {Vector3}
     */
    p.transformMat3 = function (m) {
        var x = this.x;
        var y = this.y;
        var z = this.z;

        var elems = m.elements;

        this.x = elems[0] * x + elems[3] * y + elems[6] * z;
        this.y = elems[1] * x + elems[4] * y + elems[7] * z;
        this.z = elems[2] * x + elems[5] * y + elems[8] * z;

        return this;

    };
    /**
     * Transforms the vec3 with a mat4.
     * 4th vector component is implicitly '1'
     *
     * @param {Matrix4} m matrix to transform with
     * @returns {Vector3} out
     */
    p.transformMat4 = function (m) {
        // input: Matrix4 affine matrix
        var x = this.x,
            y = this.y,
            z = this.z,
            elems = m.elements,
            w = elems[3] * x + elems[7] * y + elems[11] * z + elems[15];

        w = w || 1.0;
        this.x = (elems[0] * x + elems[4] * y + elems[8] * z + elems[12]) / w;
        this.y = (elems[1] * x + elems[5] * y + elems[9] * z + elems[13]) / w;
        this.z = (elems[2] * x + elems[6] * y + elems[10] * z + elems[14]) / w;

        return this;
    };

    /**
     * Transforms the vector3 with a quat
     *
     * @param {quat} q quaternion to transform with
     * @returns {vec3} out
     */
    p.transformQuat = function (q) {
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

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

    p.divide = function (v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;

        return this;
    };

    p.divideScalar = function (scalar) {
        if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
        } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
        }

        return this;

    };

    p.min = function (v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);

        return this;
    };

    p.max = function (v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);

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

        return this;
    };

    p.negate = function () {
        return this.multiplyScalar(-1);
    };

    /**
     * Returns the inverse of the components of a vec3
     *
     * @returns {Vector3}
     */
    p.inverse = function () {
        this.x = 1.0 / this.x;
        this.y = 1.0 / this.y;
        this.z = 1.0 / this.z;
        return this;
    };

    p.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };

    p.lengthSq = function () {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    };

    p.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
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
        return this;
    };

    p.cross = function (v) {
        var x = this.x, y = this.y, z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;

        return this;
    };

    p.crossVectors = function (a, b) {
        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    };

    p.scale = function (scale) {
        this.x = this.x * scale;
        this.y = this.y * scale;
        this.z = this.z * scale;

        return this;
    };

    p.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };

    p.distanceToSquared = function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;
    };

    p.equals = function (v) {
        return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );
    };

    p.fromArray = function (array) {
        this.x = array[0];
        this.y = array[1];
        this.z = array[2];

        return this;
    };

    p.toArray = function () {
        return [this.x, this.y, this.z];
    };

    p.clone = function () {
        return new Vector3(this.x, this.y, this.z);
    };

    return Vector3;
});