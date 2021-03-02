window.saveDataAcrossSessions = true;

let eyeX = 0;
let eyeY = 0;

let calibrationCounter = 0;
let body = document.getElementById("body");
let calibrationMeter = document.getElementById("calibratingProgress");

var start = Date.now();

let singularityMass = 1 * Math.pow(10, 12);

let boxAAttached = false;
let boxBAttached = false;
let boxCAttached = false;
let boxDAttached = false;
let boxFAttached = false;
let boxGAttached = false;
let boxHAttached = false;
let boxIAttached = false;


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
      true
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

setInterval(function(){
console.log(eyeY);
console.log(eyeX);
},10)

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
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint;

// create an engine
var engine = Engine.create();

engine.world.gravity.y = 0;

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
var boxA = Bodies.rectangle(1200, 700, 30, 30, { render: {
    // orange
    fillStyle: '#ff6f3c',
  }});
  boxA.mass = 100;

  var boxB = Bodies.rectangle(300, 300, 30, 30, { render: {
    // orange
    fillStyle: '#ff6f3c',
  }});
  boxB.mass = 100;

  var boxC = Bodies.rectangle(1400, 50, 30, 30, { render: {
    // orange
    fillStyle: '#ff6f3c',
  }});
  boxC.mass = 100;

  var boxD = Bodies.rectangle(1300, 500, 30, 30, { render: {
    // orange
    fillStyle: '#ff6f3c',
  }});
  boxD.mass = 100;

  var boxF = Bodies.rectangle(100, 900, 30, 30, { render: {
    // orange
    fillStyle: '#ff6f3c',
  }});
  boxF.mass = 100;

  var boxG = Bodies.rectangle(1600, 800, 30, 30, { render: {
    // orange
    fillStyle: '#ff6f3c',
  }});
  boxG.mass = 100;

  var boxH = Bodies.rectangle(1400, 300, 30, 30, { render: {
    // orange
    fillStyle: '#ff6f3c',
  }});
  boxH.mass = 100;

  var boxI = Bodies.rectangle(100, 50, 30, 30, { render: {
    // orange
    fillStyle: '#ff6f3c',
  }});
  boxI.mass = 100;

// create two boxes and a ground


var ground = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight,
  window.innerWidth,
  60,
  { isStatic: true }
);
var ground2 = Bodies.rectangle(
  window.innerWidth / 2,
  10,
  window.innerWidth,
  60,
  { isStatic: true }
);
var wall1 = Bodies.rectangle(
  0,
  window.innerHeight / 2,
  100,
  window.innerHeight,
  { isStatic: true }
);
var wall2 = Bodies.rectangle(
  window.innerWidth,
  window.innerHeight / 2,
  100,
  window.innerHeight,
  { isStatic: true }
);

var boxAConstraint = Constraint.create({
  bodyA: boxA,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxBConstraint = Constraint.create({
  bodyA: boxB,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxCConstraint = Constraint.create({
  bodyA: boxC,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxDConstraint = Constraint.create({
  bodyA: boxD,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxFConstraint = Constraint.create({
  bodyA: boxF,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxGConstraint = Constraint.create({
  bodyA: boxG,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxHConstraint = Constraint.create({
  bodyA: boxH,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxIConstraint = Constraint.create({
  bodyA: boxI,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;
boxAConstraint.render.visible = false
boxBConstraint.render.visible = false
boxCConstraint.render.visible = false
boxDConstraint.render.visible = false
boxFConstraint.render.visible = false
boxGConstraint.render.visible = false
boxHConstraint.render.visible = false
boxIConstraint.render.visible = false

// add all of the bodies to the world
World.add(engine.world, [ground, ground2, wall1, wall2, boxA, boxB, boxC, boxD, boxF, boxG, boxH, boxI, boxAConstraint, boxBConstraint, boxCConstraint, boxDConstraint, boxFConstraint, boxGConstraint, boxHConstraint, boxIConstraint]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

setInterval(function () {

    boxA.force.x = gravityX(boxA);
    boxA.force.y = gravityY(boxA);

    boxB.force.x = gravityX(boxB);
    boxB.force.y = gravityY(boxB);

    boxC.force.x = gravityX(boxC);
    boxC.force.y = gravityY(boxC);

    boxD.force.x = gravityX(boxD);
    boxD.force.y = gravityY(boxD);

    boxF.force.x = gravityX(boxF);
    boxF.force.y = gravityY(boxF);

    boxG.force.x = gravityX(boxG);
    boxG.force.y = gravityY(boxG);

    boxH.force.x = gravityX(boxH);
    boxH.force.y = gravityY(boxH);

    boxI.force.x = gravityX(boxI);
    boxI.force.y = gravityY(boxI);

    if(getDistanceToSingularity(boxA) < 50 && boxAAttached == false){
      boxAConstraint.stiffness = 0.005;
      boxAAttached = true;
    }
    if(getDistanceToSingularity(boxB) < 50 && boxBAttached == false){
      boxBConstraint.stiffness = 0.005;
      boxBAttached = true;
    }
    if(getDistanceToSingularity(boxC) < 50 && boxCAttached == false){
      boxCConstraint.stiffness = 0.005;
      boxCAttached = true;
    }
    if(getDistanceToSingularity(boxD) < 50 && boxDAttached == false){
      boxDConstraint.stiffness = 0.005;
      boxDAttached = true;
    }
    if(getDistanceToSingularity(boxF) < 50 && boxFAttached == false){
      boxFConstraint.stiffness = 0.005;
      boxFAttached = true;
    }
    if(getDistanceToSingularity(boxG) < 50 && boxGAttached == false){
      boxGConstraint.stiffness = 0.005;
      boxGAttached = true;
    }
    if(getDistanceToSingularity(boxH) < 50 && boxHAttached == false){
      boxHConstraint.stiffness = 0.005;
      boxHAttached = true;
    }
    if(getDistanceToSingularity(boxI) < 50 && boxIAttached == false){
      boxIConstraint.stiffness = 0.005;
      boxIAttached = true;
    }
      boxAConstraint.pointB =  { x: eyeX, y: eyeY };
      boxBConstraint.pointB =  { x: eyeX, y: eyeY };
      boxCConstraint.pointB =  { x: eyeX, y: eyeY };
      boxDConstraint.pointB =  { x: eyeX, y: eyeY };
      boxFConstraint.pointB =  { x: eyeX, y: eyeY };
      boxGConstraint.pointB =  { x: eyeX, y: eyeY };
      boxHConstraint.pointB =  { x: eyeX, y: eyeY };
      boxIConstraint.pointB =  { x: eyeX, y: eyeY };
    
}, 1);

function getDistanceToSingularity(object) {
  let distance = Math.sqrt(
    Math.pow(object.position.x - eyeX, 2) +
      Math.pow(object.position.y - eyeY, 2)
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