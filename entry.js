import FluidSimulator from './fluidSimulator.js';

document.addEventListener('DOMContentLoaded', function(){
  let width = document.getElementById('fluidSimulator').offsetWidth;
  let height = document.getElementById('fluidSimulator').offsetHeight;
  let resolution = parseInt(document.getElementById('resolution').value);
  let density = parseInt(document.getElementById('density').value);
  let iterations = parseInt(document.getElementById('iterations').value);
  let viscosity = parseFloat(document.getElementById('viscosity').value);
  let diffusion = parseFloat(document.getElementById('diffusion').value);
  let simulator = new FluidSimulator(width, height, resolution, density, diffusion, viscosity, iterations);
});
