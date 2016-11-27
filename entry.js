import FluidSimulator from './fluidSimulator.js';

document.addEventListener('DOMContentLoaded', function(){
  let width = 900;
  let height = 500;
  let resolution = 200;
  let density = 90;
  let simulator = new FluidSimulator(width, height, resolution, density);
});
