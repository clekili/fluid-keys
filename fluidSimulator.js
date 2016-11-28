import FluidSolver from './fluidSolver.js';
import FluidBoxRenderer from './fluidBoxRenderer.js';

class FluidSimulator {

  constructor(width, height, resolution, density){
    this.width = width;
    this.height = height;
    this.resolution = resolution;
    this.density = density || 50;

    this.startPos = [0, 0];
    this.currentPos = [0, 0];
    this.mouseIsDown = false;
    this.simulating = false;

    this.solver = new FluidSolver(resolution);
    this.solver.setUI(this.ui.bind(this));

    this.canvas = this.initCanvas();
    this.renderer = new FluidBoxRenderer(this.canvas, this.solver);

    // setInterval(this.update.bind(this), 10);
    // this.renderer.render();
  }

  update(){
    this.solver.update();
    this.renderer.render();
  }

  initCanvas(){
    let canvas = document.getElementById('fluidSimulator');
    canvas.width = canvas.height = this.resolution;
    window.ontouchend = window.onmouseup = this.mouseUpHandler.bind(this);
    canvas.ontouchstart = canvas.onmousedown = this.mouseDownHandler.bind(this);
    canvas.ontouchmove = canvas.onmousemove = this.mouseMoveHandler.bind(this);

    return canvas;
  }

  mouseDownHandler(e){
    e.preventDefault();
    this.startPos = this.currentPos = this.getMousePos(e);
    this.mouseIsDown = true;

    if(!this.simulating){
      this.simulating = true;
      setInterval(this.update.bind(this), 10);
    }
  }

  mouseMoveHandler(e){
    e.preventDefault();
    this.currentPos = this.getMousePos(e);
  }

  mouseUpHandler(e){
    e.preventDefault();
    this.mouseIsDown = false;
  }

  getMousePos(e){
    let posX = e.clientX - this.canvas.offsetLeft;
    let posY = e.clientY - this.canvas.offsetTop;
    return [posX, posY];
  }

  ui(fluidBox){
    let startX = this.startPos[0];
    let startY = this.startPos[1];
    let currentX = this.currentPos[0];
    let currentY = this.currentPos[1];

    if(this.inCanvas(this.startPos) && this.mouseIsDown){
      let dx = currentX - startX;
      let dy = currentY - startY;
      let d = Math.sqrt(dx * dx + dy * dy) || 0;

      for(let i = 0; i < d; i++){
        let x = Math.floor((startX + dx * (i / d)) * fluidBox.width() / this.width);
        let y = Math.floor((startY + dy * (i / d)) * fluidBox.height() / this.height);

        fluidBox.setVelocity(x, y, dx, dy);
        fluidBox.setDensity(x, y, this.density);
      }

      this.startPos = [currentX, currentY];
    }
  }

  inCanvas(pos){
    return pos[0] >= 0 && pos[0] < this.width && pos[1] >= 0 && pos[1] < this.height;
  }
}

export default FluidSimulator;
