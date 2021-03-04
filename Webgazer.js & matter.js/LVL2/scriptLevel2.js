window.saveDataAcrossSessions = true;

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
    background: 'rgba(255, 217, 0, 0)',
  },
});

//var portalHeaven = Bodies.circle(window.innerWidth / 2 - 350 , window.innerHeight / 2 - 200, 40, {isStatic: true, render: { fillStyle: 'White'}}, 20);
var portalHell = Bodies.circle(window.innerWidth / 2 + 350, window.innerHeight / 2 - 200, 40, {isStatic: true, render: { fillStyle: 'Pink'}}, 20);

var boxA = Bodies.rectangle(window.innerWidth / 2 - 200, window.innerHeight / 2, 80, 80, {isStatic: false, render: {
  fillStyle: 'White',
}});

var boxB = Bodies.rectangle(window.innerWidth / 2 + 200, window.innerHeight / 2, 80, 80, {isStatic: false, render: {
  fillStyle: 'Yellow',
}});

//Teleported B-box from hell to heaven
var boxB2 = Bodies.rectangle(window.innerWidth / 2 - 200, window.innerHeight / 2, 80, 80, {isStatic: false, render: {
  fillStyle: 'Red',
}});

var boxC = Bodies.rectangle(window.innerWidth / 2 + 250, window.innerHeight / 2, 140, 100, {isStatic: false, render: {
  fillStyle: 'Green',
}});

var boxC2 = Bodies.rectangle(window.innerWidth / 2 - 250, window.innerHeight / 2, 140, 100, {isStatic: false, render: {
  fillStyle: 'Green',
}});

var boxD = Bodies.rectangle(window.innerWidth / 2 + 300, window.innerHeight / 2, 80, 160, {isStatic: false, render: {
  fillStyle: 'Blue',
}});

var boxD2 = Bodies.rectangle(window.innerWidth / 2 - 300, window.innerHeight / 2, 80, 160, {isStatic: false, render: {
  fillStyle: 'Blue',
}});

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
var middleWall = Bodies.rectangle(
  window.innerWidth / 2,
  window.innerHeight / 2,
  50,
  window.innerHeight,
  { isStatic: true }
);

boxA.mass = 500;
boxB.mass = 500;

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, boxC, boxD, ground, ground2, wall1, wall2, middleWall, portalHell]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

let collisionHellB = false;

setInterval(function () {
  boxA.force.x = gravityX(boxA);
  boxA.force.y = gravityY(boxA);

  boxB.force.x = gravityX(boxA);
  boxB.force.y = gravityY(boxA);

  let collisionHellB = Matter.SAT.collides(portalHell, boxB);

  if (collisionHellB.collided) {
    boxB.position.x = 2000;
    //boxC.isStatic = true;
    //boxA.render.fillStyle = '#ff6f3c';
    collisionHellB = true;
  }

  // if (collisionACcheck) {
  //   levelComplete = true;
  //   finishedPlaying.style.visibility = "visible";
  //   finishedButton.style.visibility = "visible";
  // } else {
  //   finishedPlaying.style.visibility = "hidden";
  // }
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