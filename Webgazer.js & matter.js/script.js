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
      false
    ) /* shows a square every 100 milliseconds where current prediction is */
    .applyKalmanFilter(true); // Kalman Filter defaults to on.
  // Add the SVG component on the top of everything.
  executeGame();
  webgazer.setGazeListener(collisionEyeListener);
};

window.onbeforeunload = function () {
  if (window.saveDataAcrossSessions) {
    webgazer.end();
  } else {
    localforage.clear();
  }
};

function executeGame() {}

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
  var fmPositions = await webgazer.getTracker().getPositions();

  var whr = webgazer.getVideoPreviewToCameraResolutionRatio();

  var line = d3
    .select("#eyeline1")
    .attr("x1", data.x)
    .attr("y1", data.y)
    .attr("x2", previewWidth - fmPositions[145][0] * whr[0])
    .attr("y2", fmPositions[145][1] * whr[1]);

  var line = d3
    .select("#eyeline2")
    .attr("x1", data.x)
    .attr("y1", data.y)
    .attr("x2", previewWidth - fmPositions[374][0] * whr[0])
    .attr("y2", fmPositions[374][1] * whr[1]);

  var dot = d3.select("#predictionSquare").attr("x", data.x).attr("y", data.y);

  eyeX = data.x;
  eyeY = data.y;

  //  console.log("x = "+ eyeX +", y = "+eyeY);
};

var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    height: window.innerHeight,
    width: window.innerWidth,
  },
});

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80);
boxA.mass = 3;
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(
  window.innerWidth / 2,
  900,
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

var circle = Bodies.circle(
    100,
    100,
    30
)

// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground, ground2, wall1, wall2, circle]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

setInterval(function () {
    circle.position.x = eyeX;
    circle.position.y = eyeY;

    if (getDistanceToSingularity(boxA) > 5){
        boxA.force.x = calculateGravityX(boxA);
      }
 
  if (getDistanceToSingularity(boxA) > 5){
        boxA.force.y = calculateGravityY(boxA);
  }

  console.log(calculateGravityY(boxA));

  /*   if(boxA.position.y - eyeY > 500){
    boxA.force.y = -0.05 ;
  }
  console.log(calculateGravityForce(boxA)); */
}, 100);

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

  return Fg;
}

function calculateGravityY(object) {
  let Fg = calculateGravityForce(object);
  let hypotenuse = getDistanceToSingularity(object);

  let sinV = (eyeY - object.position.y) / hypotenuse;
  let forceY = Fg / sinV;

  return forceY;
}

function calculateGravityX(object) {
  let forceY = calculateGravityY(object);
  let ratio = (eyeY - object.position.y) / (eyeX - object.position.x);

  let forceX = ratio * forceY;

  return forceX;
}
