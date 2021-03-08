window.saveDataAcrossSessions = true;

let eyeX = 0;
let eyeY = 0;

let calibrationCounter = 0;
let body = document.getElementById("body");
let calibrationMeter = document.getElementById("calibratingProgress");
let slot = 0;
var start = Date.now();

body.addEventListener("click", function () {
  calibrationCounter += 3;


  
})

let singularityMass = 1 * Math.pow(10, 11);

let singularityMassMagnet = 1 * Math.pow(10, 12
  );
window.onload = async function () {
  if (!window.saveDataAcrossSessions) {
    var localstorageDataLabel = "webgazerGlobalData";
    localforage.setItem(localstorageDataLabel, null);
    var localstorageSettingsLabel = "webgazerGlobalSettings";
    localforage.setItem(localstorageSettingsLabel, null);
  }
  const webgazerInstance = await webgazer
    .setRegression("ridge") /* currently must set regression and tracker */
    .setTracker("TFFacemesh")
    .begin();
  webgazerInstance
    .showVideoPreview(true) /* shows all video previews */
    .showPredictionPoints(
      false
    ) /* shows a square every 100 milliseconds where current prediction is */
    .applyKalmanFilter(true); // Kalman Filter defaults to on.
  webgazer.setGazeListener(collisionEyeListener);
};

window.onbeforeunload = function () {
  if (window.saveDataAcrossSessions) {
    webgazer.end();
  } else {
    localforage.clear();
  }
};

var webgazerCanvas = null;

var previewWidth = webgazer.params.videoViewerWidth;

var collisionEyeListener = async function (data, clock) {
  if (!data) return;

  if (!webgazerCanvas) {
    webgazerCanvas = webgazer.getVideoElementCanvas();
  }

  await webgazer
    .getTracker()
    .getEyePatches(webgazerCanvas, webgazerCanvas.width, webgazerCanvas.height);

  eyeX = data.x;
  eyeY = data.y;
};

var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Bodies = Matter.Bodies,
  Query = Matter.Query,
  Runner = Matter.Runner,
  Composite = Matter.Composite,
  Composites = Matter.Composites,
  Events = Matter.Events,
  Vertices = Matter.Vertices;

// create an engine
var engine = Engine.create();

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

// The static boxes
var boxA = Bodies.rectangle(1200, 200, 100, 100, {
  chamfer: {
    // orange
    radius: [90, 0, 0, 0]
  },
  fillStyle: '#ff6f3c',
});

Events.on(render, 'afterRender', function() {
      context = render.context,
      bodies = Composite.allBodies(engine.world),
      startPoint = { x: window.innerWidth/2, y: window.innerHeight/2 },
      endPoint = { x: eyeX, y: eyeY};

  var collisions = Query.ray(bodies, startPoint, endPoint);

  Render.startViewTransform(render);

  context.beginPath();
  context.moveTo(startPoint.x, startPoint.y);
  context.lineTo(endPoint.x, endPoint.y);
  if (collisions.length > 0) {
      context.strokeStyle = 'black';
     // console.log(collisions[0]);
     /*if(slot == 0 && !collisions[0].bodyA.isStatic) {
      slot = collisions[0].bodyA;}*/
     
     
  } else {
      context.strokeStyle = '#555';
  }
  context.lineWidth = 0.5;
  context.stroke();


  for (var i = 0; i < collisions.length; i++) {
    var collision = collisions[i];
    context.rect(collision.bodyA.position.x - 4.5, collision.bodyA.position.y - 4.5, 8, 8);

}

context.fillStyle = 'rgba(255,165,0,0.7)';
context.fill();

Render.endViewTransform(render);
});


// keep the mouse in sync with rendering


// create two stacks of objects
let stack = Matter.Composites.stack(500, 300, 2, 4, 0, 0, function (x, y) {
  let sides = Math.round(Matter.Common.random(3, 7));
  return Matter.Bodies.polygon(x, y, sides, 40, {
    render: {
      //orange
      fillStyle: '#E36744'
    }
  });
});







