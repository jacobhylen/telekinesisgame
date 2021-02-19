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
    background: 'background.png' 
  },
});

// The static boxes
var boxA = Bodies.rectangle(window.innerWidth / 2 - 200, window.innerHeight / 2, 80, 80, {isStatic: true, render: {
  fillStyle: 'black',
  strokeStyle: '#ff6f3c',
  lineWidth: 8
}});
var boxB = Bodies.rectangle(window.innerWidth / 2 + 200, window.innerHeight / 2, 80, 80, {isStatic: true, render: {
  fillStyle: 'black',
  strokeStyle: '#005691',
  lineWidth: 8
}});

// create two boxes and a ground
var boxC = Bodies.rectangle(1200, 50, 80, 80, { render: {
  // orange
  fillStyle: '#ff6f3c',
}});
var boxD = Bodies.rectangle(200, 50, 80, 80, { render: {
  //blue
  fillStyle: '#005691',
}});
var boxE = Bodies.rectangle(1200, 50, 80, 80, { render: {
  // orange
  fillStyle: '#ff6f3c',
}});
var boxF = Bodies.rectangle(200, 50, 80, 80, { render: {
  //blue
  fillStyle: '#005691',
}});
var boxG = Bodies.rectangle(1200, 50, 80, 80, { render: {
  // orange
  fillStyle: '#ff6f3c',
}});
var boxH = Bodies.rectangle(200, 50, 80, 80, { render: {
  // blue
  fillStyle: '#005691',
}});


boxC.mass = 500;
boxD.mass = 500;
boxE.mass = 500;
boxF.mass = 500;
boxG.mass = 500;
boxH.mass = 500;

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



// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, boxC, boxD, boxE, boxF, boxG, boxH, ground, ground2, wall1, wall2]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

setInterval(function () {
  let collisionAC = Matter.SAT.collides(boxA, boxC);
  let collisionAE = Matter.SAT.collides(boxA, boxE);
  let collisionAG = Matter.SAT.collides(boxA, boxG);

  let collisionBD = Matter.SAT.collides(boxB, boxD);
  let collisionBF = Matter.SAT.collides(boxB, boxF);
  let collisionBH = Matter.SAT.collides(boxB, boxH);

  if (collisionAC.collided) {
    boxC.position.x = 2000;
  }
  if (collisionAE.collided) {
    boxE.position.x = 2000;
  }
  if (collisionAG.collided) {
    boxG.position.x = 2000;
  }


  if (collisionBD.collided) {
    boxD.position.x = 2000;
  }
  if (collisionBF.collided) {
    boxF.position.x = 2000;
  }
  if (collisionBH.collided) {
    boxH.position.x = 2000;
  }
  
/*     if(eyeY > boxA.position.y){
      boxA.force.y = calculateGravityForce(boxA);
    }
    if(eyeY < boxA.position.y){
      boxA.force.y = -calculateGravityForce(boxA);
    }
    console.log(calculateGravityForce(boxA));
   */
  boxC.force.x = gravityX(boxC);
  boxC.force.y = gravityY(boxC);

  boxD.force.x = gravityX(boxD);
  boxD.force.y = gravityY(boxD);


  boxE.force.x = gravityX(boxE);
  boxE.force.y = gravityY(boxE);

  boxF.force.x = gravityX(boxF);
  boxF.force.y = gravityY(boxF);

  boxG.force.x = gravityX(boxG);
  boxG.force.y = gravityY(boxG);

  boxH.force.x = gravityX(boxH);
  boxH.force.y = gravityY(boxH);

  
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
