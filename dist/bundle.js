/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _fluidSimulator = __webpack_require__(1);
	
	var _fluidSimulator2 = _interopRequireDefault(_fluidSimulator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener('DOMContentLoaded', function () {
	  var width = document.getElementById('fluidSimulator').offsetWidth;
	  var height = document.getElementById('fluidSimulator').offsetHeight;
	  var resolution = parseInt(document.getElementById('resolution').value);
	  var density = parseInt(document.getElementById('density').value);
	  var iterations = parseInt(document.getElementById('iterations').value);
	  var viscosity = parseFloat(document.getElementById('viscosity').value);
	  var diffusion = parseFloat(document.getElementById('diffusion').value);
	  var simulator = new _fluidSimulator2.default(width, height, resolution, density, diffusion, viscosity, iterations);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _fluidSolver = __webpack_require__(2);
	
	var _fluidSolver2 = _interopRequireDefault(_fluidSolver);
	
	var _fluidBoxRenderer = __webpack_require__(4);
	
	var _fluidBoxRenderer2 = _interopRequireDefault(_fluidBoxRenderer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FluidSimulator = function () {
	  function FluidSimulator(width, height, resolution, density, diffusion, viscosity, iterations) {
	    _classCallCheck(this, FluidSimulator);
	
	    this.width = width;
	    this.height = height;
	    this.resolution = resolution;
	    this.density = density || 90;
	
	    this.startPos = [0, 0];
	    this.currentPos = [0, 0];
	    this.mouseIsDown = false;
	    this.simulating = false;
	
	    this.solver = new _fluidSolver2.default(resolution, iterations, viscosity, diffusion);
	    this.solver.setUI(this.ui.bind(this));
	
	    this.canvas = this.initCanvas();
	    this.initControlPanel();
	    this.renderer = new _fluidBoxRenderer2.default(this.canvas, this.solver);
	
	    for (var i = 0; i < 20; i++) {
	      this.update();
	    }
	  }
	
	  _createClass(FluidSimulator, [{
	    key: 'update',
	    value: function update() {
	      this.solver.update();
	      this.renderer.render();
	    }
	  }, {
	    key: 'initControlPanel',
	    value: function initControlPanel() {
	      var _this = this;
	
	      var $viscCtrl = $('#viscosity');
	      $viscCtrl.change(function (e) {
	        _this.solver.setViscosity(parseFloat(e.target.value));
	      });
	
	      var $diffusionCtrl = $('#diffusion');
	      $diffusionCtrl.change(function (e) {
	        _this.solver.setDiffusion(parseFloat(e.target.value));
	      });
	
	      var $resolutionCtrl = $('#resolution');
	      $resolutionCtrl.change(function (e) {
	        _this.simulating = false;
	        _this.resolution = parseInt(e.target.value);
	        _this.solver = new _fluidSolver2.default(_this.resolution);
	
	        _this.solver.setUI(_this.ui.bind(_this));
	        _this.canvas = _this.initCanvas();
	        _this.renderer = new _fluidBoxRenderer2.default(_this.canvas, _this.solver);
	      });
	
	      var $iterationsCtrl = $('#iterations');
	      $iterationsCtrl.change(function (e) {
	        _this.solver.setIterations(parseInt(e.target.value));
	      });
	
	      var $densityCtrl = $('#density');
	      $densityCtrl.change(function (e) {
	        _this.density = parseInt(e.target.value);
	      });
	    }
	  }, {
	    key: 'initCanvas',
	    value: function initCanvas() {
	      var canvas = $('#fluidSimulator').get(0);
	
	      canvas.width = canvas.height = this.resolution;
	      canvas.touchend = canvas.onmouseup = this.mouseUpHandler.bind(this);
	      canvas.touchstart = canvas.onmousedown = this.mouseDownHandler.bind(this);
	      canvas.touchmove = canvas.onmousemove = this.mouseMoveHandler.bind(this);
	
	      return canvas;
	    }
	  }, {
	    key: 'mouseDownHandler',
	    value: function mouseDownHandler(e) {
	      e.preventDefault();
	      this.startPos = this.currentPos = this.getMousePos(e);
	      this.mouseIsDown = true;
	
	      if (!this.simulating) {
	        this.simulating = true;
	        setInterval(this.update.bind(this), 10);
	      }
	    }
	  }, {
	    key: 'mouseMoveHandler',
	    value: function mouseMoveHandler(e) {
	      e.preventDefault();
	      this.currentPos = this.getMousePos(e);
	    }
	  }, {
	    key: 'mouseUpHandler',
	    value: function mouseUpHandler(e) {
	      e.preventDefault();
	      this.mouseIsDown = false;
	    }
	  }, {
	    key: 'getMousePos',
	    value: function getMousePos(e) {
	      var posX = e.clientX - this.canvas.offsetLeft;
	      var posY = e.clientY - this.canvas.offsetTop;
	      return [posX, posY];
	    }
	  }, {
	    key: 'ui',
	    value: function ui(fluidBox) {
	      var startX = this.startPos[0];
	      var startY = this.startPos[1];
	      var currentX = this.currentPos[0];
	      var currentY = this.currentPos[1];
	
	      if (this.inCanvas(this.startPos) && this.mouseIsDown) {
	        var dx = currentX - startX;
	        var dy = currentY - startY;
	        var d = Math.sqrt(dx * dx + dy * dy) || 0;
	
	        for (var i = 0; i < d; i++) {
	          var x = Math.floor((startX + dx * (i / d)) * fluidBox.width() / this.width);
	          var y = Math.floor((startY + dy * (i / d)) * fluidBox.height() / this.height);
	
	          fluidBox.setVelocity(x, y, dx, dy);
	          fluidBox.setDensity(x, y, this.density);
	        }
	
	        this.startPos = [currentX, currentY];
	      }
	    }
	  }, {
	    key: 'inCanvas',
	    value: function inCanvas(pos) {
	      return pos[0] >= 0 && pos[0] < this.width && pos[1] >= 0 && pos[1] < this.height;
	    }
	  }]);
	
	  return FluidSimulator;
	}();
	
	exports.default = FluidSimulator;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _fluidBox = __webpack_require__(3);
	
	var _fluidBox2 = _interopRequireDefault(_fluidBox);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var iter = 10;
	var dt = 0.1;
	var N = 128;
	var systemSize = (N + 2) * (N + 2);
	
	function addSource(x, s) {
	  for (var i = 0; i < systemSize; i++) {
	    x[i] += dt * s[i];
	  }
	}
	
	function IX(i, j) {
	  return i + (N + 2) * j;
	}
	
	function setBoundary(b, x) {
	  for (var i = 1; i <= N; i++) {
	    x[IX(0, i)] = b === 1 ? -x[IX(1, i)] : x[IX(1, i)];
	    x[IX(N + 1, i)] = b === 1 ? -x[IX(N, i)] : x[IX(N, i)];
	    x[IX(i, 0)] = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
	    x[IX(i, N + 1)] = b === 2 ? -x[IX(i, N)] : x[IX(i, N)];
	  }
	
	  x[IX(0, 0)] = 0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
	  x[IX(0, N + 1)] = 0.5 * (x[IX(1, N + 1)] + x[IX(0, N)]);
	  x[IX(N + 1, 0)] = 0.5 * (x[IX(N, 0)] + x[IX(N + 1, 1)]);
	  x[IX(N + 1, N + 1)] = 0.5 * (x[IX(N, N + 1)] + x[IX(N + 1, N)]);
	
	  return x;
	}
	
	function gaussSeidel(b, x, x0, diff) {
	  var a = dt * diff;
	
	  for (var k = 0; k < iter; k++) {
	    for (var i = 1; i <= N; i++) {
	      for (var j = 1; j <= N; j++) {
	        var neighborSum = x[IX(i - 1, j)] + x[IX(i + 1, j)] + x[IX(i, j - 1)] + x[IX(i, j + 1)];
	        x[IX(i, j)] = (x0[IX(i, j)] + a * neighborSum) / (1 + 4 * a);
	      }
	    }
	    setBoundary(b, x);
	  }
	}
	
	function diffuse(b, x, x0, diff) {
	  gaussSeidel(b, x, x0, diff);
	}
	
	function advect(b, d, d0, u, v) {
	  var x = void 0,
	      y = void 0,
	      s0 = void 0,
	      t0 = void 0,
	      s1 = void 0,
	      t1 = void 0,
	      i0 = void 0,
	      i1 = void 0,
	      j0 = void 0,
	      j1 = void 0;
	
	  for (var i = 1; i <= N; i++) {
	    for (var j = 1; j <= N; j++) {
	      x = i - N * dt * u[IX(i, j)];
	      y = j - N * dt * v[IX(i, j)];
	
	      if (x < 0.5) x = 0.5;else if (x > N + 0.5) x = N + 0.5;
	      i0 = Math.floor(x);
	      i1 = i0 + 1;
	
	      if (y < 0.5) y = 0.5;else if (y > N + 0.5) y = N + 0.5;
	      j0 = Math.floor(y);
	      j1 = j0 + 1;
	
	      s1 = x - i0;
	      s0 = 1 - s1;
	      t1 = y - j0;
	      t0 = 1 - t1;
	
	      d[IX(i, j)] = s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) + s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
	    }
	  }
	  setBoundary(b, d);
	}
	
	function project(u, v, p, div) {
	  for (var j = 1; j <= N; j++) {
	    for (var i = 1; i <= N; i++) {
	      var neighborSum = u[IX(i + 1, j)] - u[IX(i - 1, j)] + v[IX(i, j + 1)] - v[IX(i, j - 1)];
	      div[IX(i, j)] = -0.5 * neighborSum / N;
	
	      p[IX(i, j)] = 0;
	    }
	  }
	  setBoundary(0, div);
	  setBoundary(0, p);
	
	  for (var k = 0; k < iter; k++) {
	    for (var _i = 1; _i <= N; _i++) {
	      for (var _j = 1; _j <= N; _j++) {
	        var _neighborSum = p[IX(_i - 1, _j)] + p[IX(_i + 1, _j)] + p[IX(_i, _j - 1)] + p[IX(_i, _j + 1)];
	        p[IX(_i, _j)] = (div[IX(_i, _j)] + _neighborSum) / 4;
	      }
	    }
	    setBoundary(0, p);
	  }
	  setBoundary(0, p);
	
	  for (var _j2 = 1; _j2 <= N; _j2++) {
	    for (var _i2 = 1; _i2 <= N; _i2++) {
	      u[IX(_i2, _j2)] -= 0.5 * N * (p[IX(_i2 + 1, _j2)] - p[IX(_i2 - 1, _j2)]);
	      v[IX(_i2, _j2)] -= 0.5 * N * (p[IX(_i2, _j2 + 1)] - p[IX(_i2, _j2 - 1)]);
	    }
	  }
	  setBoundary(1, u);
	  setBoundary(2, v);
	}
	
	function densityStep(x, x0, u, v, diff) {
	  addSource(x, x0);
	  diffuse(0, x0, x, diff);
	  advect(0, x, x0, u, v);
	}
	
	function velocityStep(u, v, u0, v0, visc) {
	  addSource(u, u0);
	  addSource(v, v0);
	
	  diffuse(1, u0, u, visc);
	  diffuse(2, v0, v, visc);
	  project(u0, v0, u, v);
	
	  advect(1, u, u0, u0, v0);
	  advect(2, v, v0, u0, v0);
	  project(u, v, u0, v0);
	}
	
	var FluidSolver = function () {
	  function FluidSolver(resolution, iterations, viscosity, diffusion) {
	    _classCallCheck(this, FluidSolver);
	
	    N = resolution || 128;
	    systemSize = (N + 2) * (N + 2);
	    dt = 0.08;
	    iter = iterations || 10;
	    this.viscosity = viscosity || 0.5;
	    this.diffusion = diffusion || 0.3;
	
	    this.u = new Array(systemSize).fill(0);
	    this.v = new Array(systemSize).fill(0);
	    this.d = new Array(systemSize).fill(0);
	
	    this.u0 = new Array(systemSize).fill(0);
	    this.v0 = new Array(systemSize).fill(0);
	    this.d0 = new Array(systemSize).fill(0);
	  }
	
	  _createClass(FluidSolver, [{
	    key: 'setViscosity',
	    value: function setViscosity(viscosity) {
	      this.viscosity = viscosity;
	    }
	  }, {
	    key: 'setDiffusion',
	    value: function setDiffusion(diffusion) {
	      this.diffusion = diffusion;
	    }
	  }, {
	    key: 'setTimeStep',
	    value: function setTimeStep(timeStep) {
	      dt = timeStep;
	    }
	  }, {
	    key: 'setResolution',
	    value: function setResolution(resolution) {
	      N = resolution;
	      systemSize = (N + 2) * (N + 2);
	    }
	  }, {
	    key: 'setIterations',
	    value: function setIterations(iterations) {
	      iter = iterations;
	    }
	  }, {
	    key: 'width',
	    value: function width() {
	      return N;
	    }
	  }, {
	    key: 'height',
	    value: function height() {
	      return N;
	    }
	  }, {
	    key: 'getDensity',
	    value: function getDensity(x, y) {
	      return this.d[IX(x, y)];
	    }
	  }, {
	    key: 'setDensity',
	    value: function setDensity(x, y, d) {
	      this.d[IX(x, y)] = d;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      for (var i = 0; i < systemSize; i++) {
	        this.u0[i] = this.v0[i] = this.d0[i] = 0.0;
	      }this.ui(new _fluidBox2.default(this.d0, this.u0, this.v0));
	      velocityStep(this.u, this.v, this.u0, this.v0, this.viscosity);
	      densityStep(this.d, this.d0, this.u, this.v, this.diffusion);
	    }
	  }, {
	    key: 'setUI',
	    value: function setUI(callback) {
	      this.ui = callback;
	    }
	  }]);
	
	  return FluidSolver;
	}();
	
	exports.default = FluidSolver;

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FluidBox = function () {
	  function FluidBox(d, u, v) {
	    _classCallCheck(this, FluidBox);
	
	    this.d = d;
	    this.u = u;
	    this.v = v;
	    this.size = Math.sqrt(d.length);
	  }
	
	  _createClass(FluidBox, [{
	    key: "IX",
	    value: function IX(i, j) {
	      return i + this.size * j;
	    }
	  }, {
	    key: "setDensity",
	    value: function setDensity(x, y, d) {
	      this.d[this.IX(x + 1, y + 1)] = d;
	    }
	  }, {
	    key: "getDensity",
	    value: function getDensity(x, y) {
	      return this.d[this.IX(x + 1, y + 1)];
	    }
	  }, {
	    key: "setVelocity",
	    value: function setVelocity(x, y, vX, vY) {
	      this.u[this.IX(x + 1, y + 1)] = vX;
	      this.v[this.IX(x + 1, y + 1)] = vY;
	    }
	  }, {
	    key: "width",
	    value: function width() {
	      return this.size - 2;
	    }
	  }, {
	    key: "height",
	    value: function height() {
	      return this.size - 2;
	    }
	  }]);
	
	  return FluidBox;
	}();
	
	exports.default = FluidBox;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FluidBoxRenderer = function () {
	  function FluidBoxRenderer(canvas, solver) {
	    _classCallCheck(this, FluidBoxRenderer);
	
	    this.solver = solver;
	    this.canvas = canvas;
	    this.ctx = canvas.getContext('2d');
	    this.imageData = this.ctx.createImageData(solver.width(), solver.height());
	
	    // set image data to alpha to 255
	    for (var i = 3; i < this.imageData.data.length; i += 4) {
	      this.imageData.data[i] = 255;
	    }this.densify();
	  }
	
	  _createClass(FluidBoxRenderer, [{
	    key: 'densify',
	    value: function densify() {
	      var ctx = this.canvas.getContext('2d');
	      ctx.beginPath();
	      ctx.rect(0, 0, this.canvas.width, this.canvas.height);
	      ctx.fillStyle = "black";
	      ctx.fill();
	      ctx.fillStyle = 'gray';
	      ctx.textAlign = 'center';
	
	      ctx.font = this.canvas.width / 12 + 'px Courier New';
	      ctx.fillText('Click and Drag!', this.canvas.width / 2, this.canvas.height / 2);
	
	      var width = this.solver.width();
	      var height = this.solver.height();
	      var data = ctx.getImageData(0, 0, width, height).data;
	      for (var pixel = 0; pixel < data.length; pixel += 4) {
	        if (data[pixel] > 10) {
	          var i = pixel / 4 % width | 0;
	          var j = pixel / 4 / width | 0;
	          this.solver.setDensity(i, j, 5);
	        }
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var data = this.imageData.data;
	      var height = this.solver.height();
	      var width = this.solver.width();
	
	      for (var i = 0; i < width; i++) {
	        for (var j = 0; j < height; j++) {
	          var pixel = 4 * (j * height + i);
	          // red
	          data[pixel + 0] = this.solver.getDensity(i, j) * 255 * i / width / 5;
	          // green
	          data[pixel + 1] = this.solver.getDensity(i, j) * 255 * j / width / 5;
	          // blue
	          data[pixel + 2] = this.solver.getDensity(i, j) * 255 / 5;
	        }
	      }
	
	      this.ctx.putImageData(this.imageData, 0, 0);
	    }
	  }]);
	
	  return FluidBoxRenderer;
	}();
	
	exports.default = FluidBoxRenderer;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map