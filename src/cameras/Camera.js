define(function (require) {
    var inherits = require('utils/inherits.js');
    var Object3D = require('core/Object3D.js');
    var Matrix4 = require('math/Matrix4.js');
    var degree_to_ridian = require('utils/degree_to_radian.js');

    function Camera(fov, aspect, near, far) {
        Object3D.call(this);


        var ymax = near * Math.tan(degree_to_ridian(fov) / 2);
        var ymin = - ymax;
        var xmin = ymin * aspect;
        var xmax = ymax * aspect;

        this.name = "camera";

        //相机使用的投影矩阵
        this.projectionMatrix = new Matrix4();

        //相机的逆矩阵,用于定位所有世界对象相对于相机，默认为单位矩阵
        this.inverseMatrix = new Matrix4();

        this.projectionMatrix.frustum(xmin, xmax, ymin, ymax, near, far);
    }

    inherits(Camera, Object3D);
    var p = Camera.prototype;

    p.updateMatrix = function () {
        this.matrix.lookAt(this.position, this.target.position, this.up);
    };

    return Camera;
});