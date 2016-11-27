import FluidSimulator from './fluidSimulator.js';

document.addEventListener('DOMContentLoaded', function(){
  let width = document.getElementById('fluidSimulator').offsetWidth;
  let height = document.getElementById('fluidSimulator').offsetHeight;
  let resolution = 200;
  let density = 90;
  let simulator = new FluidSimulator(width, height, resolution, density);
});
