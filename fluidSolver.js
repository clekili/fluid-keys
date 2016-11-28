import FluidBox from './fluidBox';

let iterations = 10;
let dt = 0.1;
let N = 128;
let systemSize = (N+2) * (N+2);

function addSource(x, s){
    for(let i = 0; i < systemSize; i++) x[i] += dt * s[i];
}

function IX(i, j){
  return i + (N + 2) * j;
}

function setBoundary(b, x){
  for(let i = 1; i <= N ; i++){
    x[IX(0, i)]    = b === 1 ? -x[IX(1, i)] : x[IX(1, i)];
    x[IX(N+1, i)]  = b === 1 ? -x[IX(N, i)] : x[IX(N, i)];
    x[IX(i, 0)]    = b === 2 ? -x[IX(i, 1)] : x[IX(i, 1)];
    x[IX(i, N+1)]  = b === 2 ? -x[IX(i, N)] : x[IX(i, N)];
  }

  x[IX(0, 0)]     =   0.5 * (x[IX(1, 0)] + x[IX(0, 1)]);
  x[IX(0, N+1)]   =   0.5 * (x[IX(1, N+1)] + x[IX(0, N)]);
  x[IX(N+1, 0)]   =   0.5 * (x[IX(N, 0)] + x[IX(N+1, 1)]);
  x[IX(N+1, N+1)] =   0.5 * (x[IX(N, N+1)] + x[IX(N+1, N)]);

  return x;
}

function gaussSeidel(b, x, x0, diff){
  let a = dt * diff;

  for(let k = 0; k < iterations; k++){
    for(let i = 1; i <= N; i++){
      for(let j = 1; j <= N; j++){
        let neighborSum = x[IX(i-1, j)] + x[IX(i+1, j)] + x[IX(i, j-1)] + x[IX(i, j+1)];
        x[IX(i, j)] = (x0[IX(i, j)] + a * neighborSum) / (1 + 4 * a);
      }
    }
    setBoundary(b, x);
  }
}

function diffuse(b, x, x0, diff){
    gaussSeidel(b, x, x0, diff);
}

function advect(b, d, d0, u, v){
  let x, y, s0, t0, s1, t1, i0, i1, j0, j1;

  for(let i = 1; i <= N; i++){
      for(let j = 1; j <= N; j++){
          x = i - N * dt * u[IX(i, j)];
          y = j - N * dt * v[IX(i, j)];

          if (x < 0.5)
              x = 0.5;
          else if (x > N + 0.5)
              x = N + 0.5;
          i0 = Math.floor(x);
          i1 = i0 + 1;

          if (y < 0.5)
              y = 0.5;
          else if (y > N + 0.5)
              y = N + 0.5;
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

function project(u, v, p, div){
    for(let j = 1; j <= N; j++){
        for(let i = 1; i <= N; i++){
          let neighborSum = u[IX(i+1, j)] - u[IX(i-1, j)] + v[IX(i, j+1)] - v[IX(i, j-1)];
          div[IX(i, j)] = -0.5 * neighborSum / N;

          p[IX(i, j)] = 0;
        }
    }
    setBoundary(0, div);
    setBoundary(0, p);

    for(let k = 0; k < iterations; k++){
      for(let i = 1; i <= N; i++){
        for(let j = 1; j <= N; j++){
          let neighborSum = p[IX(i-1, j)] + p[IX(i+1, j)] + p[IX(i, j-1)] + p[IX(i, j+1)];
          p[IX(i, j)] = (div[IX(i, j)] + neighborSum) / 4;
        }
      }
      setBoundary(0, p);
    }
    setBoundary(0, p);

    for(let j = 1; j <= N; j++){
        for(let i = 1; i <= N; i++){
            u[IX(i, j)] -= 0.5 * N * (p[IX(i+1, j)] - p[IX(i-1, j)]);
            v[IX(i, j)] -= 0.5 * N * (p[IX(i, j+1)] - p[IX(i, j-1)]);
        }
    }
    setBoundary(1, u);
    setBoundary(2, v);
}

function densityStep(x, x0, u, v, diff){
    addSource(x, x0);
    diffuse(0, x0, x, diff);
    advect(0, x, x0, u, v);
}

function velocityStep(u, v, u0, v0, visc){
    addSource(u, u0);
    addSource(v, v0);

    diffuse(1, u0, u, visc);
    diffuse(2, v0, v, visc);
    project(u0, v0, u, v);

    advect(1, u, u0, u0, v0);
    advect(2, v, v0, u0, v0);
    project(u, v, u0, v0);
}

class FluidSolver {
    constructor(resolution, time, iter, viscosity, diffusion){
      N = resolution || 128;
      systemSize = (N + 2) * (N + 2);
      dt = time || 0.08;
      iterations = iter || 10;
      this.viscosity = viscosity || 0.5;
      this.diffusion = diffusion || 0.3;


      this.u = new Array(systemSize).fill(0);
      this.v = new Array(systemSize).fill(0);
      this.d = new Array(systemSize).fill(0);

      this.u0 = new Array(systemSize).fill(0);
      this.v0 = new Array(systemSize).fill(0);
      this.d0 = new Array(systemSize).fill(0);
    }

    width(){
      return N;
    }

    height(){
      return N;
    }

    getDensity(x, y){
      return this.d[IX(x, y)];
    }

    setDensity(x, y, d){
      this.d[IX(x, y)] = d;
    }

    update(){
        for(let i = 0; i < systemSize; i++)
          this.u0[i] = this.v0[i] = this.d0[i] = 0.0;

        this.ui(new FluidBox(this.d0, this.u0, this.v0));
        velocityStep(this.u, this.v, this.u0, this.v0, this.viscosity);
        densityStep(this.d, this.d0, this.u, this.v, this.diffusion);
    }

    setUI(callback) {
        this.ui = callback;
    }
}

export default FluidSolver;
