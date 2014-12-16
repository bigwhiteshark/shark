/**
 * Created by yangxinming on 2014/10/6.
 */
define(function (require) {
    var Camera = require('cameras/Camera.js');
    var CanvasRenderer = require('renderers/CanvasRenderer.js');
    var FaceColorFillMaterial = require('materials/FaceColorFillMaterial.js');
    var ColorFillMaterial = require('materials/ColorFillMaterial.js');
    var Scene = require('scenes/Scene.js');
    var Mesh = require('objects/entities/Mesh.js');
    var Cube = require('objects/primitives/Cube.js');
    var Plane = require('objects/primitives/Plane.js');

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var container;

    var camera;
    var scene;
    var renderer;

    var cube, plane;

    var targetRotation = 0;
    var targetRotationOnMouseDown = 0;

    var mouseX = 0;
    var mouseXOnMouseDown = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    setInterval(loop, 1000 / 60);
    //loop();

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);


        camera = new Camera( 70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
        camera.position.y = 150;
        camera.position.z = 500;
        camera.target.position.y = 150;

        scene = new Scene();

        // Cube
        var geometry = new Cube(200, 200, 200);
        for (var i = 0; i < geometry.faces.length; i++){
            geometry.faces[i].color.setRGBA(Math.floor(Math.random() * 128), Math.floor(Math.random() * 128 + 128), Math.floor(Math.random() * 128 + 128), 255);
        }


        cube = new Mesh(geometry, new FaceColorFillMaterial());
        cube.position.y = 150;
        scene.addObject(cube);

        // Plane
        plane = new Mesh(new Plane(200, 200), new ColorFillMaterial(0xe0e0e0));
        plane.rotation.x = -90 * (Math.PI / 180);
        scene.addObject(plane);

        renderer = new CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        container.appendChild(renderer.viewport);


        document.addEventListener('mousedown', onDocumentMouseDown, false);
    }

    //

    function onDocumentMouseDown(event) {
        event.preventDefault();

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);

        mouseXOnMouseDown = event.clientX - windowHalfX;
        targetRotationOnMouseDown = targetRotation;
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;

        targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;
    }

    function onDocumentMouseUp(event) {
        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('mouseup', onDocumentMouseUp, false);
    }

    //

    function loop() {
      /*  //cube.rotation.x += (targetRotation - cube.rotation.x) * 0.05;
        cube.rotation.y += (targetRotation - cube.rotation.y) * 0.05;
        //cube.rotation.z += (targetRotation - cube.rotation.z) * 0.05;

        plane.rotation.z =cube.rotation.y;
*/
        plane.rotation.z = cube.rotation.y += (targetRotation - cube.rotation.y) * 0.05;
        renderer.render(scene, camera);
    }
});