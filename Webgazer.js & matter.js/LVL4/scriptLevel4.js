window.saveDataAcrossSessions = true;

let eyeX = 0;
let eyeY = 0;

let calibrationCounter = 0;
let body = document.getElementById("body");
let calibrationMeter = document.getElementById("calibratingProgress");

var start = Date.now();

let singularityMass = 1 * Math.pow(10, 10);

let boxAAttached = false;
let boxBAttached = false;
let boxCAttached = false;
let boxDAttached = false;
let boxEAttached = false;
let boxFAttached = false;
let boxGAttached = false;
let boxHAttached = false;
let boxIAttached = false;
let boxJAttached = false;
let boxKAttached = false;
let boxLAttached = false;
let boxMAttached = false;
let boxNAttached = false;


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


let cloud1 = Bodies.circle(600, 100, 100,{
  collisionFilter: {
      group:-1,
      category:2,
      mask:0
  },
  render: {
      fillStyle: "hsla(294, 28%, 50%, 0.68)"
  }
})
let cloud2 = Bodies.circle(500, 200, 100,{
  collisionFilter: {
      group:-1,
      category:2,
      mask:0
  },
  render: {
      fillStyle: "hsla(294, 28%, 50%, 0.68)"
  }
})
let cloud3 = Bodies.circle(300, 300, 100,{
  collisionFilter: {
      group:-1,
      category:2,
      mask:0
  },
  render: {
      fillStyle: "hsla(294, 28%, 50%, 0.68)"
  }
})

var cloud1Constraint = Constraint.create({
  bodyA: cloud1,
  pointB: { x: 500, y: 500 },
  stiffness: 0.4,
  length:10,
  collisionFilter: {
    group:-1,
    category:2,
    mask:2
}
});;
var cloud2Constraint = Constraint.create({
  bodyA: cloud2,
  pointB: { x: 500, y: 500 },
  stiffness: 0.05,
  length:30,
  collisionFilter: {
    group:-1,
    category:2,
    mask:2
}
});;
var cloud3Constraint = Constraint.create({
  bodyA: cloud3,
  pointB: { x: 500, y: 500 },
  stiffness: 0.03,
  length:50,
  collisionFilter: {
    group:-1,
    category:2,
    mask:2
}
});;


