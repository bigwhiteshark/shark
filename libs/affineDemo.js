/*
 * Copyright 2010 Brendan Kenny
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

(function() {
  var ns = {};
  
  /**
   * A sketch of a 4x4 matrix class. Full homogeneous coordinate support but
   * won't create objects for you: multiplies will (almost) never kill you in
   * js, but the garbage collector definitely will.
   * 
   * @constructor
   */
  ns.Matrix4x4 = function() {
    this.e0 = 1; this.e4 = 0; this.e8 = 0; this.e12 = 0;
    this.e1 = 0; this.e5 = 1; this.e9 = 0; this.e13 = 0;
    this.e2 = 0; this.e6 = 0; this.e10 = 1; this.e14 = 0;
    this.e3 = 0; this.e7 = 0; this.e11 = 0; this.e15 = 1;

    return this;
  };
  
  ns.Matrix4x4.prototype.copy = function(src) {
    this.e0 = src.e0; this.e4 = src.e4; this.e8 = src.e8; this.e12 = src.e12;
    this.e1 = src.e1; this.e5 = src.e5; this.e9 = src.e9; this.e13 = src.e13;
    this.e2 = src.e2; this.e6 = src.e6; this.e10 = src.e10; this.e14 = src.e14;
    this.e3 = src.e3; this.e7 = src.e7; this.e11 = src.e11; this.e15 = src.e15;

    return this;
  };
  
  /**
   * Set this matrix to the transformation represented by quaternion src.
   * src must be unit length. Overwrites current matrix value.
   * 
   * src is the quaternion to copy from
   */
  ns.Matrix4x4.prototype.copyUnitQuaternion = function(src) {
    var x = src.x,
        y = src.y,
        z = src.z,
        w = src.w;
    
    this.e0 = 1 - 2 * (y*y + z*z);
    this.e1 = 2 *(x*y + z*w);
    this.e2 = 2 * (x*z - y*w);
    this.e3 = 0;

    this.e4 = 2 * (x*y - z*w);
    this.e5 = 1 - 2 * (x*x + z*z);
    this.e6 = 2 * (y*z + x*w);
    this.e7 = 0;

    this.e8 = 2 * (x*z + y*w);
    this.e9 = 2 * (y*z - x*w);
    this.e10 = 1 - 2 * (x*x + y*y);
    this.e11 = 0;

    this.e12 = 0;
    this.e13 = 0;
    this.e14 = 0;
    this.e15 = 1;
    
    return this;
  };
  
  ns.Matrix4x4.prototype.identity = ns.Matrix4x4;
  
  /**
   * Implementation from David Eberly's "The Laplace Expansion Theorem:
   * Computing the Determinants and Inverses of Matrices".
   * http://www.geometrictools.com/Documentation/LaplaceExpansionTheorem.pdf
   */
  ns.Matrix4x4.prototype.invert = function(src) {
    var s0 = src.e0*src.e5 - src.e1*src.e4,
        s1 = src.e0*src.e9 - src.e1*src.e8,
        s2 = src.e0*src.e13 - src.e1*src.e12,
        s3 = src.e4*src.e9 - src.e5*src.e8,
        s4 = src.e4*src.e13 - src.e5*src.e12,
        s5 = src.e8*src.e13 - src.e9*src.e12,

        c5 = src.e10*src.e15 - src.e11*src.e14,
        c4 = src.e6*src.e15 - src.e7*src.e14,
        c3 = src.e6*src.e11 - src.e7*src.e10,
        c2 = src.e2*src.e15 - src.e3*src.e14,
        c1 = src.e2*src.e11 - src.e3*src.e10,
        c0 = src.e2*src.e7 - src.e3*src.e6,

        det;
		
    // adjugate
    this.e0 = src.e5*c5 - src.e9*c4 + src.e13*c3;
    this.e4 = -src.e4*c5 + src.e8*c4 - src.e12*c3;
    this.e8 = src.e7*s5 - src.e11*s4 + src.e15*s3;
    this.e12 = -src.e6*s5 + src.e10*s4 - src.e14*s3;

    this.e1 = -src.e1*c5 + src.e9*c2 - src.e13*c1;
    this.e5 = src.e0*c5 - src.e8*c2 + src.e12*c1;
    this.e9 = -src.e3*s5 + src.e11*s2 - src.e15*s1;
    this.e13 = src.e2*s5 - src.e10*s2 + src.e14*s1;

    this.e2 = src.e1*c4 - src.e5*c2 + src.e13*c0;
    this.e6 = -src.e0*c4 + src.e4*c2 - src.e12*c0;
    this.e10 = src.e3*s4 - src.e7*s2 + src.e15*s0;
    this.e14 = -src.e2*s4 + src.e6*s2 - src.e14*s0;

    this.e3 = -src.e1*c3 + src.e5*c1 - src.e9*c0;
    this.e7 = src.e0*c3 - src.e4*c1 + src.e8*c0;
    this.e11 = -src.e3*s3 + src.e7*s1 - src.e11*s0;
    this.e15 = src.e2*s3 - src.e6*s1 + src.e10*s0;

    // determinant
    det = s0*c5 -s1*c4 + s2*c3 + s3*c2 - s4*c1 + s5*c0;
		
    if (Math.abs(det) < 1.e-8) {
      throw 'Matrix is singular.';

    } else {
      det = 1 / det;
      this.e0 *= det;
      this.e1 *= det;
      this.e2 *= det;
      this.e3 *= det;
      this.e4 *= det;
      this.e5 *= det;
      this.e6 *= det;
      this.e7 *= det;
      this.e8 *= det;
      this.e9 *= det;
      this.e10 *= det;
      this.e11 *= det;
      this.e12 *= det;
      this.e13 *= det;
      this.e14 *= det;
      this.e15 *= det;
    }
    
    return this;
  };
  
  ns.Matrix4x4.prototype.multiply = function(view, local) {
    this.e0  = view.e0*local.e0  + view.e4*local.e1  + view.e8*local.e2  + view.e12*local.e3;
    this.e4  = view.e0*local.e4  + view.e4*local.e5  + view.e8*local.e6  + view.e12*local.e7;
    this.e8  = view.e0*local.e8  + view.e4*local.e9  + view.e8*local.e10 + view.e12*local.e11;
    this.e12 = view.e0*local.e12 + view.e4*local.e13 + view.e8*local.e14 + view.e12*local.e15;

    this.e1  = view.e1*local.e0  + view.e5*local.e1  + view.e9*local.e2  + view.e13*local.e3;
    this.e5  = view.e1*local.e4  + view.e5*local.e5  + view.e9*local.e6  + view.e13*local.e7;
    this.e9  = view.e1*local.e8  + view.e5*local.e9  + view.e9*local.e10 + view.e13*local.e11;
    this.e13 = view.e1*local.e12 + view.e5*local.e13 + view.e9*local.e14 + view.e13*local.e15;

    this.e2  = view.e2*local.e0  + view.e6*local.e1  + view.e10*local.e2  + view.e14*local.e3;
    this.e6  = view.e2*local.e4  + view.e6*local.e5  + view.e10*local.e6  + view.e14*local.e7;
    this.e10 = view.e2*local.e8  + view.e6*local.e9  + view.e10*local.e10 + view.e14*local.e11;
    this.e14 = view.e2*local.e12 + view.e6*local.e13 + view.e10*local.e14 + view.e14*local.e15;

    this.e3  = view.e3*local.e0  + view.e7*local.e1  + view.e11*local.e2  + view.e15*local.e3;
    this.e7  = view.e3*local.e4  + view.e7*local.e5  + view.e11*local.e6  + view.e15*local.e7;
    this.e11 = view.e3*local.e8  + view.e7*local.e9  + view.e11*local.e10 + view.e15*local.e11;
    this.e15 = view.e3*local.e12 + view.e7*local.e13 + view.e11*local.e14 + view.e15*local.e15;
    
    return this;
  };
  
  ns.Matrix4x4.prototype.scale = function(sx, sy, sz) {
    this.e0 *= sx;
    this.e1 *= sx;
    this.e2 *= sx;
    this.e3 *= sx;

    this.e4 *= sy;
    this.e5 *= sy;
    this.e6 *= sy;
    this.e7 *= sy;

    this.e8 *= sz;
    this.e9 *= sz;
    this.e10 *= sz;
    this.e11 *= sz;
    
    return this;
  };
  
  /**
   * Applies a simple fov-based perspective transformation in the *local*
   * coordinates of this matrix. Assumes eye is at the origin, flips the
   * handedness of the coordinate system, and makes no effort to scale z for
   * floating-point resolution control.
   * 
   * The projective plane [0, 0, -tan(fov/2), 0] is mapped to the plane at
   * infinity, so be careful.
   * 
   * fov is the field of view, in radians
   */
  ns.Matrix4x4.prototype.simplePerspective = function(fov) {
    // postmultiply by
    // | 1  0   0   0 |
    // | 0  1   0   0 |
    // | 0  0  -1  -p |
    // | 0  0 -1/p  0 |
    
    var recip = -Math.tan(fov / 2),
        p = 1 / recip,
        tmp;
    
    // row 1
    tmp = this.e8;
    this.e8 = this.e12*recip - tmp;
    this.e12 = tmp * p;
    
    // row 2
    tmp = this.e9;
    this.e9 = this.e13*recip - tmp;
    this.e13 = tmp * p;
    
    // r0w 3
    tmp = this.e10;
    this.e10 = this.e14*recip - tmp;
    this.e14 = tmp * p;
    
    // row 4
    tmp = this.e11;
    this.e11 = this.e15*recip - tmp;
    this.e15 = tmp * p;
    
    return this;
  };
  
  ns.Matrix4x4.prototype.transformX = function(x, y, z, w) {
    return x*this.e0 + y*this.e4 + z*this.e8 + w*this.e12;
  };
  
  ns.Matrix4x4.prototype.transformY = function(x, y, z, w) {
    return x*this.e1 + y*this.e5 + z*this.e9 + w*this.e13;
  };
  
  ns.Matrix4x4.prototype.transformZ = function(x, y, z, w) {
    return x*this.e2 + y*this.e6 + z*this.e10 + w*this.e14;
  };
  
  ns.Matrix4x4.prototype.transformW = function(x, y, z, w) {
    return x*this.e3 + y*this.e7 + z*this.e11 + w*this.e15;
  };
  
  ns.Matrix4x4.prototype.translate = function(tx, ty, tz) {
    this.e12 += this.e0*tx + this.e4*ty + this.e8*tz;
    this.e13 += this.e1*tx + this.e5*ty + this.e9*tz;
    this.e14 += this.e2*tx + this.e6*ty + this.e10*tz;
    this.e15 += this.e3*tx + this.e7*ty + this.e11*tz;
    
    return this;
  };
  
  /**
   * @constructor
   */
  ns.Vec4 = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;

    return this;
  };

  ns.Vec4.prototype.copy = function(src) {
    this.x = src.x;
    this.y = src.y;
    this.z = src.z;
    this.w = src.w;

    return this;
  };

  /**
   * creates our affine texturing demo in the element container
   * demoNum selects version. inelegant (grew at the last minute), but
   * 1 - one triangle
   * 2 - two triangle quad
   * 3 - four triangle quad
   */
  function createAffineDemo(container, demoNum) {
    var canvas = document.createElement('canvas'),
        canvasCss = 'position: absolute; width: 100%; height: 100%; cursor: move;',
        ctx,
        cWidth,
        cHeight,
        hwRatio,
        
        slider = document.createElement('input'),
        sliderCss = 'position: absolute; bottom: 10%; left: 20%; width: 60%;',
        
        // checkerboard texture
        patternSize = 44,
        patternLineWidth = 3,
        lineSpreadVariance = .07 * patternSize,
        lineWidthVariance = .25 * patternLineWidth,
        checkerBgColor = '#ededed',
        checkerColorColor = '#ab4c39',
        checkerLineColor = '#0f0d0e',
        checkerTexture = new Image(),
        backgroundAlpha = 0,
        
        // background gradient
        bgColorLight = '#ffffff',
        bgColorDark = '#B2C8F7',
        bgGradient,
        
        // matrix party!
        ndcToPixel = new ns.Matrix4x4(),
        pixelToNdc = new ns.Matrix4x4(),
        worldToPixel = new ns.Matrix4x4(),
        objToWorld = new ns.Matrix4x4(),
        workMat = new ns.Matrix4x4(),
        
        // perspective
        eyeDistance = -1.8,
        fov = 5 * Math.PI / 12,
    
        // vertices from a cube inscribed in unit sphere
        iC = Math.sqrt(3) / 3,
        p0 = new ns.Vec4(-iC,  iC, 0, 1),
        p1 = new ns.Vec4(-iC, -iC, 0, 1),
        p2 = new ns.Vec4( iC, -iC, 0, 1),
        p3 = new ns.Vec4( iC,  iC, 0, 1),
        p4 = new ns.Vec4(1E-6, 1E-6, 0, 1),
        
        q0 = new ns.Vec4(),
        q1 = new ns.Vec4(),
        q2 = new ns.Vec4(),
        q3 = new ns.Vec4(),
        q4 = new ns.Vec4(),
        
        // interaction variables
        scheduledUpdate,
        frameDelay = 1000 / 30,
        isDragging = false,
        dragX,
        dragY,
        arcStart = new ns.Vec4(),
        arcDrag = new ns.Vec4(),
        
        // orientation quaternions
        quatDrag = new ns.Vec4(0, 0, 0, 1),
        quatCumulative = new ns.Vec4(0, 0, 0, 1),
        quatCurrent = new ns.Vec4(0, 0, 0, 1),
        
        // arcball is recessed into click plane
        arcAnglePrecluded = Math.PI / 12,
        arcMinZ = Math.sin(arcAnglePrecluded),
        arcMaxXY = Math.cos(arcAnglePrecluded);
        
    function init() {
      container.innerHTML = '';
      
      canvas.style.cssText = canvasCss;
      container.appendChild(canvas);
      ctx = canvas.getContext('2d');
      
      // set canvas coordinate system to match canvas display
      cWidth = canvas.offsetWidth;
      cHeight = canvas.offsetHeight;
      canvas.width = cWidth;
      canvas.height = cHeight;
      hwRatio = cHeight / cWidth;
      
      try { // ie9pre4...
        slider.type = 'range';
      } catch(e) { }
      slider.min = 0;
      slider.max = 100;
      slider.value = ~~(backgroundAlpha * 100);
      slider.style.cssText = sliderCss;
      container.appendChild(slider);
      
      // pixel <- perspective (y reflected, still needs hom divide)
      ndcToPixel.translate((cWidth - 1) / 2, (cHeight - 1) / 2, 0);
      ndcToPixel.scale(cWidth/2, -cHeight/(2*hwRatio), 1);
      
      // perspective <- pixel
      pixelToNdc.invert(ndcToPixel);
      
      // pixel <- perspective <- eye <- world
      worldToPixel.copy(ndcToPixel).simplePerspective(fov).translate(0, 0, eyeDistance);
      
      // calculate uv coordinates (assumes objToWorld is identity)
      projectVec4(q0, worldToPixel, p0);
      projectVec4(q1, worldToPixel, p1);
      projectVec4(q2, worldToPixel, p2);
      projectVec4(q3, worldToPixel, p3);
      projectVec4(q4, worldToPixel, p4);
      p0.u = q0.x;
      p0.v = q0.y;
      p1.u = q1.x;
      p1.v = q1.y;
      p2.u = q2.x;
      p2.v = q2.y;
      p3.u = q3.x;
      p3.v = q3.y;
      p4.u = q4.x;
      p4.v = q4.y;
      
      // init arcball vector
      dragX = cWidth / 2;
      dragY = cHeight / 2;
      getArcballVec(arcStart, dragX, dragY);
      
      createCheckerboardTexture();
      
      bgGradient = ctx.createRadialGradient(cWidth/2, cHeight/2, 0, cWidth/2, cHeight/2, cWidth/1.1);
      bgGradient.addColorStop(0, bgColorLight);
      bgGradient.addColorStop(1, bgColorDark);

      // register hook for mouse interaction and slider change
      canvas.addEventListener('mousedown', dragStart, false);
      slider.addEventListener('change', sliderValueChange, false);
    }
    
    // Creates checkerboard texture on the canvas and saves to checkerTexture image
    function createCheckerboardTexture() {
      function randomish() {
        var r = Math.random();
        return r*r*2 - 1;
      }
      
      var horizSquares = Math.ceil(cWidth / patternSize),
          vertSquares = Math.ceil(cHeight / patternSize),
          x, y, varWidth, varPos;
      
      ctx.fillStyle = checkerBgColor;
      ctx.fillRect(0, 0, cWidth, cHeight);
      
      // fill squares
      ctx.fillStyle = checkerColorColor;
      for (y = 0; y < vertSquares; y++) {
        for (x = 0; x < horizSquares; x++) {
          if ((x + y) % 2 == 1)
            continue;
            
          ctx.fillRect(x*patternSize, y*patternSize, patternSize, patternSize);
        }
      }
      
      // dividing lines
      ctx.fillStyle = checkerLineColor;
      for (y = 1; y < vertSquares; y++) {
        // oh, whimsy
        varPos = Math.round(randomish() * lineSpreadVariance);
        varWidth = Math.round(randomish() * lineWidthVariance);
        ctx.fillRect(0, y*patternSize + varPos, cWidth, patternLineWidth + varWidth);
      }
      for (x = 1; x < horizSquares; x++) {
        varPos = Math.round(randomish() * lineSpreadVariance);
        varWidth = Math.round(randomish() * lineWidthVariance);
        ctx.fillRect(x*patternSize + varPos, 0, patternLineWidth + varWidth, cHeight);
      }
      
      // grab texture and clear canvas
      checkerTexture.src = canvas.toDataURL();
      canvas.width = cWidth;
      
      // make sure it's drawn to screen when finished loading
      checkerTexture.addEventListener('load', scheduleUpdate, false);
    }
    
    // create a unit quaternion which represents rotation from vecStart to vecEnd
    // in this demo, can safely assume vectors will never be antipodal, but this
    // isn't true in general
    function createRotationQuaternion(quatDest, vecStart, vecEnd) {
      var dot = vecStart.x*vecEnd.x + vecStart.y*vecEnd.y + vecStart.z*vecEnd.z,
          m = Math.sqrt(2 + 2*dot);
          
      quatDest.w = m / 2;
      m = 1 / m;
      
      // scaled cross product
      quatDest.x = m * (vecStart.y*vecEnd.z - vecEnd.y*vecStart.z);
      quatDest.y = m * (vecStart.z*vecEnd.x - vecEnd.z*vecStart.x);
      quatDest.z = m * (vecStart.x*vecEnd.y - vecEnd.x*vecStart.y);
    }
    
    function dragEnd(event) {
      if (isDragging) {
        setDragCoords(event.clientX, event.clientY);
      
        // no need to listen to mouse move and up events
        document.removeEventListener('mousemove', dragMove, false);
        document.removeEventListener('mouseup', dragEnd, false);
        
        isDragging = false;
      }
    }
    
    function dragMove(event) {
      if (isDragging) {
        setDragCoords(event.clientX, event.clientY);
      }
    }
    
    function dragStart(event) {
      setDragCoords(event.clientX, event.clientY);
      
      getArcballVec(arcStart, dragX, dragY);
      arcDrag.copy(arcStart);
      
      // store current orientation for starting point of new rotation
      quatCumulative.copy(quatCurrent);
      
      // start listening to mouse move and up events
      document.addEventListener('mousemove', dragMove, false);
      document.addEventListener('mouseup', dragEnd, false);
      
      isDragging = true;
      scheduleUpdate();
      
      event.preventDefault();
    }
    
    // draw the front or back half of a cube inscribed within a unit sphere
    function drawHalfBox(mat, isFront) {
      var x0, y0, x1, y1, rW,
        z = isFront ? iC : -iC;
    
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      
      // top left
      // once again, assumes scene is constructed to avoid divides by zero
      // what follows is admittedly hideous
      rW = 1 / mat.transformW(-iC, iC, z, 1);
      x0 = rW * mat.transformX(-iC, iC, z, 1);
      y0 = rW * mat.transformY(-iC, iC, z, 1);
      ctx.moveTo(x0, y0);
      
      rW = 1 / mat.transformW(-iC, iC, 0, 1);
      x1 = rW * mat.transformX(-iC, iC, 0, 1);
      y1 = rW * mat.transformY(-iC, iC, 0, 1);
      ctx.lineTo(x1, y1);
      ctx.moveTo(x0, y0);
      
      // bottom left
      rW = 1 / mat.transformW(-iC, -iC, z, 1);
      x1 = rW * mat.transformX(-iC, -iC, z, 1);
      y1 = rW * mat.transformY(-iC, -iC, z, 1);
      ctx.lineTo(x1, y1);
      
      rW = 1 / mat.transformW(-iC, -iC, 0, 1);
      x0 = rW * mat.transformX(-iC, -iC, 0, 1);
      y0 = rW * mat.transformY(-iC, -iC, 0, 1);
      ctx.lineTo(x0, y0);
      ctx.moveTo(x1, y1);
      
      // bottom right
      rW = 1 / mat.transformW(iC, -iC, z, 1);
      x0 = rW * mat.transformX(iC, -iC, z, 1);
      y0 = rW * mat.transformY(iC, -iC, z, 1);
      ctx.lineTo(x0, y0);
      
      rW = 1 / mat.transformW(iC, -iC, 0, 1);
      x1 = rW * mat.transformX(iC, -iC, 0, 1);
      y1 = rW * mat.transformY(iC, -iC, 0, 1);
      ctx.lineTo(x1, y1);
      ctx.moveTo(x0, y0);
      
      // top right
      rW = 1 / mat.transformW(iC, iC, z, 1);
      x1 = rW * mat.transformX(iC, iC, z, 1);
      y1 = rW * mat.transformY(iC, iC, z, 1);
      ctx.lineTo(x1, y1);
      
      rW = 1 / mat.transformW(iC, iC, 0, 1);
      x0 = rW * mat.transformX(iC, iC, 0, 1);
      y0 = rW * mat.transformY(iC, iC, 0, 1);
      ctx.lineTo(x0, y0);
      ctx.moveTo(x1, y1);
      
      // back to top left
      rW = 1 / mat.transformW(-iC, iC, z, 1);
      x0 = rW * mat.transformX(-iC, iC, z, 1);
      y0 = rW * mat.transformY(-iC, iC, z, 1);
      ctx.lineTo(x0, y0);
      
      ctx.stroke();
    }
    
    // uses affine texture mapping to draw a textured triangle at screen
    // coordinates [x0, y0], [x1, y1], [x2, y2] from img *pixel* coordinates
    // [u0, v0], [u1, v1], [u2, v2]
    function drawTexturedTriangle(img, imgAlpha, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      
      x1 -= x0;
      y1 -= y0;
      x2 -= x0;
      y2 -= y0;
      
      u1 -= u0;
      v1 -= v0;
      u2 -= u0;
      v2 -= v0;
      
      var det = 1 / (u1*v2 - u2*v1),

          a = (v2*x1 - v1*x2) * det,
          b = (v2*y1 - v1*y2) * det,
          c = (u1*x2 - u2*x1) * det,
          d = (u1*y2 - u2*y1) * det,
          e = x0 - a*u0 - c*v0,
          f = y0 - b*u0 - d*v0;

      ctx.save();
      ctx.transform(a, b, c, d, e, f);
      ctx.globalAlpha = imgAlpha;
      ctx.drawImage(img, 0, 0);
      ctx.clip();
      ctx.globalAlpha = 1;
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }
    
    // translate pixel coordinates to a position on the arcball
    function getArcballVec(vec, pixelX, pixelY) {
      var x = pixelToNdc.transformX(pixelX, pixelY, 0, 1),
          y = pixelToNdc.transformY(pixelX, pixelY, 0, 1),
          mag;
          
      // for this example, scale to height of canvas
      x /= hwRatio;
      y /= hwRatio;
      mag = x*x + y*y;

      if (mag <= 1) {
        vec.x = x * arcMaxXY;
        vec.y = y * arcMaxXY;
        vec.z = Math.sqrt(1 - mag * arcMaxXY * arcMaxXY);
        
      } else {
        mag = Math.sqrt(mag);
        vec.x = x / mag * arcMaxXY;
        vec.y = y / mag * arcMaxXY;
        vec.z = arcMinZ;
      }
      
      vec.w = 0;
    }
    
    // multiply two quaternions and store the result in quatDest
    // note that norm(a*b) = norm(a)*norm(b)
    function multiplyQuaternions(quatDest, a, b) {
      // a.w*b + b.w*a + (a x b)
      quatDest.x = a.w*b.x + a.x*b.w + a.y*b.z - a.z*b.y;
      quatDest.y = a.w*b.y + a.y*b.w + a.z*b.x - a.x*b.z;
      quatDest.z = a.w*b.z + a.z*b.w + a.x*b.y - a.y*b.x;
      
      // a.w*b.w - a.b
      quatDest.w = a.w*b.w - a.x*b.x - a.y*b.y - a.z*b.z;
    }
    
    // transforms a vector by matrix mat, does homogeneous divide
    // NOTE: assumes scene is set up so there will never be a divide by 0.
    // can and will break if this is not the case.
    function projectVec4(vecDest, mat, vecSrc) {
      var rW = 1 / mat.transformW(vecSrc.x, vecSrc.y, vecSrc.z, vecSrc.w);
      
      vecDest.x = rW * mat.transformX(vecSrc.x, vecSrc.y, vecSrc.z, vecSrc.w);
      vecDest.y = rW * mat.transformY(vecSrc.x, vecSrc.y, vecSrc.z, vecSrc.w);
      vecDest.z = rW * mat.transformZ(vecSrc.x, vecSrc.y, vecSrc.z, vecSrc.w);
      vecDest.w = 1;
    }
    
    function scheduleUpdate() {
      if (!scheduledUpdate) {
        setTimeout(update, frameDelay);
        scheduledUpdate = true;
      }
    }
    
    function setDragCoords(clientX, clientY) {
      var box = canvas.getBoundingClientRect();
      dragX = clientX - box.left;
      dragY = clientY - box.top;
    }
    
    function sliderValueChange() {
      var val = parseFloat(slider.value);
      if (!isNaN(val)) {
        backgroundAlpha = Math.max(0, Math.min(1, val / 100));
        scheduleUpdate();
      }
    }
    
    // updates actual display
    function update() {
      // find arcball position of current mouse coords
      getArcballVec(arcDrag, dragX, dragY);
      
      // find quaternion that rotates drag start to end and concatenate
      // to accumulated orientation
      createRotationQuaternion(quatDrag, arcStart, arcDrag);
      multiplyQuaternions(quatCurrent, quatDrag, quatCumulative);
      objToWorld.copyUnitQuaternion(quatCurrent);
    
      // transform verts
      workMat.multiply(worldToPixel, objToWorld);
      projectVec4(q0, workMat, p0);
      projectVec4(q1, workMat, p1);
      projectVec4(q2, workMat, p2);
      projectVec4(q3, workMat, p3);
      
      // clear canvas
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, cWidth, cHeight);
      
      // draw the half of the containing box at the back of triangle(s)
      var frontFacing = (q3.x - q0.x)*(q1.y - q0.y) >= (q3.y - q0.y)*(q1.x - q0.x);
      drawHalfBox(workMat, !frontFacing);
      
      // draw triangle(s)
      if (demoNum != 3) {
        drawTexturedTriangle(checkerTexture, backgroundAlpha, q0.x, q0.y, q1.x, q1.y, q3.x, q3.y,
                                                              p0.u, p0.v, p1.u, p1.v, p3.u, p3.v);
        if (demoNum == 2) {
          drawTexturedTriangle(checkerTexture, 0, q2.x, q2.y, q3.x, q3.y, q1.x, q1.y,
                                                  p2.u, p2.v, p3.u, p3.v, p1.u, p1.v);
        }
        
      } else {
        drawTexturedTriangle(checkerTexture, backgroundAlpha, q0.x, q0.y, q1.x, q1.y, q4.x, q4.y,
                                                              p0.u, p0.v, p1.u, p1.v, p4.u, p4.v);
        drawTexturedTriangle(checkerTexture, 0, q2.x, q2.y, q4.x, q4.y, q1.x, q1.y,
                                                p2.u, p2.v, p4.u, p4.v, p1.u, p1.v);
        drawTexturedTriangle(checkerTexture, 0, q2.x, q2.y, q3.x, q3.y, q4.x, q4.y,
                                                p2.u, p2.v, p3.u, p3.v, p4.u, p4.v);
        drawTexturedTriangle(checkerTexture, 0, q0.x, q0.y, q4.x, q4.y, q3.x, q3.y,
                                                p0.u, p0.v, p4.u, p4.v, p3.u, p3.v);
      }
      
      // draw the other half in front
      drawHalfBox(workMat, frontFacing);
      
      // if still dragging, scene will need to be redrawn
      scheduledUpdate = false;
      if (isDragging) {
        scheduleUpdate();
      }
    }
    
    init();
  }
  
  // export for closure compiler
  window['createAffineDemo'] = createAffineDemo;
})();