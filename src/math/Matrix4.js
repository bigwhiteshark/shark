define(function (require) {
    var Float32Array = require("common/Float32Array.js");
    var Vector3 = require("math/Vector3.js");


    if (!GLMAT_EPSILON) {
        var GLMAT_EPSILON = 0.000001;
    }

    function Matrix4() {
        var elems = new Float32Array(16);
        elems[0] = 1;
        elems[1] = 0;
        elems[2] = 0;
        elems[3] = 0;
        elems[4] = 0;
        elems[5] = 1;
        elems[6] = 0;
        elems[7] = 0;
        elems[8] = 0;
        elems[9] = 0;
        elems[10] = 1;
        elems[11] = 0;
        elems[12] = 0;
        elems[13] = 0;
        elems[14] = 0;
        elems[15] = 1;
        this.elements = elems;
    }
    var p = Matrix4.prototype;

    p.clone = function (a) {
        var elems = new Float32Array(16),
            ae = a.elements;
        elems[0] = ae[0];
        elems[1] = ae[1];
        elems[2] = ae[2];
        elems[3] = ae[3];
        elems[4] = ae[4];
        elems[5] = ae[5];
        elems[6] = ae[6];
        elems[7] = ae[7];
        elems[8] = ae[8];
        elems[9] = ae[9];
        elems[10] = ae[10];
        elems[11] = ae[11];
        elems[12] = ae[12];
        elems[13] = ae[13];
        elems[14] = ae[14];
        elems[15] = ae[15];

        return this;
    };

    p.copy = function (a) {
        var elems = new Float32Array(16),
            ae = a.elements;
        elems[0] = ae[0];
        elems[1] = ae[1];
        elems[2] = ae[2];
        elems[3] = ae[3];
        elems[4] = ae[4];
        elems[5] = ae[5];
        elems[6] = ae[6];
        elems[7] = ae[7];
        elems[8] = ae[8];
        elems[9] = ae[9];
        elems[10] = ae[10];
        elems[11] = ae[11];
        elems[12] = ae[12];
        elems[13] = ae[13];
        elems[14] = ae[14];
        elems[15] = ae[15];
        return this;
    };

    /**
     * Sets a matrix back to the identity matrix
     */
    p.identity = function () {
        var elems = this.elements;
        elems[0] = 1;
        elems[1] = 0;
        elems[2] = 0;
        elems[3] = 0;
        elems[4] = 0;
        elems[5] = 1;
        elems[6] = 0;
        elems[7] = 0;
        elems[8] = 0;
        elems[9] = 0;
        elems[10] = 1;
        elems[11] = 0;
        elems[12] = 0;
        elems[13] = 0;
        elems[14] = 0;
        elems[15] = 1;
        return this;
    };

    /**
     * Transpose the values of a Matrix4
     *
     * @returns {Matrix4}
     */
    p.transpose = function(){
        var elems = this.elements,
            tmp;

        tmp = elems[1]; elems[1] = elems[4]; elems[4] = tmp;
        tmp = elems[2]; elems[2] = elems[8]; elems[8] = tmp;
        tmp = elems[6]; elems[6] = elems[9]; elems[9] = tmp;

        tmp = elems[3]; elems[3] = elems[12]; elems[12] = tmp;
        tmp = elems[7]; elems[7] = elems[13]; elems[13] = tmp;
        tmp = elems[11]; elems[11] = elems[14]; elems[14] = tmp;

        return this;
    };

    /**
     * Creates a matrix to represent a frustum -
     * used for perspective and orthographic
     * projections
     *
     * @see <a href="http://www.opengl.org/sdk/docs/man/xhtml/glFrustum.xml">OpenGL glFrustum reference</a>
     *
     * @param {Number} left The coordinate for the left clipping plane
     * @param {Number} right The coordinate for the right clipping plane
     * @param {Number} bottom The coordinate for the bottom clipping plane
     * @param {Number} top The coordinate for the top clipping plane
     * @param {Number} near The distance to the near clipping plane
     * @param {Number} far The distance to the far clipping plane
     */
    p.frustum = function (left, right, bottom, top, near, far) {
        var rl = 1 / (right - left),
            tb = 1 / (top - bottom),
            nf = 1 / (near - far),
            elems = this.elements;

        elems[0] = (near * 2) * rl;
        elems[1] = 0;
        elems[2] = 0;
        elems[3] = 0;
        elems[4] = 0;
        elems[5] = (near * 2) * tb;
        elems[6] = 0;
        elems[7] = 0;
        elems[8] = (right + left) * rl;
        elems[9] = (top + bottom) * tb;
        elems[10] = (far + near) * nf;
        elems[11] = -1;
        elems[12] = 0;
        elems[13] = 0;
        elems[14] = (far * near * 2) * nf;
        elems[15] = 0;

        return this;
    };

    /**
     * Creates a perspective matrix for a cameras.
     *
     * @param {Number} fovy Vertical field of view in radians
     * @param {Number} aspect The ratio of width / height of the screen
     * @param {Number} near The distance to the near clipping plane
     * @param {Number} far The distance to the far clipping plane
     */
    p.perspective = function (fovy, aspect, near, far) {
        var f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far),
            elems = this.elements;


        elems[0] = f / aspect;
        elems[1] = 0;
        elems[2] = 0;
        elems[3] = 0;
        elems[4] = 0;
        elems[5] = f;
        elems[6] = 0;
        elems[7] = 0;
        elems[8] = 0;
        elems[9] = 0;
        elems[10] = (far + near) * nf;
        elems[11] = -1;
        elems[12] = 0;
        elems[13] = 0;
        elems[14] = (2 * far * near) * nf;
        elems[15] = 0;

        return this;
    };

    /**
     * Creates an orthographic projection for the cameras. Worth noting
     * that WebGL contexts run differently in Y than most other contexts. Where
     * typically the Y value gets larger the further you go down the screen, in
     * the case of the GLs 1 is at the top of the screen, -1 at the bottom, so you
     * end up &quot;inverting&quot; the Y values; top is height / 2, bottom is -height / 2.
     *
     * @see <a href="http://www.songho.ca/opengl/gl_projectionmatrix.html">Song Ho Ahn's Explanation of OpenGL's Projection Matrix</a>
     *
     * @param {Number} left The left value of the view frustum, typically -width / 2
     * @param {Number} right The right value of the view frustum, typically width / 2
     * @param {Number} top The top value of the view frustum, typically height / 2
     * @param {Number} bottom The bottom value of the view frustum, typically -height / 2
     * @param {Number} near The distance to the near clipping plane
     * @param {Number} far The distance to the far clipping plane
     */
    p.orthographic = function (left, right, top, bottom, near, far) {
        var lr = 1 / (left - right),
            bt = 1 / (bottom - top),
            nf = 1 / (near - far),
            elems = this.elements;

        elems[0] = -2 * lr;
        elems[1] = 0;
        elems[2] = 0;
        elems[3] = 0;
        elems[4] = 0;
        elems[5] = -2 * bt;
        elems[6] = 0;
        elems[7] = 0;
        elems[8] = 0;
        elems[9] = 0;
        elems[10] = 2 * nf;
        elems[11] = 0;
        elems[12] = (left + right) * lr;
        elems[13] = (top + bottom) * bt;
        elems[14] = (far + near) * nf;
        elems[15] = 1;

        return this;
    };

    /**
     * Modifies the matrix to look at a specific place
     *
     * @param {Vector3} eye The position of the eye. Typically the cameras or object position
     * @param {Vector3} center The position in 3D space to look at
     * @param {Vector3} up The world's up vector
     */
    p.lookAt = function (eye, center, up) {
        /*var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye.x,
            eyey = eye.y,
            eyez = eye.z,
            upx = up.x,
            upy = up.y,
            upz = up.z,
            centerx = center.x,
            centery = center.y,
            centerz = center.z,
            elems = this.elements;

        if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
            Math.abs(eyey - centery) < GLMAT_EPSILON &&
            Math.abs(eyez - centerz) < GLMAT_EPSILON) {
            return this.identity();
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        elems[0] = x0;
        elems[1] = -y0;
        elems[2] = -z0;
        elems[3] = 0;
        elems[4] = x1;
        elems[5] = -y1;
        elems[6] = -z1;
        elems[7] = 0;
        elems[8] = x2;
        elems[9] = -y2;
        elems[10] = -z2;
        elems[11] = 0;
        elems[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        elems[13] = (y0 * eyex + y1 * eyey + y2 * eyez);
        elems[14] = (z0 * eyex + z1 * eyey + z2 * eyez);
        elems[15] = 1;*/

        var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
            eyex = eye.x,
            eyey = eye.y,
            eyez = eye.z,
            upx = up.x,
            upy = up.y,
            upz = up.z,
            centerx = center.x,
            centery = center.y,
            centerz = center.z,
            elems = this.elements;

        if (Math.abs(eyex - centerx) < GLMAT_EPSILON &&
            Math.abs(eyey - centery) < GLMAT_EPSILON &&
            Math.abs(eyez - centerz) < GLMAT_EPSILON) {
            return this.identity(elems);
        }

        z0 = eyex - centerx;
        z1 = eyey - centery;
        z2 = eyez - centerz;

        len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        x0 = upy * z2 - upz * z1;
        x1 = upz * z0 - upx * z2;
        x2 = upx * z1 - upy * z0;
        len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if (!len) {
            x0 = 0;
            x1 = 0;
            x2 = 0;
        } else {
            len = 1 / len;
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        y0 = z1 * x2 - z2 * x1;
        y1 = z2 * x0 - z0 * x2;
        y2 = z0 * x1 - z1 * x0;

        len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if (!len) {
            y0 = 0;
            y1 = 0;
            y2 = 0;
        } else {
            len = 1 / len;
            y0 *= len;
            y1 *= len;
            y2 *= len;
        }

        elems[0] = x0;
        elems[1] = -y0;
        elems[2] = z0;
        elems[3] = 0;
        elems[4] = x1;
        elems[5] = -y1;
        elems[6] = z1;
        elems[7] = 0;
        elems[8] = x2;
        elems[9] = -y2;
        elems[10] = z2;
        elems[11] = 0;
        elems[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        elems[13] = (y0 * eyex + y1 * eyey + y2 * eyez);
        elems[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        elems[15] = 1;

        return this;
    };

    p.translate = function (v) {
        var x = v.x, y = v.y, z = v.z,
            elems = this.elements;

        elems[12] = elems[0] * x + elems[4] * y + elems[8] * z + elems[12];
        elems[13] = elems[1] * x + elems[5] * y + elems[9] * z + elems[13];
        elems[14] = elems[2] * x + elems[6] * y + elems[10] * z + elems[14];
        elems[15] = elems[3] * x + elems[7] * y + elems[11] * z + elems[15];

        return this;
    };

    /**
     * Scales a matrix up using a vector
     *
     * @param {Vector3} v The vector containing the scale values
     * @see <a href="http://en.wikipedia.org/wiki/Scaling_(geometry)">Wikipedia on scaling a matrix with a vector</a>
     * @returns {Matrix4}
     */
    p.scale = function (v) {
        var elems = this.elements;
        var x = v.x, y = v.y, z = v.z;

        elems[0] *= x; elems[4] *= y; elems[8] *= z;
        elems[1] *= x; elems[5] *= y; elems[9] *= z;
        elems[2] *= x; elems[6] *= y; elems[10] *= z;
        elems[3] *= x; elems[7] *= y; elems[11] *= z;

        return this;
    };

    /**
     * Rotates a Matrix4 by the given angle
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @param {Vector3} axis the axis to rotate around
     *
     * @returns {Matrix4}
     */
    p.rotate = function (rad, axis) {
        var x = axis.x, y = axis.y, z = axis.z,
            len = Math.sqrt(x * x + y * y + z * z),
            s, c, t, elems = this.elements,
            a00, a01, a02, a03,
            a10, a11, a12, a13,
            a20, a21, a22, a23,
            b00, b01, b02,
            b10, b11, b12,
            b20, b21, b22;

        if (Math.abs(len) < GLMAT_EPSILON) { return null; }

        len = 1 / len;
        x *= len;
        y *= len;
        z *= len;

        s = Math.sin(rad);
        c = Math.cos(rad);
        t = 1 - c;

        a00 = elems[0];
        a01 = elems[1];
        a02 = elems[2];
        a03 = elems[3];
        a10 = elems[4];
        a11 = elems[5];
        a12 = elems[6];
        a13 = elems[7];
        a20 = elems[8];
        a21 = elems[9];
        a22 = elems[10];
        a23 = elems[11];

        // Construct the elements of the rotation matrix
        b00 = x * x * t + c;
        b01 = y * x * t + z * s;
        b02 = z * x * t - y * s;
        b10 = x * y * t - z * s;
        b11 = y * y * t + c;
        b12 = z * y * t + x * s;
        b20 = x * z * t + y * s;
        b21 = y * z * t - x * s;
        b22 = z * z * t + c;

        // Perform rotation-specific matrix multiplication
        elems[0] = a00 * b00 + a10 * b01 + a20 * b02;
        elems[1] = a01 * b00 + a11 * b01 + a21 * b02;
        elems[2] = a02 * b00 + a12 * b01 + a22 * b02;
        elems[3] = a03 * b00 + a13 * b01 + a23 * b02;
        elems[4] = a00 * b10 + a10 * b11 + a20 * b12;
        elems[5] = a01 * b10 + a11 * b11 + a21 * b12;
        elems[6] = a02 * b10 + a12 * b11 + a22 * b12;
        elems[7] = a03 * b10 + a13 * b11 + a23 * b12;
        elems[8] = a00 * b20 + a10 * b21 + a20 * b22;
        elems[9] = a01 * b20 + a11 * b21 + a21 * b22;
        elems[10] = a02 * b20 + a12 * b21 + a22 * b22;
        elems[11] = a03 * b20 + a13 * b21 + a23 * b22;

        return this;
    };

    /**
     * Rotates a matrix by the given angle around the X axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Matrix4}
     */
    p.rotateX = function (rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            elems = this.elements,
            a10 = elems[4],
            a11 = elems[5],
            a12 = elems[6],
            a13 = elems[7],
            a20 = elems[8],
            a21 = elems[9],
            a22 = elems[10],
            a23 = elems[11];

        // Perform axis-specific matrix multiplication
        elems[4] = a10 * c + a20 * s;
        elems[5] = a11 * c + a21 * s;
        elems[6] = a12 * c + a22 * s;
        elems[7] = a13 * c + a23 * s;
        elems[8] = a20 * c - a10 * s;
        elems[9] = a21 * c - a11 * s;
        elems[10] = a22 * c - a12 * s;
        elems[11] = a23 * c - a13 * s;
        return this;
    };

    /**
     * Rotates a matrix by the given angle around the Y axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Matrix4}
     */
    p.rotateY = function (rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            elems = this.elements,
            a00 = elems[0],
            a01 = elems[1],
            a02 = elems[2],
            a03 = elems[3],
            a20 = elems[8],
            a21 = elems[9],
            a22 = elems[10],
            a23 = elems[11];

        // Perform axis-specific matrix multiplication
        elems[0] = a00 * c - a20 * s;
        elems[1] = a01 * c - a21 * s;
        elems[2] = a02 * c - a22 * s;
        elems[3] = a03 * c - a23 * s;
        elems[8] = a00 * s + a20 * c;
        elems[9] = a01 * s + a21 * c;
        elems[10] = a02 * s + a22 * c;
        elems[11] = a03 * s + a23 * c;
        return this;
    };

    /**
     * Rotates a matrix by the given angle around the Z axis
     *
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {Matrix4}
     */
    p.rotateZ = function (rad) {
        var s = Math.sin(rad),
            c = Math.cos(rad),
            elems = this.elements,
            a00 = elems[0],
            a01 = elems[1],
            a02 = elems[2],
            a03 = elems[3],
            a10 = elems[4],
            a11 = elems[5],
            a12 = elems[6],
            a13 = elems[7];

        // Perform axis-specific matrix multiplication
        elems[0] = a00 * c + a10 * s;
        elems[1] = a01 * c + a11 * s;
        elems[2] = a02 * c + a12 * s;
        elems[3] = a03 * c + a13 * s;
        elems[4] = a10 * c - a00 * s;
        elems[5] = a11 * c - a01 * s;
        elems[6] = a12 * c - a02 * s;
        elems[7] = a13 * c - a03 * s;
        return this;
    };

    /**
     * Multiplies this matrix by another
     *
     * @param {Matrix4} m The matrix by which to multiply the current one
     */

    p.multiply = function (m) {
        return this.multiplyMatrices(this, m);
    };

    p.multiplyMatrices = function (a, b) {
        var ae = a.elements;
        var be = b.elements;
        var elems = this.elements;

        var a00 = ae[0], a01 = ae[1], a02 = ae[2], a03 = ae[3],
            a10 = ae[4], a11 = ae[5], a12 = ae[6], a13 = ae[7],
            a20 = ae[8], a21 = ae[9], a22 = ae[10], a23 = ae[11],
            a30 = ae[12], a31 = ae[13], a32 = ae[14], a33 = ae[15];

        // Cache only the current line of the second matrix
        var b0  = be[0], b1 = be[1], b2 = be[2], b3 = be[3];
        elems[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        elems[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        elems[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        elems[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = be[4]; b1 = be[5]; b2 = be[6]; b3 = be[7];
        elems[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        elems[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        elems[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        elems[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = be[8]; b1 = be[9]; b2 = be[10]; b3 = be[11];
        elems[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        elems[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        elems[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        elems[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        b0 = be[12]; b1 = be[13]; b2 = be[14]; b3 = be[15];
        elems[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
        elems[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
        elems[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
        elems[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

        return this;
    };

    /**
     * Scales the whole matrix by a scalar value
     *
     * @param {Number} s The value by which to multiply each matrix component
     */
    p.multiplyScalar = function (s) {
        var elems = this.elements;

        elems[0] *= s;
        elems[4] *= s;
        elems[8] *= s;
        elems[12] *= s;
        elems[1] *= s;
        elems[5] *= s;
        elems[9] *= s;
        elems[13] *= s;
        elems[2] *= s;
        elems[6] *= s;
        elems[10] *= s;
        elems[14] *= s;
        elems[3] *= s;
        elems[7] *= s;
        elems[11] *= s;
        elems[15] *= s;

        return this;
    };

    /**
     * Calculates the determinant of the matrix. Primarily used for inverting the matrix
     *
     * @see <a href="http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm">Inverting a 4D matrix on Euclidean Space</a>
     */
    p.determinant = function () {
        var elems = this.elements,
            a00 = elems[0], a01 = elems[1], a02 = elems[2], a03 = elems[3],
            a10 = elems[4], a11 = elems[5], a12 = elems[6], a13 = elems[7],
            a20 = elems[8], a21 = elems[9], a22 = elems[10], a23 = elems[11],
            a30 = elems[12], a31 = elems[13], a32 = elems[14], a33 = elems[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    };

    /**
     * Inverts the matrix.
     *
     * @throws An error if the matrix determinant is zero
     * @see <a href="http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm">Inverting a 4D matrix on Euclidean Space</a>
     */
    p.invert = function () {
        var elems = this.elements,
            a00 = elems[0], a01 = elems[1], a02 = elems[2], a03 = elems[3],
            a10 = elems[4], a11 = elems[5], a12 = elems[6], a13 = elems[7],
            a20 = elems[8], a21 = elems[9], a22 = elems[10], a23 = elems[11],
            a30 = elems[12], a31 = elems[13], a32 = elems[14], a33 = elems[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            throw("Matrix determinant is zero, can't invert.");
        }
        det = 1.0 / det;

        elems[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        elems[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        elems[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        elems[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        elems[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        elems[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        elems[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        elems[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        elems[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        elems[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        elems[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        elems[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        elems[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        elems[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        elems[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        elems[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return this;
    };

    /**
     * Converts the Matrix4 to an array suitable for use in WebGL.
     *
     * @throws An error if a Float32Array is not provided
     */
    p.toArray = function () {
        var elems = this.elements;
        return [
            elems[0], elems[1], elems[2], elems[3],
            elems[4], elems[5], elems[6], elems[7],
            elems[8], elems[9], elems[10], elems[11],
            elems[12], elems[13], elems[14], elems[15]
        ];
    };


    p.fromArray = function (array) {
        this.elements.set(array);
        return this;
    };

    p.toString = function() {
        var elems = this.elements;
        return "| " +elems[0] + " " + elems[1] + " " + elems[2] + " " + elems[3] + " |\n" +
        "| " + elems[4] + " " + elems[5] + " " + elems[6] + " " + elems[7] + " |\n" +
        "| " + elems[8] + " " + elems[9] + " " + elems[10] + " " + elems[11] + " |\n" +
        "| " + elems[12] + " " + elems[13] + " " + elems[14] + " " + elems[15] + " |";
    };

    return Matrix4;
});