var boxA = Bodies.rectangle(1200, 700, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candyBad.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxA.mass = 100;

  var boxB = Bodies.rectangle(300, 300, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy1.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxB.mass = 100;

  var boxC = Bodies.rectangle(1400, 50, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy2.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxC.mass = 100;

  var boxD = Bodies.rectangle(1300, 500, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy1.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxD.mass = 100;

  var boxE = Bodies.rectangle(1000, 300, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy2.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxE.mass = 100;

  var boxF = Bodies.rectangle(500, 900, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy2.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxF.mass = 100;

  var boxG = Bodies.rectangle(1600, 800, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy1.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxG.mass = 100;

  var boxH = Bodies.rectangle(1400, 300, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy2.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxH.mass = 100;

  var boxI = Bodies.rectangle(100, 50, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy1.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxI.mass = 100;

  var boxJ = Bodies.rectangle(1700, 400, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy2.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxJ.mass = 100;

  var boxK = Bodies.rectangle(100, 900, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy1.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxK.mass = 100;

  var boxL = Bodies.rectangle(200, 800, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy2.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxL.mass = 100;

  var boxM = Bodies.rectangle(1500, 100, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy1.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxM.mass = 100;

  var boxN = Bodies.rectangle(300, 600, 30, 30, { render: {
    // orange
    sprite: {
      texture: 'candy2.png',
      xScale: 0.5,
      yScale: 0.5
    },
    
  }});
  boxN.mass = 100;

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

var boxEConstraint = Constraint.create({
  bodyA: boxE,
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

var boxJConstraint = Constraint.create({
  bodyA: boxJ,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxKConstraint = Constraint.create({
  bodyA: boxK,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxLConstraint = Constraint.create({
  bodyA: boxL,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxMConstraint = Constraint.create({
  bodyA: boxM,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;

var boxNConstraint = Constraint.create({
  bodyA: boxN,
  pointB: { x: 500, y: 500 },
  stiffness: 0.000001,
  length:100
});;
boxAConstraint.render.visible = false
boxBConstraint.render.visible = false
boxCConstraint.render.visible = false
boxDConstraint.render.visible = false
boxEConstraint.render.visible = false
boxFConstraint.render.visible = false
boxGConstraint.render.visible = false
boxHConstraint.render.visible = false
boxIConstraint.render.visible = false
boxJConstraint.render.visible = false
boxKConstraint.render.visible = false
boxLConstraint.render.visible = false
boxMConstraint.render.visible = false
boxNConstraint.render.visible = false

cloud1Constraint.render.visible = false;
cloud2Constraint.render.visible = false;
cloud3Constraint.render.visible = false;

// add all of the bodies to the world
World.add(engine.world, [ground, ground2, wall1, wall2, boxA, boxB, boxC, boxD, boxE, boxF, boxG, boxH, boxI, boxJ, boxK, boxL, boxM, boxN, boxAConstraint, boxBConstraint, boxCConstraint, boxDConstraint, boxEConstraint, boxFConstraint, boxGConstraint, boxHConstraint, boxIConstraint, boxJConstraint, boxKConstraint, boxLConstraint, boxMConstraint, boxNConstraint, cloud1, cloud2, cloud3, cloud1Constraint, cloud2Constraint, cloud3Constraint]);

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
      boxAAttached = true;
    }
    if(getDistanceToSingularity(boxB) < 50 && boxBAttached == false){
      boxBAttached = true;
    }
    if(getDistanceToSingularity(boxC) < 50 && boxCAttached == false){
      boxCAttached = true;
    }
    if(getDistanceToSingularity(boxD) < 50 && boxDAttached == false){
      boxDAttached = true;
    }
    if(getDistanceToSingularity(boxE) < 50 && boxEAttached == false){
      boxEAttached = true;
    }
    if(getDistanceToSingularity(boxF) < 50 && boxFAttached == false){
      boxFAttached = true;
    }
    if(getDistanceToSingularity(boxG) < 50 && boxGAttached == false){
      boxGAttached = true;
    }
    if(getDistanceToSingularity(boxH) < 50 && boxHAttached == false){
      boxHAttached = true;
    }
    if(getDistanceToSingularity(boxI) < 50 && boxIAttached == false){
      boxIAttached = true;
    }
    if(getDistanceToSingularity(boxJ) < 50 && boxJAttached == false){
      boxJAttached = true;
    }
    if(getDistanceToSingularity(boxK) < 50 && boxKAttached == false){
      boxKAttached = true;
    }
    if(getDistanceToSingularity(boxL) < 50 && boxLAttached == false){
      boxLAttached = true;
    }
    if(getDistanceToSingularity(boxM) < 50 && boxMAttached == false){
      boxMAttached = true;
    }
    if(getDistanceToSingularity(boxN) < 50 && boxNAttached == false){
      boxNAttached = true;
    }

    if(boxAAttached){
      boxAAttached = false;
      boxBAttached = false;
      boxCAttached = false;
      boxDAttached = false;
      boxEAttached = false;
      boxFAttached = false;
      boxGAttached = false;
      boxHAttached = false;
      boxIAttached = false;
      boxJAttached = false;
      boxKAttached = false;
      boxLAttached = false;
      boxMAttached = false;
      boxNAttached = false;
    } 

    if(boxBAttached){
      boxBConstraint.stiffness = 0.005;
    }else {
      boxBConstraint.stiffness = 0.000001;
    }

    if(boxCAttached){
      boxCConstraint.stiffness = 0.005;
    } else {
      boxCConstraint.stiffness = 0.000001;
    }

    if(boxDAttached){
      boxDConstraint.stiffness = 0.005;
    } else {
      boxDConstraint.stiffness = 0.000001;
    }

    if(boxEAttached){
      boxEConstraint.stiffness = 0.005;
    }else {
      boxEConstraint.stiffness = 0.000001;
    }

    if(boxFAttached){
      boxFConstraint.stiffness = 0.005;
    }else {
      boxFConstraint.stiffness = 0.000001;
    }

    if(boxGAttached){
      boxGConstraint.stiffness = 0.005;
    }else {
      boxGConstraint.stiffness = 0.000001;
    }

    if(boxHAttached){
      boxHConstraint.stiffness = 0.005;
    }else {
      boxHConstraint.stiffness = 0.000001;
    }

    if(boxIAttached){
      boxIConstraint.stiffness = 0.005;
    }else {
      boxIConstraint.stiffness = 0.000001;
    }

    if(boxJAttached){
      boxJConstraint.stiffness = 0.005;
    }else {
      boxJConstraint.stiffness = 0.000001;
    }

    if(boxKAttached){
      boxKConstraint.stiffness = 0.005;
    }else {
      boxKConstraint.stiffness = 0.000001;
    }

    if(boxLAttached){
      boxLConstraint.stiffness = 0.005;
    }else {
      boxLConstraint.stiffness = 0.000001;
    }

    if(boxMAttached){
      boxMConstraint.stiffness = 0.005;
    }else {
      boxMConstraint.stiffness = 0.000001;
    }

    if(boxNAttached){
      boxNConstraint.stiffness = 0.005;
    }else {
      boxNConstraint.stiffness = 0.000001;
    }

      boxAConstraint.pointB =  { x: eyeX, y: eyeY };
      boxBConstraint.pointB =  { x: eyeX, y: eyeY };
      boxCConstraint.pointB =  { x: eyeX, y: eyeY };
      boxDConstraint.pointB =  { x: eyeX, y: eyeY };
      boxEConstraint.pointB =  { x: eyeX, y: eyeY };
      boxFConstraint.pointB =  { x: eyeX, y: eyeY };
      boxGConstraint.pointB =  { x: eyeX, y: eyeY };
      boxHConstraint.pointB =  { x: eyeX, y: eyeY };
      boxIConstraint.pointB =  { x: eyeX, y: eyeY };
      boxJConstraint.pointB =  { x: eyeX, y: eyeY };
      boxKConstraint.pointB =  { x: eyeX, y: eyeY };
      boxLConstraint.pointB =  { x: eyeX, y: eyeY };
      boxMConstraint.pointB =  { x: eyeX, y: eyeY };
      boxNConstraint.pointB =  { x: eyeX, y: eyeY };

      cloud1Constraint.pointB =  { x: eyeX, y: eyeY };
      cloud2Constraint.pointB =  { x: eyeX, y: eyeY };
      cloud3Constraint.pointB =  { x: eyeX, y: eyeY };
    
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

  if (Fg > 0.5) {
    Fg = 0.5;
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