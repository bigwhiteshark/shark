/**
 * Created by yangxinming on 2014/10/6.
 */
define(function (require) {
    var Camera = require('cameras/Camera.js');
    var Particle = require('objects/entities/Particle.js');
    var CanvasRenderer = require('renderers/CanvasRenderer.js');
    var ColorFillMaterial = require('materials/ColorFillMaterial.js');
    var Scene = require('scenes/Scene.js');

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var container;
    var particle;

    var camera;
    var scene;
    var renderer;

    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = SCREEN_WIDTH / 2;
    var windowHalfY = SCREEN_HEIGHT / 2;


    init();
    //loop();
    setInterval(loop, 1000 / 60);

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new Camera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.0001, 10000 );
        camera.position.z = 1000;
        scene = new Scene();

        renderer = new CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        for (var i = 0; i < 1000; i++) {
            particle = new Particle(new ColorFillMaterial(Math.random() * 0x808008 + 0x808080, 1));
            particle.size = Math.random() * 10 + 5;
            particle.position.x = Math.random() * 2000 - 1000;
            particle.position.y = Math.random() * 2000 - 1000;
            particle.position.z = Math.random() * 2000 - 1000;
            scene.addObject(particle);
        }

        container.appendChild(renderer.viewport);


        document.addEventListener('mousemove', onDocumentMouseMove, false);
    }

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function loop() {
        camera.position.x += (mouseX - camera.position.x) * .05;
        camera.position.y += (-mouseY - camera.position.y) * .05;

        renderer.render(scene, camera);

    }


});