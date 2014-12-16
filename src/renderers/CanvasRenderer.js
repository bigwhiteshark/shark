define(function (require) {
    var inherits = require('utils/inherits.js');
    var Renderer = require('renderers/Renderer.js');
    var ColorFillMaterial = require('materials/ColorFillMaterial.js');
    var FaceColorFillMaterial = require('materials/FaceColorFillMaterial.js');
    var ColorStrokeMaterial = require('materials/ColorStrokeMaterial.js');
    var FaceColorStrokeMaterial = require('materials/FaceColorStrokeMaterial.js');
    var BitmapUVMappingMaterial = require('materials/BitmapUVMappingMaterial.js');
    var RenderableFace3 = require('renderers/renderables/RenderableFace3.js');
    var RenderableFace4 = require('renderers/renderables/RenderableFace4.js');
    var RenderableParticle = require('renderers/renderables/RenderableParticle.js');
    var RenderableLine = require('renderers/renderables/RenderableLine.js');
    var Rectangle = require('core/Rectangle.js');
    var Vector2 = require('math/Vector2.js');

    function CanvasRenderer() {
        Renderer.call(this);
        this.viewport = document.createElement("canvas");
        this.context = this.viewport.getContext("2d");

        this.clipRect = new Rectangle();
        this.clearRect = new Rectangle(0, 0, 0, 0);
        this.bboxRect = new Rectangle();
        this.vector2 = new Vector2();
        this.autoClear = true;

    }

    inherits(CanvasRenderer, Renderer);
    var p = CanvasRenderer.prototype;

    p.setSize = function (width, height) {
        this.viewport.width = width;
        this.viewport.height = height;
        var widthHalf = width / 2;
        var heightHalf = height / 2;
        this.width = width;
        this.height = height;
        this.widthHalf = widthHalf;
        this.heightHalf = heightHalf;
        this.context.setTransform(1, 0, 0, 1, widthHalf, heightHalf);
        this.clipRect.set(-widthHalf, -heightHalf, widthHalf, heightHalf);
    };

    p.clear = function () {
        var _clearRect = this.clearRect,
            _clipRect = this.clipRect;

        _clearRect.inflate(1);
        _clearRect.minSelf(_clipRect);
        this.context.clearRect(_clearRect.x1, _clearRect.y1, _clearRect.width, _clearRect.height);
        _clearRect.empty();
    };

    p.expand = function (a, b) {
        var vector = this.vector2;
        vector.subVectors(b, a);
        vector.normalize();
        b.add(vector);
        a.sub(vector);
    };

    p.render = function (sence, camera) {
        var i, j, element, pi2 = Math.PI * 2,
            elementsLength, material, materialLength,
            v1x, v1y, v2x, v2y, v3x, v3y, v4x, v4y,
            uv1 = new Vector2(), uv2 = new Vector2(), uv3 = new Vector2(),
            suv1 = new Vector2(), suv2 = new Vector2(), suv3 = new Vector2(),
            suv1x, suv1y, suv2x, suv2y, suv3x, suv3y, denom, m11, m12, m21, m22, dx, dy,
            bitmap, bitmapWidth, bitmapHeight, size,
            context = this.context,
            _clearRect = this.clearRect,
            _clipRect = this.clipRect,
            _bboxRect = this.bboxRect,
            _widthHalf = this.widthHalf,
            _heightHalf = this.heightHalf;

        if (this.autoClear) {
            this.clear();
        }

        this.project(sence, camera);

        elementsLength = this.renderList.length;
        for (i = 0; i < elementsLength; i++) {
            element = this.renderList[i];
            _bboxRect.empty();
            context.beginPath();
            if (element instanceof RenderableParticle) {
                v1x = element.x * _widthHalf;
                v1y = element.y * _heightHalf;
                size = element.size * _widthHalf;
                _bboxRect.set(v1x - size, v1y - size, v1x + size, v1y + size);
                if (!_clipRect.instersects(_bboxRect)) {
                    continue;
                }
                context.arc(v1x, v1y, size, 0, pi2, true);
            } else if (element instanceof RenderableLine) {

                v1x = element.v1.x * _widthHalf;
                v1y = element.v1.y * _heightHalf;
                v2x = element.v2.x * _widthHalf;
                v2y = element.v2.y * _heightHalf;

                _bboxRect.addPoint(v1x, v1y);
                _bboxRect.addPoint(v2x, v2y);
                if (!_clipRect.instersects(_bboxRect)) {
                    continue;
                }

                context.moveTo(v1x, v1y);
                context.lineTo(v2x, v2y);

            } else if (element instanceof RenderableFace3) {

                element.v1.x *= _widthHalf;
                element.v1.y *= _heightHalf;
                element.v2.x *= _widthHalf;
                element.v2.y *= _heightHalf;
                element.v3.x *= _widthHalf;
                element.v3.y *= _heightHalf;

                if (element.overdraw) {
                    this.expand(element.v1, element.v2);
                    this.expand(element.v2, element.v3);
                    this.expand(element.v3, element.v1);
                }

                //剪裁坐标
                v1x = element.v1.x;
                v1y = element.v1.y;
                v2x = element.v2.x;
                v2y = element.v2.y;
                v3x = element.v3.x;
                v3y = element.v3.y;

                _bboxRect.addPoint(v1x, v1y);
                _bboxRect.addPoint(v2x, v2y);
                _bboxRect.addPoint(v3x, v3y);

                if (!_clipRect.instersects(_bboxRect)) {
                    continue;
                }
                _clearRect.addRectangle(_bboxRect);

                context.moveTo(v1x, v1y);
                context.lineTo(v2x, v2y);
                context.lineTo(v3x, v3y);
                context.lineTo(v1x, v1y);

            } else if (element instanceof RenderableFace4) {
                element.v1.x *= _widthHalf;
                element.v1.y *= _heightHalf;
                element.v2.x *= _widthHalf;
                element.v2.y *= _heightHalf;
                element.v3.x *= _widthHalf;
                element.v3.y *= _heightHalf;
                element.v4.x *= _widthHalf;
                element.v4.y *= _heightHalf;

                if (element.overdraw) {
                    this.expand(element.v1, element.v2);
                    this.expand(element.v2, element.v3);
                    this.expand(element.v3, element.v4);
                    this.expand(element.v4, element.v1);
                }

                //剪裁坐标
                v1x = element.v1.x;
                v1y = element.v1.y;
                v2x = element.v2.x;
                v2y = element.v2.y;
                v3x = element.v3.x;
                v3y = element.v3.y;
                v4x = element.v4.x;
                v4y = element.v4.y;

                _bboxRect.addPoint(v1x, v1y);
                _bboxRect.addPoint(v2x, v2y);
                _bboxRect.addPoint(v3x, v3y);
                _bboxRect.addPoint(v4x, v4y);

                if (!_clipRect.instersects(_bboxRect)) {
                    continue;
                }

                context.moveTo(v1x, v1y);
                context.lineTo(v2x, v2y);
                context.lineTo(v3x, v3y);
                context.lineTo(v4x, v4y);
                context.lineTo(v1x, v1y);
            }

            context.closePath();

            materialLength = element.material.length;
            for (j = 0; j < materialLength; j++) {

                material = element.material[j];

                if (material instanceof ColorFillMaterial) {
                    context.fillStyle = material.color.styleString;
                    context.fill();

                } else if (material instanceof FaceColorFillMaterial) {
                    context.fillStyle = element.color.styleString;
                    context.fill();

                } else if (material instanceof ColorStrokeMaterial) {

                    context.lineWidth = material.lineWidth;
                    context.lineJoin = "round";
                    context.lineCap = "round";

                    context.strokeStyle = material.color.styleString;
                    context.stroke();

                    _bboxRect.inflate(context.lineWidth);

                } else if (material instanceof FaceColorStrokeMaterial) {

                    context.lineWidth = material.lineWidth;
                    context.lineJoin = "round";
                    context.lineCap = "round";

                    context.strokeStyle = element.color.styleString;
                    context.stroke();
                    _bboxRect.inflate(context.lineWidth);

                } else if (material instanceof BitmapUVMappingMaterial) {

                    bitmap = material.bitmap;
                    bitmapWidth = bitmap.width;
                    bitmapHeight = bitmap.height;

                    uv1.copy(element.uvs[0]);
                    uv2.copy(element.uvs[1]);
                    uv3.copy(element.uvs[2]);
                    suv1.copy(uv1);
                    suv2.copy(uv2);
                    suv3.copy(uv3);

                    suv1.x *= bitmapWidth;
                    suv1.y *= bitmapHeight;
                    suv2.x *= bitmapWidth;
                    suv2.y *= bitmapHeight;
                    suv3.x *= bitmapWidth;
                    suv3.y *= bitmapHeight;

                    if (element.overdraw) {
                        this.expand(suv1, suv2);
                        this.expand(suv2, suv3);
                        this.expand(suv3, suv1);

                        suv1.x = ( uv1.x === 0 ) ? 1 : ( uv1.x === 1 ) ? suv1.x - 1 : suv1.x;
                        suv1.y = ( uv1.y === 0 ) ? 1 : ( uv1.y === 1 ) ? suv1.y - 1 : suv1.y;

                        suv2.x = ( uv2.x === 0 ) ? 1 : ( uv2.x === 1 ) ? suv2.x - 1 : suv2.x;
                        suv2.y = ( uv2.y === 0 ) ? 1 : ( uv2.y === 1 ) ? suv2.y - 1 : suv2.y;

                        suv3.x = ( uv3.x === 0 ) ? 1 : ( uv3.x === 1 ) ? suv3.x - 1 : suv3.x;
                        suv3.y = ( uv3.y === 0 ) ? 1 : ( uv3.y === 1 ) ? suv3.y - 1 : suv3.y;
                    }

                    suv1x = suv1.x;
                    suv1y = suv1.y;
                    suv2x = suv2.x;
                    suv2y = suv2.y;
                    suv3x = suv3.x;
                    suv3y = suv3.y;

                    // Textured triangle drawing by Thatcher Ulrich.
                    // http://tulrich.com/geekstuff/canvas/jsgl.js
                    context.save();
                    context.clip();

                    denom = suv1x * ( suv3y - suv2y ) - suv2x * suv3y + suv3x * suv2y + ( suv2x - suv3x ) * suv1y;

                    m11 = -( suv1y * (v3x - v2x ) - suv2y * v3x + suv3y * v2x + ( suv2y - suv3y ) * v1x ) / denom;
                    m12 = ( suv2y * v3y + suv1y * ( v2y - v3y ) - suv3y * v2y + ( suv3y - suv2y) * v1y ) / denom;
                    m21 = ( suv1x * ( v3x - v2x ) - suv2x * v3x + suv3x * v2x + ( suv2x - suv3x ) * v1x ) / denom;
                    m22 = -( suv2x * v3y + suv1x * ( v2y - v3y ) - suv3x * v2y + ( suv3x - suv2x ) * v1y ) / denom;
                    dx = ( suv1x * ( suv3y * v2x - suv2y * v3x ) + suv1y * ( suv2x * v3x - suv3x * v2x ) + ( suv3x * suv2y - suv2x * suv3y ) * v1x ) / denom;
                    dy = ( suv1x * ( suv3y * v2y - suv2y * v3y ) + suv1y * ( suv2x * v3y - suv3x * v2y ) + ( suv3x * suv2y - suv2x * suv3y ) * v1y ) / denom;

                    context.transform(m11, m12, m21, m22, dx, dy);

                    context.drawImage(bitmap, 0, 0);
                    context.restore();
                }

            }
            _clearRect.addRectangle(_bboxRect);
        }
    };

    // Textured triangle drawing by Thatcher Ulrich.
    // http://tulrich.com/geekstuff/canvas/jsgl.js
    p.drawTexturedTriangle = function (image, bbox, x0, y0, x1, y1, x2, y2, sx0, sy0, sx1, sy1, sx2, sy2) {
        var context = this.context;
        var denom, m11, m12, m21, m22, dx, dy;

        context.save();
        context.clip();

        denom = sx0 * ( sy2 - sy1 ) - sx1 * sy2 + sx2 * sy1 + ( sx1 - sx2 ) * sy0;
        m11 = -( sy0 * (x2 - x1 ) - sy1 * x2 + sy2 * x1 + ( sy1 - sy2 ) * x0 ) / denom;
        m12 = ( sy1 * y2 + sy0 * ( y1 - y2 ) - sy2 * y1 + ( sy2 - sy1) * y0 ) / denom;
        m21 = ( sx0 * ( x2 - x1 ) - sx1 * x2 + sx2 * x1 + ( sx1 - sx2 ) * x0 ) / denom;
        m22 = -( sx1 * y2 + sx0 * ( y1 - y2 ) - sx2 * y1 + ( sx2 - sx1 ) * y0 ) / denom;
        dx = ( sx0 * ( sy2 * x1 - sy1 * x2 ) + sy0 * ( sx1 * x2 - sx2 * x1 ) + ( sx2 * sy1 - sx1 * sy2 ) * x0 ) / denom;
        dy = ( sx0 * ( sy2 * y1 - sy1 * y2 ) + sy0 * ( sx1 * y2 - sx2 * y1 ) + ( sx2 * sy1 - sx1 * sy2 ) * y0 ) / denom;

        context.transform(m11, m12, m21, m22, dx, dy);

        context.drawImage(image, 0, 0);
        context.restore();
    };

    return CanvasRenderer;
});