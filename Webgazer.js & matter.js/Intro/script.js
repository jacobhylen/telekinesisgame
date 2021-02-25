window.saveDataAcrossSessions = true;

let eyeX = 0;
let eyeY = 0;

let calibrationCounter = 0;
let body = document.getElementById("body");
let calibrationMeter = document.getElementById("calibratingProgress");
let calibrationInstructions = document.getElementById("instructions");
let calibrationComplete = document.getElementById("complete");
let calibrationCompleteButton = document.getElementById("button");

let calibrationExamplesGoal = 25;
let calibration = 0;

let progressColor = calibration/calibrationExamplesGoal * 100;

//Counts clicks & alters the calibration progress bar
body.addEventListener("click", function(){
  calibrationCounter += 200 / calibrationExamplesGoal;
  calibration++;
  progressColor = calibration/calibrationExamplesGoal * 100;

  calibrationMeter.style.width= calibrationCounter +"px";
  calibrationMeter.style.background = "hsl(" + progressColor + ", 100%, 34%)"
})

//The mass of the singularity, used in calculation of the force. Written with scientific notation
let singularityMass = 1 * Math.pow(10, 12);


//webgazer stuff, sets up stuff for clearing calibrationdata
window.onload = async function () {
  localforage.clear();
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

//Clears calibrationdata if set to do that.
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

 // add mouse control
 var mouse = Mouse.create(render.canvas),
 mouseConstraint = MouseConstraint.create(engine, {
     mouse: mouse,
     constraint: {
         stiffness: 0.2,
         render: {
             visible: false
         }
     }
 });

World.add(world, mouseConstraint);

let ball = Matter.Bodies.circle(innerWidth / 2, innerHeight / 2,20, {isStatic: true, render: {
  fillStyle: '#8769F5',
  strokeStyle: '#8769F5',
  lineWidth: 8
}});

//Ground and walls

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



Events.on(mouseConstraint, 'mouseup', function(event) {
  

  var mousePosition = event.mouse.position;

  if (calibration == 1) {
    Matter.Body.setPosition(ball, { x: 720, y: 620});
  } else if (calibration == 2) {
    Matter.Body.setPosition(ball, { x: 98, y: 624});
  } else if (calibration == 3) {
    Matter.Body.setPosition(ball, { x: 370, y: 80});
  } else if (calibration == 4) {
    Matter.Body.setPosition(ball, { x: 727, y: 82});
  } else if (calibration == 5) {
    Matter.Body.setPosition(ball, { x: 1334, y: 90});
  } else if (calibration == 6) {
    Matter.Body.setPosition(ball, { x: 1330, y: 620});
  } else if (calibration == 7) {
    Matter.Body.setPosition(ball, { x: 1150, y: 355});
  } else if (calibration == 8) {
    Matter.Body.setPosition(ball, { x: 850, y: 330});
  } else if (calibration == 9) {
    Matter.Body.setPosition(ball, { x: 590, y: 360});
  } else if (calibration == 10) {
    Matter.Body.setPosition(ball, { x: 320, y: 380});
  } else if (calibration == 11) {
    Matter.Body.setPosition(ball, { x: 190, y: 422});
  } else if (calibration == 12) {
    Matter.Body.setPosition(ball, { x: 500, y: 190});
  } else if (calibration == 13) {
    Matter.Body.setPosition(ball, { x: 1046, y: 180});
  } else if (calibration == 14) {
    Matter.Body.setPosition(ball, { x: 1200, y: 490});
  } else if (calibration == 15) {
    Matter.Body.setPosition(ball, { x: 845, y: 325});
  } else if (calibration == 16) {
    Matter.Body.setPosition(ball, { x: 500, y: 205});
  } else if (calibration == 17) {
    Matter.Body.setPosition(ball, { x: 450, y: 460});
  } else if (calibration == 18) {
    Matter.Body.setPosition(ball, { x: 700, y: 380});
  } else if (calibration == 19) {
    Matter.Body.setPosition(ball, { x: 740, y: 130});
  } else if (calibration == 20) {
    Matter.Body.setPosition(ball, { x: 1174, y: 130});
  } else if (calibration == 21) {
    Matter.Body.setPosition(ball, { x: 1320, y: 530});
  } else if (calibration == 22) {
    Matter.Body.setPosition(ball, { x: 835, y: 620});
  } else if (calibration == 23) {
    Matter.Body.setPosition(ball, { x: 385, y: 590});
  } else if (calibration == 24) {
    Matter.Body.setPosition(ball, { x: 305, y: 360});
  } else if (calibration == 25) {
    Matter.Body.setPosition(ball, { x: 777, y: 777});
  }

  console.log(calibration);
  console.log('mouseup at ' + mousePosition.x + ' ' + mousePosition.y);
});

Events.on(engine, 'beforeUpdate', function(event) {
  // make bodyA move up and down
  // body is static so must manually update velocity for friction to work
  // var py = 300 + 100 * Math.sin(engine.timing.timestamp * 0.002);
  // Body.setVelocity(ball, { x: ball.position.x, y: py - ball.position.y });
  // Body.setPosition(ball, { x: ball.position.x, y: py });

  // if (calibration == 1) {
  //   Matter.Body.setVelocity(ball, { x: 300, y: 300});
  // } else if (calibration == 2) {
  //   Matter.Body.setPosition(ball, { x: 300, y: 200});
  // } else if (calibration == 3) {
  //   Matter.Body.setPosition(ball, { x: 100, y: 400});
  // } else if (calibration == 4) {
  //   Matter.Body.setPosition(ball, { x: 300, y: 500});
  // } else if (calibration == 5) {
  //   Matter.Body.setPosition(ball, { x: 600, y: 100});
  // } else if (calibration == 6) {
  //   Matter.Body.setPosition(ball, { x: 100, y: 600});
  // }
});



// add all of the bodies to the world
World.add(world, [ball, ground, ground2, wall1, wall2, mouseConstraint]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

setInterval(function () {
  if(calibration > 0){
    calibrationInstructions.style.visibility= "hidden";
  }

  if(calibration >=calibrationExamplesGoal){
    calibrationComplete.style.visibility = "visible";
    calibrationCompleteButton.style.visibility= "visible";
    Matter.Body.setPosition(ball, { x: 100, y: -100});
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
