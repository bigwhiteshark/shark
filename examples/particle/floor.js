/**
 * Created by yangxinming on 2014/10/18.
 */
define(function(require){
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

    var particle;

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

        var particles = [];

        var material = new ColorFillMaterial(0xffffff, 1);

        for (var ix = 0; ix < AMOUNTX; ix++) {
            for(var iy = 0; iy < AMOUNTY; iy++) {
                particle = new Particle( material );
                particle.position.x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
                particle.position.z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
                particle.updateMatrix();
                scene.addObject( particle );
            }
        }

        container.appendChild(renderer.viewport);

        /*	stats = new Stats();
         stats.domElement.style.position = 'absolute';
         stats.domElement.style.top = '0px';
         container.appendChild(stats.domElement);*/

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
    }

    //

    function onDocumentMouseMove(event) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    }

    function onDocumentTouchStart( event ) {

        if(event.touches.length > 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove( event ) {

        if(event.touches.length == 1) {

            event.preventDefault();

            mouseX = event.touches[0].pageX - windowHalfX;
            mouseY = event.touches[0].pageY - windowHalfY;
        }
    }

    //

    function loop() {

        camera.position.x += (mouseX - camera.position.x) * .05;
        camera.position.y += (-mouseY - camera.position.y) * .05;

        renderer.render(scene, camera);

        //stats.update();
    }
});