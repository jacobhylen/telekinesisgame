window.saveDataAcrossSessions = false;

let eyeX = 0;
let eyeY = 0;

let singularityMass = 1 * Math.pow(10, 12);

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
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();
engine.world.gravity.y = 0.5;

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    height: window.innerHeight,
    width: window.innerWidth,
    wireframes: false,
  },
});

// create two boxes and a ground
// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80, { render: {
  fillStyle: 'red',
}});
var boxC = Bodies.rectangle(window.innerWidth / 2 - 200, window.innerHeight / 2, 80, 80, {isStatic: true});
var boxD = Bodies.rectangle(window.innerWidth / 2 + 200, window.innerHeight / 2, 80, 80, {isStatic: true}, { render: {
  fillStyle: 'red',
}});

// let collisionAC = Matter.SAT.collides(boxA, boxC).collided
// let collisionBC = Matter.SAT.collides(boxB, boxC).collided


// let collisionAC = Matter.Detector.canCollide(boxA, boxC);
let collisionBC = Matter.Detector.canCollide(boxB, boxC);
let previousCollision = false;

let collision = Matter.SAT.collides(boxA, boxC);


// console.log(collisionAC);
// console.log(collisionBC);

// if (collisionAC){

// }

// if (collisionBC){
  
// }

boxB.mass = 1000;
boxA.mass = 1000;

var ground = Bodies.rectangle(
  window.innerWidth / 2,
  700,
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



// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground, ground2, wall1, wall2, boxC, boxD]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

setInterval(function () {
  let collisionAC = Matter.SAT.collides(boxA, boxC);
  let collisionBD = Matter.SAT.collides(boxB, boxD);

  if (collisionAC.collided) {
    boxA.position.x = 2000;
  }
  if (collisionBD.collided) {
    boxB.position.x = 2000;
  }

  console.log(collision.collided);
  
/*     if(eyeY > boxA.position.y){
      boxA.force.y = calculateGravityForce(boxA);
    }
    if(eyeY < boxA.position.y){
      boxA.force.y = -calculateGravityForce(boxA);
    }
    console.log(calculateGravityForce(boxA));
   */
  boxA.force.x = gravityX(boxA);
  boxA.force.y = gravityY(boxA);

  boxB.force.x = gravityX(boxB);
  boxB.force.y = gravityY(boxB);
  
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
