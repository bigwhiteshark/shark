define(function (require) {
    var Vector3 = require('math/Vector3.js');
    var Matrix4 = require('math/Matrix4.js');

    function Object3D(material) {
        this.name = '';

        this.up = new Vector3(0, 1, 0);
        this.position = new Vector3(0, 0, 0);
        this.rotation = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);

        this.parent = undefined;
        this.children = [];

        //表示看的位置，默认是原点
        this.target = {
            position: new Vector3(0, 0, 0)
        };

        //模型矩阵，对象仿射变换的矩阵,如平移、旋转和缩放。这些都是在对象自身空间,围绕对象的原点
        this.matrix = new Matrix4();

        //空间矩阵,用来表示的位置,旋转和缩放对象相对于其父对象,最终在表示对象在世界空间的位置
        this.matrixWorld = new Matrix4();

        this.dirty = true;

        this.visible = true;

        this.screen = new Vector3(0, 0, 0);

        this.material = material instanceof Array ? material : [material];

        this.autoUpdateMatrix = true;

        this.overdraw = false;
    }

    var p = Object3D.prototype;

    p.add = function (child) {
        if (child instanceof Object3D) {
            if (!!child.parent) {
                child.parent.remove(child);
            }
            child.parent = this;
            this.children.push(child);
            this.dirty = true;
        } else {
            throw("Child object must have a prototype of Object3D");
        }
    };

    p.remove = function (child) {
        var index = this.children.indexOf(child);

        if (~index) {
            this.children.splice(index, 1);
            this.dirty = true;
        }
    };

    p.lookAt = function () {

    };

    p.traverse = function (callback) {
        callback(this);
        for (var i = 0, l = this.children.length; i < l; i++) {
            this.children[i].traverse(callback);
        }
    };

    p.rotateOnAxis = function () {

    };

    p.rotateX = function () {

    };

    p.rotateY = function () {

    };

    p.rotateZ = function () {

    };

    p.translateOnAxis = function () {

    };

    p.translateX = function () {

    };

    p.translateY = function () {

    };

    p.translateZ = function () {

    };

    p.clone = function () {

    };

    p.updateMatrix = function () {
        this.matrix.identity();
        this.matrix.translate(this.position);
        this.matrix.rotateX(this.rotation.x);
        this.matrix.rotateY(this.rotation.y);
        this.matrix.rotateZ(this.rotation.z);
        this.matrix.scale(this.scale);
    };

    return Object3D
});