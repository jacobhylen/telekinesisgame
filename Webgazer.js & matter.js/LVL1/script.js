window.saveDataAcrossSessions = true;

let body = document.getElementById("body");
let finishedPlaying = document.getElementById("finished");
let finishedButton = document.getElementById("nextButton");
let timer = document.getElementById("timer");
let timePassed = 0;

var start = Date.now();

let eyeX = 0;
let eyeY = 0;

let singularityMass = 1 * Math.pow(10, 11);
let singularityMassMagnet = 1 * Math.pow(10, 12);

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
  Bodies = Matter.Bodies,
  Body = Matter.Body;

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
var boxA = Bodies.rectangle(window.innerWidth / 2 - 200, window.innerHeight - 500, 50, 50, {isStatic: true, render: {
  fillStyle: 'black',
  strokeStyle: '#ff6f3c',
  lineWidth: 8
}});
var boxAB = Bodies.rectangle(window.innerWidth / 2 - 100, window.innerHeight - 500, 50, 50, {isStatic: true, render: {
  fillStyle: 'black',
  strokeStyle: '#005691',
  lineWidth: 8
}});
var boxAC = Bodies.rectangle(window.innerWidth / 2 - 300, window.innerHeight - 500, 50, 50, {isStatic: true, render: {
  fillStyle: 'black',
  strokeStyle: '#f9ed69',
  lineWidth: 8
}});
var boxB = Bodies.rectangle(window.innerWidth / 2 + 100, window.innerHeight - 500, 50, 50, {isStatic: true, render: {
  fillStyle: 'black',
  strokeStyle: '#61b15a',
  lineWidth: 8
}});
var boxBB = Bodies.rectangle(window.innerWidth / 2 + 200, window.innerHeight - 500, 50, 50, {isStatic: true, render: {
  fillStyle: 'black',
  strokeStyle: '#e84545',
  lineWidth: 8
}});
var boxBC = Bodies.rectangle(window.innerWidth / 2 + 300, window.innerHeight - 500, 50, 50, {isStatic: true, render: {
  fillStyle: 'black',
  strokeStyle: '#845ec2',
  lineWidth: 8
}});

