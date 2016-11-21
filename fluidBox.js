class FluidBox {
  constructor(d, u, v){
    this.N = Math.sqrt(d.length - 2);
    this.size = d.length;
    this.iterations = 10;
    this.u = u || this.defaultArray();
    this.v = v || this.defaultArray();
    this.d = d || this.defaultArray();
    this.viscosity = 0.5;
    this.dt = 0.1;
  }

  setDensity(x, y, density){
    this.d[this.IX(x, y)] = density;
  }

  setVelocity(x, y, vx, vy){
    this.u[this.IX(x, y)] = vx;
    this.v[this.IX(x, y)] = vy;
  }

  getDensity(x, y){
    return this.d[this.IX(x, y)];
  }

  defaultArray(){
      let arr = new Array(this.size);
      for (let i = 0; i < arr.length; i++)
          arr[i] = 0;
      return arr;
  }

  update(prev){
    this.velocityStep(this.N, this.u, this.v, prev.u, prev.v, this.viscosity, this.dt);
    this.densityStep(this.N, this.d, prev.d, this.u, this.v, this.viscosity, this.dt);
  }

  IX(i, j){
    return i + (this.width + 2) * j;
  }

  addSource(x, s, dt){
    for(let i = 0; i < this.size; i++)
      x[i] += dt * s[i];
  }

  diffuse(N, b, x, x0, diff, dt ){
    let a = dt * diff * N * N;
    for (let k=0 ; k < this.iterations ; k++ ) {
      for (let i=1 ; i <= this.height ; i++ ) {
        for (let j=1 ; j <= this.width ; j++ ) {
          x[this.IX(i, j)] = (x0[this.IX(i, j)] + a * (x[this.IX(i - 1, j)] + x[this.IX(i + 1, j)] +  x[this.IX(i, j - 1)] + x[this.IX(i, j + 1)])) / (1 + 4 * a);
        }
      }
      x = this.setBoundary( N, b, x );
    }
  }

  advect (N, b, d, d0, u, v, dt){
    let x, y, s0, t0, s1, t1;
    let dt0 = dt * N;

    for(let i = 1; i <= N; i++){
      for(let j = 1; j <= N; j++){
        x = i - dt0 * u[this.IX(i,j)];
        y = j - dt0 * v[this.IX(i,j)];
        if (x < 0.5)
          x = 0.5;
        if (x > N + 0.5)
          x = N + 0.5;
        let i0 = parseInt(x);
        let i1 = i0 + 1;

        if (y < 0.5)
          y = 0.5;
        if (y > N + 0.5)
          y = N + 0.5;
        let j0 = parseInt(y);
        let j1 = j0 + 1;
        s1 = x - i0;
        s0 = 1 - s1;
        t1 = y - j0;
        t0 = 1 - t1;
        d[this.IX(i,j)] = s0 * ( t0 * d0[this.IX(i0,j0)] + t1 * d0[this.IX(i0,j1)]) + s1 * (t0 * d0[this.IX(i1,j0)] + t1 * d0[this.IX(i1,j1)]);
      }
    }
    d = this.set_bnd(N, b, d);
  }

  densityStep(N, x, x0, u, v,  diff, dt){
    this.addSource (N, x, x0, dt);
    this.swap(x0, x);
    this.diffuse(N, 0, x, x0, diff, dt);
    this.swap(x0, x);
    this.advect(N, 0, x, x0, u, v, dt);
  }

  velocityStep(N, u, v, u0, v0, visc, dt){
    this.addSource(N, u, u0, dt);
    this.addSource(N, v, v0, dt);
    this.swap(u0, u);
    this.diffuse(N, 1, u, u0, visc, dt);
    this.swap(v0, v);
    this.diffuse(N, 2, v, v0, visc, dt);
    this.project(N, u, v, u0, v0);
    this.swap(u0, u);
    this.swap(v0, v);
    this.advect(N, 1, u, u0, u0, v0, dt);
    this.advect(N, 2, v, v0, u0, v0, dt);
    this.project(N, u, v, u0, v0);
  }

  project(N, u, v, p, div){
    let h = 1.0/N;
    for(let i = 1; i <= N; i++){
      for(let j = 1; j <= N; j++){
        div[this.IX(i,j)] = -0.5 * h * (u[this.IX(i+1,j)] - u[this.IX(i-1,j)] + v[this.IX(i, j + 1)] - v[this.IX(i, j-1)]);
        p[this.IX(i,j)] = 0;
      }
    }
    div = this.setBoundary(N, 0, div);
    div = this.setBoundary(N, 0, p);
    for (let k=0 ; k<this.iterations ; k++ ) {
      for (let i=1 ; i<=N ; i++ ) {
        for (let j=1 ; j<=N ; j++ ) {
          p[this.IX(i,j)] = (div[this.IX(i,j)]+p[this.IX(i-1,j)]+p[this.IX(i+1,j)]+p[this.IX(i,j-1)]+p[this.IX(i,j+1)])/4;
        }
      }
      p = this.setBoundary(N, 0, p);
    }
    for (let i=1 ; i<=N ; i++ ) {
      for (let j=1 ; j<=N ; j++ ) {
        u[this.IX(i,j)] -= 0.5*(p[this.IX(i+1,j)]-p[this.IX(i-1,j)])/h;
        v[this.IX(i,j)] -= 0.5*(p[this.IX(i,j+1)]-p[this.IX(i,j-1)])/h;
      }
    }
    u = this.setBoundary(N, 1, u);
    v = this.setBoundary(N, 2, v);
  }

  setBoundary(N, b, x){
    for (let i = 1; i <= N; i++) {
      x[this.IX(0 ,i)] = b === 1 ? -x[this.IX(1,i)] : x[this.IX(1,i)];
      x[this.IX(N+1,i)] = b === 1 ? -x[this.IX(N,i)] : x[this.IX(N,i)];
      x[this.IX(i,0 )] = b === 2 ? -x[this.IX(i,1)] : x[this.IX(i,1)];
      x[this.IX(i,N+1)] = b === 2 ? -x[this.IX(i,N)] : x[this.IX(i,N)];
    }
    x[this.IX(0 ,0 )] = 0.5*(x[this.IX(1,0 )]+x[this.IX(0 ,1)]);
    x[this.IX(0 ,N+1)] = 0.5*(x[this.IX(1,N+1)]+x[this.IX(0 ,N )]);
    x[this.IX(N+1,0 )] = 0.5*(x[this.IX(N,0 )]+x[this.IX(N+1,1)]);
    x[this.IX(N+1,N+1)] = 0.5*(x[this.IX(N,N+1)]+x[this.IX(N+1,N )]);
    return x;
  }

  swap(x, y){
    let temp = x;
    x = y;
    y = x;
  }
}
