// Author:

/*******************************************************************************
                          Global UI Variables

  canvasDiv, textDiv, buttonDiv, buttonDiv2
  In the project's HTML, the divs that will contain various elements that may
  be created in setup(). Useful for styling (e.g., keeping them all centered).

  canvas
  The p5.js canvas. This is where all the magic happens!

  textP
  This is where you will print any kind of text (e.g., the label of an image).

  buttons
  If included, these are for user interaction (e.g., training a model, inputting
  data).
*******************************************************************************/

let canvasDiv;
let canvas;
let textDiv;
let textP;
let textP2;
let buttonDiv;
let upButton;
let downButton;
let leftButton;
let rightButton;
let centerButton;
let buttonDiv2;
let saveButton;

/*******************************************************************************
                            Global ML Variables

  featureExtractor
  An object that can extract the features from the MobileNet model.

  imgFeatures
  The features of the image on the canvas.

  knnClassifier
  The new model we have created from MobileNet's features.

  video
  A video loaded into the program for object detection.

  isModelReady
  Initialized to false in setup(). Set to true when the model has been loaded
  successfully.

  ups, downs, lefts, rights, centers
  The number of examples that have been added to the training data.

  ballX, ballY, ballSpeed
  The ball's (x, y) coordinates, along with its and speed.
*******************************************************************************/

let featureExtractor;
let imgFeatures;
let knnClassifier;
let video;
let isModelReady;
let ups;
let downs;
let lefts;
let rights;
let centers;

/******************************************************************************
                                  setup()

  This is a built-in p5.js function that is automatically called when the
  program starts, just before draw(). This is used for initializing global
  variables, building the UI, and loading images, video, data, and models.
*******************************************************************************/

function setup() {
  canvasDiv = createDiv();
  canvas = createCanvas(640, 480);
  canvas.parent(canvasDiv);
  textDiv = createDiv();
  textP = createP("Model loading, please wait...");
  textP.parent(textDiv);
  textP2 = createP("[Training data here.]");
  textP2.parent(textDiv);
  buildButtons();
  ups = 0;
  downs = 0;
  lefts = 0;
  rights = 0;
  centers = 0;
  // new code below

}

/******************************************************************************
                                  draw()

  This is a built-in p5.js function that is automatically called in a repeated
  loop, just after setup(). This is used for handling animations, or running
  anything over and over again throughout a program.
*******************************************************************************/

function draw() {
  if(isModelReady) {
    imgFeatures = featureExtractor.infer(canvas);
    if(knnClassifier.getNumLabels() > 0) {
      knnClassifier.classify(imgFeatures, gotResults);
      // new code below

    }
  }
}

/******************************************************************************
                                  draw()

  Draw a ball to the canvas, and animate it depending on the label of the
  current image ("frame") in the video element.
*******************************************************************************/

function drawBall() {
  fill(0);
  ellipse(ballX, ballY, 36);
  let labelString = textP.html().toLowerCase();
  if(labelString.includes("up")) {
    ballY -= ballSpeed;
  } else if(labelString.includes("down")) {
    ballY += ballSpeed;
  } else if(labelString.includes("left")) {
    ballX -= ballSpeed;
  } else if(labelString.includes("right")) {
    ballX += ballSpeed;
  }
  ballX = constrain(ballX, 16, width - 16);
  ballY = constrain(ballY, 16, height - 16);
}

/******************************************************************************
                               buildButtons()

  Builds all of the app's buttons: up, down, left, and right. When any of them
  are clicked, add the features of the current image to the k-NN classifier.
*******************************************************************************/

function buildButtons() {
  buttonDiv = createDiv();
  upButton = createButton("Up");
  upButton.parent(buttonDiv);
  upButton.mousePressed(function () {
    ups++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Up");
  });
  downButton = createButton("Down");
  downButton.parent(buttonDiv);
  downButton.mousePressed(function () {
    downs++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Down");
  });
  leftButton = createButton("Left");
  leftButton.parent(buttonDiv);
  leftButton.mousePressed(function () {
    lefts++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Left");
  });
  rightButton = createButton("Right");
  rightButton.parent(buttonDiv);
  rightButton.mousePressed(function () {
    rights++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Right");
  });
  centerButton = createButton("Center");
  centerButton.parent(buttonDiv);
  centerButton.mousePressed(function () {
    centers++;
    textP2.html("Ups: " + ups + " - Downs: " + downs + " - Lefts: " + lefts +
    " - Rights: " + rights + " - Centers: " + centers);
    knnClassifier.addExample(imgFeatures, "Center");
  });
  buttonDiv2 = createDiv();
  saveButton = createButton("Save Model");
  saveButton.parent(buttonDiv2);
  saveButton.mousePressed(function () {
    knnClassifier.save();
  });
  buttonDiv.style("display", "none");
  buttonDiv2.style("display", "none");
}

/******************************************************************************
                               videoReady()

  A callback function. Called after the video has been loaded. First, we'll
  flip the video using:

  video.style("transform", "scale(-1, 1)");

  Then, now that we have video, we will immediately begin extracting the
  features from the MobileNet model with:

  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
*******************************************************************************/

function videoReady() {
  video.style("display", "none");
  // new code below

  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
}

/******************************************************************************
                               featureExtractorLoaded()

  A callback function. Called after the MobileNet model has been loaded and its
  feature extractor has been created. Here we load the new k-NN classification
  model. We'll simply call the model "knnClassifier". After that, we'll load
  the saved k-NN model using:

  knnClassifier.load("myKNN.json", callback);

  The callback function above will be called after the saved model is loaded.
*******************************************************************************/

function featureExtractorLoaded() {

}

/******************************************************************************
                          gotResults(error, results)

  This function is a callback for classify(). In other words, after our new
  classifier model has classified the image, it should call this function next.

  parameters
  - error: If there was an error while running classify(), it should be brought
  up here and the function shouldn't do anything else.
  - results: The results of classify(). This will be an object we can use to
  get some useful information, such as the predicted label of the image, as
  well as how confident the model is about that assigned label.
*******************************************************************************/

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    let labelString = getLabel(results);
    textP.html("Label: " + labelString);
  }
}

// Don't touch this, it "fixes" a bug in ml5.js
function getLabel(results) {
  const entries = Object.entries(results.confidencesByLabel);
  let greatestConfidence = entries[0];
  for(let i = 0; i < entries.length; i++) {
    if(entries[i][1] > greatestConfidence[1]) {
      greatestConfidence = entries[i];
    }
  }
  return greatestConfidence[0];
}
