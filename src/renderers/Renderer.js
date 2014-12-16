define(function (require) {
    var Matrix4 = require('math/Matrix4.js');
    var Vector4 = require('math/Vector4.js');
    var Mesh = require('objects/entities/Mesh.js');
    var Particle = require('objects/entities/Particle.js');
    var Face3 = require('core/Face3.js');
    var Face4 = require('core/Face4.js');
    var Line = require('objects/entities/Line.js');
    var Vertex = require('core/Vertex.js');
    var RenderableFace3 = require('renderers/renderables/RenderableFace3.js');
    var RenderableFace4 = require('renderers/renderables/RenderableFace4.js');
    var RenderableParticle = require('renderers/renderables/RenderableParticle.js');
    var RenderableLine = require('renderers/renderables/RenderableLine.js');

    function Renderer() {
        this.viewport = null;

        this.viewMatrix = new Matrix4();
        this.face3Pool = [];
        this.face4Pool = [];
        this.particlePool = [];
        this.linePool = [];
        this.vector4 = new Vector4();
    }

    var p = Renderer.prototype;

    function painterSort(a, b) {
        return b.z - a.z;
    }

    p.project = function (scene, camera) {
        var vertex,
            vertex2,
            face,
            object,
            v1, v2, v3, v4,
            face3count = 0,
            face4count = 0,
            particleCount = 0,
            lineCount = 0,
            verticesLength = 0,
            facesLength = 0;

        this.renderList = [];

        if (camera.autoUpdateMatrix) {
            camera.updateMatrix();
        }

        var viewMatrix = this.viewMatrix;
        var renderList = this.renderList;
        for (var i = 0, l = scene.objects.length; i < l; i++) {
            object = scene.objects[i];

            if (object.autoUpdateMatrix) {
                object.updateMatrix();
            }

            if (object instanceof Mesh) {
                //console.log(camera.matrix.elements);
                //console.log(object.matrix.elements);
                viewMatrix.multiplyMatrices(camera.matrix, object.matrix);
                //console.log(matrix.elements)
                // vertices
                verticesLength = object.geometry.vertices.length;
                for (var j = 0; j < verticesLength; j++) {
                    vertex = object.geometry.vertices[j];

                    vertex.screen.copy(vertex.position);
                    vertex.screen.transformMat4(viewMatrix);

                    vertex.screen.transformMat4(camera.projectionMatrix);
                    vertex.visible = vertex.screen.z > 0 && vertex.screen.z < 1;
                }

                // faces
                facesLength = object.geometry.faces.length;
                for (j = 0; j < facesLength; j++) {
                    face = object.geometry.faces[j];
                    if (face instanceof Face3) {

                        v1 = object.geometry.vertices[face.a];
                        v2 = object.geometry.vertices[face.b];
                        v3 = object.geometry.vertices[face.c];

                        if (v1.visible && v2.visible && v3.visible && (object.doubleSided ||
                            (v3.screen.x - v1.screen.x) * (v2.screen.y - v1.screen.y) -
                            (v3.screen.y - v1.screen.y) * (v2.screen.x - v1.screen.x) > 0)) {

                            face.screen.z = Math.max(v1.screen.z, Math.max(v2.screen.z, v3.screen.z));

                            var renderableFace3 = this.face3Pool[face3count];
                            if (!renderableFace3) {
                                renderableFace3 = new RenderableFace3()
                            }
                            renderableFace3.v1.x = v1.screen.x;
                            renderableFace3.v1.y = v1.screen.y;
                            renderableFace3.v2.x = v2.screen.x;
                            renderableFace3.v2.y = v2.screen.y;
                            renderableFace3.v3.x = v3.screen.x;
                            renderableFace3.v3.y = v3.screen.y;

                            renderableFace3.z = face.screen.z;
                            renderableFace3.color = face.color;
                            renderableFace3.material = object.material;
                            renderableFace3.overdraw = object.overdraw;
                            renderableFace3.uvs = object.geometry.uvs[j];
                            renderList.push(renderableFace3);
                            face3count++;
                        }
                    }
                    else if (face instanceof Face4) {
                        v1 = object.geometry.vertices[face.a];
                        v2 = object.geometry.vertices[face.b];
                        v3 = object.geometry.vertices[face.c];
                        v4 = object.geometry.vertices[face.d];
                        //console.log(v1,v2,v3,v4);

                        if (v1.visible && v2.visible && v3.visible && v4.visible && (object.doubleSided ||
                            ((v4.screen.x - v1.screen.x) * (v2.screen.y - v1.screen.y) -
                            (v4.screen.y - v1.screen.y) * (v2.screen.x - v1.screen.x) > 0 ||
                            (v2.screen.x - v3.screen.x) * (v4.screen.y - v3.screen.y) -
                            (v2.screen.y - v3.screen.y) * (v4.screen.x - v3.screen.x) > 0))) {

                            face.screen.z = Math.max(v1.screen.z, Math.max(v2.screen.z, Math.max(v3.screen.z, v4.screen.z)));

                            var renderableFace4 = this.face4Pool[face4count];
                            if (!renderableFace4) {
                                renderableFace4 = new RenderableFace4();
                            }

                            renderableFace4.v1.x = v1.screen.x;
                            renderableFace4.v1.y = v1.screen.y;
                            renderableFace4.v2.x = v2.screen.x;
                            renderableFace4.v2.y = v2.screen.y;
                            renderableFace4.v3.x = v3.screen.x;
                            renderableFace4.v3.y = v3.screen.y;
                            renderableFace4.v4.x = v4.screen.x;
                            renderableFace4.v4.y = v4.screen.y;
                            renderableFace4.z = face.screen.z;

                            renderableFace4.color = face.color;
                            renderableFace4.material = object.material;
                            renderableFace4.overdraw = object.overdraw;
                            renderableFace4.uvs = object.geometry.uvs[j];

                            //console.log(renderableFace4)
                            renderList.push(renderableFace4);
                            face4count++;
                        }
                    }
                }

            } else if (object instanceof Line) {
                viewMatrix.multiply(camera.matrix, object.matrix);
                verticesLength = object.geometry.vertices.length;
                for (j = 0; j < verticesLength; j++) {
                    vertex = object.geometry.vertices[j];
                    vertex.screen.copy(vertex.position);
                    vertex.screen.transformMat4(viewMatrix);
                    vertex.screen.transformMat4(camera.projectionMatrix);
                    vertex.visible = vertex.screen.z > 0 && vertex.screen.z < 1;

                    if (j > 0) {
                        vertex2 = object.geometry.vertices[j - 1];
                        if (!vertex.visible || !vertex2.visible) {
                            var renderableLine = this.linePool[lineCount];
                            if (!renderableLine) {
                                renderableLine = new RenderableLine();
                            }
                            renderableLine.v1.x = vertex.screen.x;
                            renderableLine.v1.y = vertex.screen.y;
                            renderableLine.v2.x = vertex2.screen.x;
                            renderableLine.v2.y = vertex2.screen.y;
                            renderableLine.screenZ = (vertex.screen.z + vertex2.screen.z) * 0.5;
                            renderableLine.material = object.material;

                            this.renderList.push(renderableLine);
                            lineCount++;
                        }
                    }
                }

            } else if (object instanceof Particle) {
                var vector4 = this.vector4;
                vector4.set(object.position.x, object.position.y, object.position.z, 1);
                vector4.transformMat4(camera.matrix);
                vector4.transformMat4(camera.projectionMatrix);
                object.screen.set(vector4.x / vector4.w, vector4.y / vector4.w, vector4.z / vector4.w);
                if (object.screen.z > 0  && object.screen.z < 1) {
                    var renderableParticle = this.particlePool[particleCount];
                    if (!renderableParticle) {
                        renderableParticle = new RenderableParticle();
                    }

                    renderableParticle.x = object.screen.x;
                    renderableParticle.y = object.screen.y;
                    renderableParticle.z = object.screen.z;

                    renderableParticle.size = object.size * Math.abs( vector4.x / vector4.w - ( vector4.x + camera.projectionMatrix.elements[0] ) / ( vector4.w + camera.projectionMatrix.elements[13] ) );
                    renderableParticle.material = object.material;
                    renderableParticle.color = object.color;
                    this.renderList.push(renderableParticle);
                    particleCount++;
                }
            }
        }

        renderList.sort(painterSort);
    };


    return Renderer;
});