// create two boxes and a ground
var boxC = Bodies.rectangle(window.innerWidth / 2 + Math.random(500), 650, 50, 50, { render: {
  // orange
  sprite: {
    texture: 'lvl1Candy3.png',
    xScale: 0.2,
    yScale: 0.2
  }
}});
var boxD = Bodies.rectangle(window.innerWidth / 2 - Math.random(500), 650, 50, 50, { render: {
  //green
  sprite: {
    texture: 'lvl1Candy5.png',
    xScale: 0.2,
    yScale: 0.2
  }
}});
var boxE = Bodies.rectangle(window.innerWidth / 2 + Math.random(500), 650, 50, 50, { render: {
  // blue
  sprite: {
    texture: 'lvl1Candy4.png',
    xScale: 0.2,
    yScale: 0.2
  }
}});
var boxF = Bodies.rectangle(window.innerWidth / 2 - Math.random(500), 600, 50, 50, { render: {
  //red
  sprite: {
    texture: 'lvl1Candy2.png',
    xScale: 0.2,
    yScale: 0.2
  }
}});
var boxG = Bodies.rectangle(window.innerWidth / 2 + Math.random(500), 600, 50, 50, { render: {
  // yellow
  sprite: {
    texture: 'lvl1Candy1.png',
    xScale: 0.2,
    yScale: 0.2
  }
}});
var boxH = Bodies.rectangle(window.innerWidth / 2 - Math.random(500), 600, 50, 50, { render: {
  // blue
  sprite: {
    texture: 'lvl1Candy6.png',
    xScale: 0.2,
    yScale: 0.2
  }
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
World.add(engine.world, [boxA, boxAB, boxAC, boxB, boxBB, boxBC, boxC, boxD, boxE, boxF, boxG, boxH, ground, ground2, wall1, wall2]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

let collisionACcheck = false;
let collisionABEcheck = false;
let collisionACGcheck = false;

let collisionBDcheck = false; 
let collisionBBFcheck = false;
let collisionBCHcheck = false;

let levelComplete = false;

var checkIfLoaded = setInterval(() => {
  if(eyeX != 0){
    
    start = Date.now();
    clearInterval(checkIfLoaded);
    setInterval(function(){
      if (levelComplete == false){
      timePassed = Date.now() - start;
      timer.innerHTML = Math.round(timePassed / 10)/100 +"s";
      }
    }, 10);
  }

}, 10);

function sound(src, volume) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.volume = volume;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

let click1 = new sound("Click.mp3", 1);
let click2 = new sound("Click.mp3", 1);
let click3 = new sound("Click.mp3", 1);
let click4 = new sound("Click.mp3", 1);
let click5 = new sound("Click.mp3", 1);
let click6 = new sound("Click.mp3", 1);

let backgroundMusic = new sound("StarGazing.mp3", 0.1);

soundPlayed1 = false;
soundPlayed2 = false;
soundPlayed3 = false;
soundPlayed4 = false;
soundPlayed5 = false;
soundPlayed6 = false;

setInterval(function () {

  backgroundMusic.play();

  let collisionAC = Matter.SAT.collides(boxA, boxC);
  let collisionABE = Matter.SAT.collides(boxAB, boxE);
  let collisionACG = Matter.SAT.collides(boxAC, boxG);

  let collisionBD = Matter.SAT.collides(boxB, boxD);
  let collisionBBF = Matter.SAT.collides(boxBB, boxF);
  let collisionBCH = Matter.SAT.collides(boxBC, boxH);

  if (collisionAC.collided && !soundPlayed1) {
    //boxC.position.x = 2000;
    //boxC.isStatic = true;
    click1.play();
    boxA.render.fillStyle = '#ff6f3c';
    soundPlayed1 = true;
    collisionACcheck = true;
  }
  if (collisionABE.collided && !soundPlayed2) {
    //boxE.position.x = 2000;
    //boxE.isStatic = true;
    click2.play();
    boxAB.render.fillStyle = '#005691';
    soundPlayed2 = true;
    collisionABEcheck = true;
  } 
  if (collisionACG.collided && !soundPlayed3) {
    //boxG.position.x = 2000;
    //boxG.isStatic = true;
    click3.play();
    boxAC.render.fillStyle = '#f9ed69';
    soundPlayed3 = true;
    collisionACGcheck = true;
  } 
  if (collisionBD.collided && !soundPlayed4) {
    //boxD.position.x = 2000;
    //boxD.isStatic = true;
    click4.play();
    boxB.render.fillStyle = '#61b15a';
    soundPlayed4 = true;
    collisionBDcheck = true; 
  } 
  if (collisionBBF.collided && !soundPlayed5) {
    //boxF.position.x = 2000;
    //boxF.isStatic = true;
    click5.play();
    boxBB.render.fillStyle = '#e84545';
    soundPlayed5 = true;
    collisionBBFcheck = true;
  }
  if (collisionBCH.collided && !soundPlayed6) {
    //boxH.position.x = 2000;
    //boxH.isStatic = true;
    click6.play();
    boxBC.render.fillStyle = '#845ec2';
    soundPlayed6 = true;
    collisionBCHcheck = true;
  }

  if (collisionACcheck && collisionABEcheck && collisionACGcheck && collisionBDcheck && collisionBBFcheck && collisionBCHcheck) {
    levelComplete = true;
    finishedPlaying.style.visibility = "visible";
    finishedButton.style.visibility = "visible";
  } else {
    finishedPlaying.style.visibility = "hidden";
  }
  
/*     if(eyeY > boxA.position.y){
      boxA.force.y = calculateGravityForce(boxA);
    }
    if(eyeY < boxA.position.y){
      boxA.force.y = -calculateGravityForce(boxA);
    }
    console.log(calculateGravityForce(boxA));
   */
  boxC.force.x = gravityX(boxC) + gravityXmagnet(boxC, boxA);;
  boxC.force.y = gravityY(boxC) + gravityYmagnet(boxC, boxA);;

  boxD.force.x = gravityX(boxD) + gravityXmagnet(boxD, boxB);;
  boxD.force.y = gravityY(boxD) + gravityYmagnet(boxD, boxB);;


  boxE.force.x = gravityX(boxE) + gravityXmagnet(boxE, boxAB);;
  boxE.force.y = gravityY(boxE) + gravityYmagnet(boxE, boxAB);;

  boxF.force.x = gravityX(boxF) + gravityXmagnet(boxF, boxBB);;
  boxF.force.y = gravityY(boxF) + gravityYmagnet(boxF, boxBB);;

  boxG.force.x = gravityX(boxG) + gravityXmagnet(boxG, boxAC);;
  boxG.force.y = gravityY(boxG) + gravityYmagnet(boxG, boxAC);;

  boxH.force.x = gravityX(boxH) + gravityXmagnet(boxH, boxBC);
  boxH.force.y = gravityY(boxH) + gravityYmagnet(boxH, boxBC);

}, 1);


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