var ground = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight,
  window.innerWidth,
  60, {
    isStatic: true
  }
);
var ground2 = Bodies.rectangle(
  window.innerWidth / 2,
  10,
  window.innerWidth,
  60, {
    isStatic: true
  }
);
var wall1 = Bodies.rectangle(
  0,
  window.innerHeight / 2,
  100,
  window.innerHeight, {
    isStatic: true
  }
);
var wall2 = Bodies.rectangle(
  window.innerWidth,
  window.innerHeight / 2,
  100,
  window.innerHeight, {
    isStatic: true
  }
);

var cabinetdoor1 = Bodies.rectangle(
  window.innerWidth/3,
  150,
  window.innerWidth/3,
  50, {
    isStatic: true
  }
);
var cabinetdoor2 = Bodies.rectangle(
  window.innerWidth - window.innerWidth/3,
  150,
  window.innerWidth/3,
  50, {
    isStatic: true
  }
);

//make the first stack attract towards the right shelf


// add all of the bodies to the world
World.add(engine.world, [ground, ground2,
  wall1, wall2, stack,
  cabinetdoor1, cabinetdoor2
  
 
  
]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

setInterval(function () {

  for (let i=0; i < stack.bodies.length; i++){
    stack.bodies[i].force.x = -gravityX(stack.bodies[i]);
    stack.bodies[i].force.y = -gravityY(stack.bodies[i]);
    
  }

  //followSlot(slot);
}, 1);

let thing = 0
/*setInterval(function(){
  if(thing < 10){
  thing++;
  Matter.Body.scale(cabinetdoor1, 0.9, 1, {x: 600, y: 0})
  Matter.Body.scale(cabinetdoor2, 0.9, 1, {x: 900, y: 0})}}, 0);*/



setInterval(function () {
  timePassed = Date.now() - start;

  if (timePassed > 5000) {
    engine.world.gravity.y = engine.world.gravity.y * -1;
    start = Date.now()
    timePassed = 0;
  }
}, 10);



function getDistanceToSingularity(object) {
  let distance = Math.sqrt(
    Math.pow(object.position.x - eyeX, 2) +
    Math.pow(object.position.y - eyeY, 2)
  );

  return distance;
}

function getDistanceToSingularityMagnets(object, magnet) {
  let distance = Math.sqrt(
    Math.pow(object.position.x - magnet.position.x, 2) +
      Math.pow(object.position.y - magnet.position.y -20, 2)
  );

  return distance;
}

function calculateGravityForce(object) {
  let Fg =
    6.673 *
    Math.pow(10, -11) *
    ((singularityMass * object.mass) /
      Math.pow(getDistanceToSingularity(object), 2));

  if (Fg > 1) {
    Fg = 1;
  }

  return Fg;
}
function gravityXmagnet(object, magnet) {
  let percentage =
    (magnet.position.x - object.position.x) / getDistanceToSingularityMagnets(object, magnet);
  let gravityForce = calculateGravityForceMagnets(object, magnet);

  let gravityX = gravityForce * percentage;

  return gravityX;
}

function gravityYmagnet(object, magnet) {
  let percentage =
    (magnet.position.y - object.position.y) / getDistanceToSingularityMagnets(object, magnet);
  let gravityForce = calculateGravityForceMagnets(object, magnet);

  let gravityY = gravityForce * percentage;

  return gravityY;
}
function calculateGravityForceMagnets(object, magnet) {
  let FgM =
    6.673 *
    Math.pow(10, -11) *
    ((singularityMassMagnet * object.mass) /
      Math.pow(getDistanceToSingularityMagnets(object, magnet), 2));

  if (FgM > 1) {
    FgM = 1;
  }

  return FgM;
}

function gravityX(object) {
  let percentage =
    (eyeX - object.position.x) / getDistanceToSingularity(object);
  let gravityForce = calculateGravityForce(object);

  let gravityX = gravityForce * percentage;

  return gravityX;
}

function gravityY(object) {
  let percentage =
    (eyeY - object.position.y) / getDistanceToSingularity(object);
  let gravityForce = calculateGravityForce(object);

  let gravityY = gravityForce * percentage;

  return gravityY;
}

function followSlot(object){
if(slot !=0){

    object.mass = 1;
    if(object.position.x < eyeX){
      object.force.x = 0.1;
    } else {
      object.force.x = -0.1;
    }

    if(object.position.y < eyeY){
      object.force.y = 0.1;
    } else {
      object.force.y = -0.1;
    }
}
  
}