/**
 * Created by yangxinming on 2014/10/6.
 */
define(function (require) {
    var Camera = require('cameras/Camera.js');
    var CanvasRenderer = require('renderers/CanvasRenderer.js');
    var BitmapUVMappingMaterial = require('materials/BitmapUVMappingMaterial.js');
    var Scene = require('scenes/Scene.js');
    var Mesh = require('objects/entities/Mesh.js');
    var Cube = require('objects/primitives/Cube.js');
    var Plane = require('objects/primitives/Plane.js');
    var Vector3 = require('math/Vector3.js');

    var Perlin = function () {

        // http://mrl.nyu.edu/~perlin/noise/

        var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
            23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
            174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
            133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
            89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
            202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
            248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
            178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
            14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
            93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

        for (var i=0; i < 256 ; i++) {

            p[256+i] = p[i];

        }

        function fade(t) {

            return t * t * t * (t * (t * 6 - 15) + 10);

        }

        function lerp(t, a, b) {

            return a + t * (b - a);

        }

        function grad(hash, x, y, z) {

            var h = hash & 15;
            var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
            return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

        }

        return {

            noise: function (x, y, z) {

                var floorX = Math.floor(x), floorY = Math.floor(y), floorZ = Math.floor(z);

                var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

                x -= floorX;
                y -= floorY;
                z -= floorZ;

                var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;

                var u = fade(x), v = fade(y), w = fade(z);

                var A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z, B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

                return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
                            grad(p[BA], xMinus1, y, z)),
                        lerp(u, grad(p[AB], x, yMinus1, z),
                            grad(p[BB], xMinus1, yMinus1, z))),
                    lerp(v, lerp(u, grad(p[AA+1], x, y, zMinus1),
                            grad(p[BA+1], xMinus1, y, z-1)),
                        lerp(u, grad(p[AB+1], x, yMinus1, zMinus1),
                            grad(p[BB+1], xMinus1, yMinus1, zMinus1))));

            }
        }
    }

    //

    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

    var container;

    var camera, scene, renderer;

    var mesh;

    var mouseX = 0;
    var mouseY = 0;

    var windowHalfX = window.innerWidth >> 1;
    var windowHalfY = window.innerHeight >> 1;


    init();
    setInterval( loop, 1000 / 60 );


    function init() {

        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new Camera( 60, SCREEN_WIDTH / SCREEN_HEIGHT, 0.0001, 10000 );
        camera.position.z = 500;

        scene = new Scene();

        var heightMap = height( 1024, 1024 );
        var textureMap = shadow( heightMap );
        var material = new BitmapUVMappingMaterial( textureMap );

        var quality = 20;
        var quality1 = quality + 1;

        var plane = new Plane( 2000, 2000, quality, quality );

        var data = heightMap.getContext( '2d' ).getImageData( 0, 0, heightMap.width, heightMap.height ).data;
        var pixelsPerTriangle = Math.floor(heightMap.width / quality);

        for ( var y = 0; y < quality1; y++ ) {

            for (var x = 0; x < quality1; x++ ) {

                plane.vertices[x + y * quality1].position.z = data[((x * pixelsPerTriangle) + (y * pixelsPerTriangle) * heightMap.width) * 4] * 2 - 128;

            }

        }

        mesh = new Mesh( plane, material );
        mesh.rotation.x = -90 * Math.PI / 180;
        mesh.overdraw = true;
        scene.addObject(mesh);

        renderer = new CanvasRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

        container.innerHTML = "";

        container.appendChild(renderer.viewport);

        document.addEventListener('mousemove', onDocumentMouseMove, false);

    }

    function onDocumentMouseMove(event) {

        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);

    }

    function loop() {

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        renderer.render(scene, camera);

    }

    function height(width, height) {

        var canvas, context, image, data;

        canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );

        image = context.getImageData( 0, 0, width, height );
        data = image.data;

        var perlin = new Perlin();

        var size = width * height;
        var quality = 2;
        var zz = Math.random() * 100;

        for ( var j = 0; j < 4; j ++ ) {

            var x = 0, y = 0, yy = 0;

            quality *= 4;

            for ( var i = 0; i < size; i ++ ) {

                data[ i * 4 ] += Math.floor( Math.abs( perlin.noise( x / quality, yy, zz ) * 0.5 ) * quality + 10 );

                x++;

                if (x == width)
                {
                    x = 0;
                    y ++;
                    yy = y / quality;
                }

            }
        }

        context.putImageData( image, 0, 0 );

        return canvas;

    }

    function shadow( texture ) {

        var canvas, context, image, data, src_data,
            index, level, diff, width = texture.width, height = texture.height,
            vector3, sun, shade;

        vector3 = new Vector3( 0, 0, 0 );

        sun = new Vector3( 1, 1, 1 );
        sun.normalize();

        canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );

        image = context.getImageData( 0, 0, width, height );
        data = image.data;

        src_data = texture.getContext( '2d' ).getImageData( 0, 0, width, height ).data;

        for ( var y = 0; y < height; y++ ) {

            for ( var x = 0; x < width; x++ ) {

                index = ( x + y * width ) * 4;

                vector3.x = src_data[ index - 4 ] - src_data[ index + 4 ];
                vector3.y = 2;
                vector3.z = src_data[ index - ( width * 4 ) ] - src_data[ index + ( width * 4 ) ];
                vector3.normalize();

                shade = vector3.dot(sun);

                data[ index ] = ( 96 + shade * 128 ) * ( src_data[ index ] * 0.007 );
                data[ index + 1 ] = ( 32 + shade * 96 ) * ( src_data[ index ] * 0.007 );
                data[ index + 2 ] = ( shade * 96 ) * ( src_data[ index ] * 0.007 );

            }
        }

        context.putImageData( image, 0, 0 );

        return canvas;
    }
});