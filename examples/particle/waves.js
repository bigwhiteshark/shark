/**
 * Created by yangxinming on 2014/10/7.
 */
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

    var SEPARATION = 100;
    var AMOUNTX = 50;
    var AMOUNTY = 50;

    var container;

    var particles, particle;
    var count;

    var camera;
    var scene;
    var renderer;

    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    setInterval(loop, 1000 / 60);

    function init() {
        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new Camera( 75, SCREEN_WIDTH / SCREEN_HEIGHT, 0.0001, 10000 );
        camera.position.z = 1000;

        scene = new Scene();

        renderer = new CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        particles = [];

        var i = 0;
        var material = new ColorFillMaterial(0xffffff, 1);

        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++] = new Particle(material);
                particle.size = 1;
                particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                scene.addObject(particle);
            }
        }

        count = 0;

        container.appendChild(renderer.viewport);


        document.addEventListener('mousemove', onDocumentMouseMove, false);
    }

    //

    function onDocumentMouseMove(event) {
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    //

    function loop() {
        camera.position.x += (mouseX - camera.position.x) * .05;
        camera.position.y += (-mouseY - camera.position.y) * .05;

        var i = 0;

        for (var ix = 0; ix < AMOUNTX; ix++) {
            for (var iy = 0; iy < AMOUNTY; iy++) {
                particle = particles[i++];
                particle.size = (Math.sin((ix + count) * .3) + 1) * 2 + (Math.sin((iy + count) * .5) + 1) * 2;
                particle.position.y = (Math.sin((ix + count) * .3) * 50) + (Math.sin((iy + count) * .5) * 50);
            }
        }

        renderer.render(scene, camera);

        count += 0.1;
    }


});