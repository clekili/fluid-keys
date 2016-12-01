class FluidBoxRenderer {
  constructor(canvas, solver){
    this.solver = solver;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.imageData = this.ctx.createImageData(solver.width(), solver.height());

    // set image data to alpha to 255
    for(let i = 3; i < this.imageData.data.length; i += 4)
      this.imageData.data[i] = 255;

    this.densify();
  }

  densify(){
    let ctx = this.canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = 'gray';
    ctx.textAlign = 'center';

    ctx.font = `${this.canvas.width/12}px Courier New`;
    ctx.fillText('Click and Drag!', this.canvas.width/2, this.canvas.height/2);

    let width = this.solver.width();
    let height = this.solver.height();
    let data = ctx.getImageData(0, 0, width, height).data;
    for(let pixel = 0; pixel < data.length; pixel+=4){
      if(data[pixel] > 10){
        let i = (pixel / 4) % width | 0;
        let j = (pixel / 4) / width | 0;
        this.solver.setDensity(i, j, 5);
      }
    }

  }

  render(){
    let data = this.imageData.data;
    let height = this.solver.height();
    let width = this.solver.width();

    for(let i = 0; i < width; i++){
      for(let j = 0; j < height; j++){
        let pixel = 4 * (j * height + i);
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

}

export default FluidBoxRenderer;
