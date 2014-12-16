/**
 * Created by yangxinming on 2014/10/6.
 */
define(function (require) {
    var Camera = require('cameras/Camera.js');
    var CanvasRenderer = require('renderers/CanvasRenderer.js');
    var FaceColorFillMaterial = require('materials/FaceColorFillMaterial.js');
    var ColorFillMaterial = require('materials/ColorFillMaterial.js');
    var BitmapUVMappingMaterial = require('materials/BitmapUVMappingMaterial.js');
    var Scene = require('scenes/Scene.js');
    var Mesh = require('objects/entities/Mesh.js');
    var Cube = require('objects/primitives/Cube.js');
    var Plane = require('objects/primitives/Plane.js');
    var Particle = require('objects/entities/Particle.js');



    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var AMOUNT = 100;

    var container, stats;

    var camera, scene, renderer;

    var video, texture, textureContext,
        textureReflection, textureReflectionContext, textureReflectionGradient;

    var mesh;

    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = window.innerWidth >> 1;
    var windowHalfY = window.innerHeight >> 1;


    document.addEventListener('mousemove', onDocumentMouseMove, false);

    init();
    setInterval(loop, 1000/60);


    function init() {

        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new Camera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.0001, 10000 );
        camera.position.z = 1000;

        scene = new Scene();

        video = document.getElementById( 'video' );

        //

        texture = document.createElement( 'canvas' );
        texture.width = 480;
        texture.height = 204;

        textureContext = texture.getContext( '2d' );
        textureContext.fillStyle = '#000000';
        textureContext.fillRect( 0, 0, 480, 204 );

        var material = new BitmapUVMappingMaterial( texture );

        textureReflection = document.createElement( 'canvas' );
        textureReflection.width = 480;
        textureReflection.height = 204;

        textureReflectionContext = textureReflection.getContext( '2d' );
        textureReflectionContext.fillStyle = '#000000';
        textureReflectionContext.fillRect( 0, 0, 480, 204 );

        textureReflectionGradient = textureReflectionContext.createLinearGradient( 0, 0, 0, 204 );
        textureReflectionGradient.addColorStop( 0.2, 'rgba(240, 240, 240, 1)' );
        textureReflectionGradient.addColorStop( 1, 'rgba(240, 240, 240, 0.8)' );

        var materialReflection = new BitmapUVMappingMaterial( textureReflection );

        //

        var plane = new Plane( 480, 204, 4, 4 );

        mesh = new Mesh( plane, material );
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
        mesh.overdraw = true;
        scene.addObject(mesh);

        mesh = new Mesh( plane, materialReflection );
        mesh.position.y = -306;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
        mesh.rotation.x = 180 * Math.PI / 180;
        mesh.doubleSided = true;
        mesh.overdraw = true;
        scene.addObject(mesh);

        //

        var separation = 150;
        var amountx = 10;
        var amounty = 10;

        var material = new ColorFillMaterial(0x808080);

        for (var ix = 0; ix < amountx; ix++) {

            for(var iy = 0; iy < amounty; iy++) {

                particle = new Particle( material );
                particle.position.x = ix * separation - ((amountx * separation) / 2);
                particle.position.y = -153
                particle.position.z = iy * separation - ((amounty * separation) / 2);
                scene.addObject( particle );
            }
        }

        renderer = new CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        container.appendChild(renderer.viewport);
    }

    function onDocumentMouseMove(event) {

        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY) * .2;

    }

    function loop() {

        camera.position.x += (mouseX - camera.position.x) * .05;
        camera.position.y += (-mouseY - camera.position.y) * .05;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {

            textureContext.drawImage( video, 0, 0 );
        }

        textureReflectionContext.drawImage( texture, 0, 0 );
        textureReflectionContext.fillStyle = textureReflectionGradient;
        textureReflectionContext.fillRect(0, 0, 480, 204);

        renderer.render(scene, camera);
        //stats.update();

    }

});