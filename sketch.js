
let video;
let poseNet;
let poses = [];

let test = 1200;
let test2 = 400;
let posx, posy;

var attackLevel = 1.0;
var releaseLevel = 0;

var attackTime = 0.8;
var decayTime = 0.5;
var susPercent = 0.9  ;
var releaseTime = 1.2;
var overdub = [[]];

var mic, recorder,soundFile;
var state = 0;


var env, triOsc;

var mod = false;
var mod2 = false;
var mod3 = false;


function setup() {
  createCanvas(640, 480);
 //   env = new p5.Envelope();
 // env.setADSR(attackTime, decayTime, susPercent, releaseTime);
 // env.setRange(attackLevel, releaseLevel);

  triOsc = new p5.Oscillator('triangle');
   // triOsc.amp(env);
   // triOsc.start();

  triOsc2 = new p5.Oscillator('sine');
  // triOsc2.amp(env);
  // triOsc2.start();
  //
  // triOsc3 = new p5.Oscillator('sine');
  // triOsc3.amp(env);
  // triOsc3.start();

  video = createCapture(VIDEO);
  video.size(width, height);

  // Cria um único método poseNet com uma única detecção.
  poseNet = ml5.poseNet(video, modelReady);
  // Isto configura um evento que preenche a variável pose.
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas

}

function modelReady() {
  select('#status').html('Modelo Carregado');
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();

}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  triOsc.amp(env);
  triOsc.start();

  triOsc2.amp(env);
  triOsc2.start();
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(255, 0, 0);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 20, 20);

        triOsc.freq(map(keypoint.position.x,0,width,80,test2));
        triOsc2.freq(map(keypoint.position.y,0,height,400,test));
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
