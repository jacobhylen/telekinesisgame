let calibrationCounter = 0;
let body = document.getElementById("body");
let calibrationMeter = document.getElementById("calibratingProgress");
let calibrationInstructions = document.getElementById("instructions");
let calibrationComplete = document.getElementById("complete");
let calibrationCompleteButton = document.getElementById("button");

var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Events = Matter.Events;

// create an engine
var engine = Engine.create();
world = engine.world;
engine.world.gravity.y = 0;
engine.world.gravity.x = 0;

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    height: window.innerHeight,
    width: window.innerWidth,
    wireframes: false,
    background: 'background.png' 
  },
});

// add all of the bodies to the world
//World.add(world, []);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);