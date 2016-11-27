class FluidBox {
    constructor(d, u, v){
      this.d = d;
      this.u = u;
      this.v = v;
      this.size = Math.sqrt(d.length);
    }

    IX(i, j){
      return i + this.size * j;
    }

    setDensity(x, y, d) {
         this.d[this.IX(x + 1, y + 1)] = d;
    }

    getDensity(x, y) {
         return this.d[this.IX(x + 1, y + 1)];
    }

    setVelocity(x, y, vX, vY) {
      this.u[this.IX(x + 1, y + 1)] = vX;
      this.v[this.IX(x + 1, y + 1)] = vY;
    }

    width(){
      return this.size - 2;
    }

    height(){
      return this.size - 2;
    }
}


export default FluidBox;
