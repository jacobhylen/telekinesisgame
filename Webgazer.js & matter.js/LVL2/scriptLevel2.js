window.saveDataAcrossSessions = true;

let finishedPlaying = document.getElementById("finished");
let finishedButton = document.getElementById("nextButton");

let levelComplete = false;

let eyeX = 0;
let eyeY = 0;


let singularityMass = 1 * Math.pow(10, 12);
let singularityMassMagnet = 1 * Math.pow(10, 11);

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
    background: 'rgba(0, 0, 0, 0.4)',
  },
});

//var portalHeaven = Bodies.circle(window.innerWidth / 2 - 350 , window.innerHeight / 2 + 200, 50, {isStatic: true, render: { fillStyle: 'rgba(255,255,255, 0.5)'}}, 20);
var portalHell = Bodies.circle(window.innerWidth / 2 + 350, window.innerHeight / 2 - 200, 50, {isStatic: true, render: { fillStyle: 'rgba(226, 106, 106, 1)'}}, 20);

var boxA = Bodies.rectangle(window.innerWidth / 2 - 200, window.innerHeight / 2, 80, 80, {isStatic: false, render: {
  fillStyle: 'White',
}});

var boxB = Bodies.rectangle(window.innerWidth / 2 + 200, window.innerHeight / 2 + 100, 80, 80, {isStatic: false, render: {
  fillStyle: '#845ec2',
}});

//Teleported B-box from hell to heaven
var boxB2 = Bodies.rectangle(window.innerWidth / 2 - 350 , window.innerHeight / 2 + 200, 80, 80, {isStatic: false, render: {
  fillStyle: 'White',
}});

var boxC = Bodies.rectangle(window.innerWidth / 2 + 500, window.innerHeight / 2 + 100, 140, 100, {isStatic: false, render: {
  fillStyle: '#f9ed69',
}});

var boxC2 = Bodies.rectangle(window.innerWidth / 2 - 350, window.innerHeight / 2 + 200, 140, 100, {isStatic: false, render: {
  fillStyle: 'White',
}});

var boxD = Bodies.rectangle(window.innerWidth / 2 + 300, window.innerHeight / 2 + 100, 80, 160, {isStatic: false, render: {
  fillStyle: '#61b15a',
}});

var boxD2 = Bodies.rectangle(window.innerWidth / 2 - 350, window.innerHeight / 2 + 200, 80, 160, {isStatic: false, render: {
  fillStyle: 'White',
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
boxB2.mass = 500;
boxC.mass = 500;
boxC2.mass = 500;
boxD.mass = 500;
boxD2.mass = 500;

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, boxC, boxD, ground, ground2, wall1, wall2, middleWall, portalHell]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

let stateAB = true;
let stateB2C = false;
let stateC2D = false;

let collisionPortalB = false;
let collisionPortalC = false;
let collisionPortalD = false;

setInterval(function () {

  let collisionHellB = Matter.SAT.collides(portalHell, boxB);
  let collisionHellC = Matter.SAT.collides(portalHell, boxC);
  let collisionHellD = Matter.SAT.collides(portalHell, boxD);

  if (collisionHellB.collided && stateAB) {
    //Matter.World.remove(engine.world, [boxB]); 
    boxB.position.x = 2000;

    Matter.World.add(engine.world, [boxB2]);   

    collisionPortalB = true;

    stateAB = false;
    stateB2C = true;
  
  } else if (stateAB) {
    boxA.force.x = gravityX(boxA);
    boxA.force.y = gravityY(boxA);

    boxB.force.x = gravityX(boxA) + gravityXmagnet(boxB, portalHell);
    boxB.force.y = gravityY(boxA) + gravityYmagnet(boxB, portalHell);
  }

  if (collisionHellC.collided && stateB2C) {
    //Matter.World.remove(engine.world, [boxC]);  
    boxC.position.x = 2000; 

    Matter.World.add(engine.world, [boxC2]); 

    collisionPortalC = true;

    stateB2C = false;
    stateC2D = true;
   
  } else if (stateB2C) {

    boxB2.force.x = gravityX(boxB2);
    boxB2.force.y = gravityY(boxB2);

    boxC.force.x = gravityX(boxB2) + gravityXmagnet(boxC, portalHell);
    boxC.force.y = gravityY(boxB2) + gravityYmagnet(boxC, portalHell);
  }

  if (collisionHellD.collided && stateC2D) {
    //Matter.World.remove(engine.world, [boxD]); 
    boxD.position.x = 2000; 
    
    Matter.World.add(engine.world, [boxD2]);  

    collisionPortalD = true;

    stateC2D = false;
  } else if(stateC2D){
    boxC2.force.x = gravityX(boxC2);
    boxC2.force.y = gravityY(boxC2);

    boxD.force.x = gravityX(boxC2) + gravityXmagnet(boxD, portalHell);
    boxD.force.y = gravityY(boxC2) + gravityYmagnet(boxD, portalHell);
  }
  
  if (collisionPortalB && collisionPortalC && collisionPortalD){
    levelComplete = true;
    finishedPlaying.style.visibility = "visible";
    finishedButton.style.visibility = "visible";
  } else {
    finishedPlaying.style.visibility = "hidden";
  }
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

function getDistanceToSingularityMagnets(object, magnet) {
  let distance = Math.sqrt(
    Math.pow(object.position.x - magnet.position.x, 2) +
      Math.pow(object.position.y - magnet.position.y, 2)
  );

  return distance;
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