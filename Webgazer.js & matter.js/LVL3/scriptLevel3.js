window.saveDataAcrossSessions = true;

let eyeX = 0;
let eyeY = 0;

let calibrationCounter = 0;
let body = document.getElementById("body");
let calibrationMeter = document.getElementById("calibratingProgress");

var start = Date.now();

body.addEventListener("click", function () {
  calibrationCounter += 3;


  calibrationMeter.style.width = calibrationCounter + "px";
})

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
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
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



// keep the mouse in sync with rendering
render.mouse = mouse;

// create two stacks of objects
let stack = Matter.Composites.stack(500, 300, 2, 4, 0, 0, function (x, y) {
  let sides = Math.round(Matter.Common.random(3, 7));
  return Matter.Bodies.polygon(x, y, sides, 40, {
    render: {
      fillStyle: '#E36744'
    }
  });
});

let stack2 = Matter.Composites.stack(500, 300, 2, 4, 0, 0, function (x, y) {
  let sides2 = Math.round(Matter.Common.random(3, 7));
  return Matter.Bodies.polygon(x, y, sides2, 40, {
    render: {
      fillStyle: '#B0EB6E'
    }
  });
});

let stack3 = Matter.Composites.stack(500, 300, 2, 4, 0, 0, function (x, y) {
  let sides3 = Math.round(Matter.Common.random(3, 7));
  return Matter.Bodies.polygon(x, y, sides3, 40, {
    render: {
      fillStyle: '#F9D857'
    }
  });
});


var lowerLeftShelf = Bodies.rectangle(200, 400, 300, 20, {
  isStatic: true,
  render: {
    fillStyle: '#B0EB6E',
  }
});

var lowerLeftShelf1 = Bodies.rectangle(200, 500, 300, 20, {
  isStatic: true,
  render: {
    fillStyle: '#B0EB6E',
  }
});


var upperLeftShelf = Bodies.rectangle(200, 150, 300, 20, {
  isStatic: true,
  render: {
    fillStyle: '#F9D857',
  }
});

var upperLeftShelf1 = Bodies.rectangle(200, 250, 300, 20, {
  isStatic: true,
  render: {
    fillStyle: '#F9D857',
  }
});


var rightShelf1 = Bodies.rectangle(1290, 400, 300, 20, {
  isStatic: true,
  render: {
    fillStyle: '#E36744',
  }
});

var rightShelf2 = Bodies.rectangle(1290, 500, 300, 20, {
  isStatic: true,
  render: {
    fillStyle: '#E36744',
  }
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



// add all of the bodies to the world
World.add(engine.world, [ground, ground2,
  wall1, wall2, stack, lowerLeftShelf, lowerLeftShelf1,
  rightShelf1, rightShelf2, stack2, mouseConstraint,
  stack3,
  upperLeftShelf,
  upperLeftShelf1
]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

setInterval(function () {

  boxA.force.x = gravityX(boxA);
  boxA.force.y = gravityY(boxA);
}, 1);

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