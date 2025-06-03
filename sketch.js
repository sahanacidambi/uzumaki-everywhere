let steps = 500;
let path = [];
let currentStep = 0;
let totalStepsToAnimate = 0;
let animationRunning = false;
let inputSteps, startButton;
let horrorFont;
let trail = [];
const spiralScale = 20;

function preload() {
  horrorFont = loadFont('Green Fuz.otf'); // Replace with actual font
}

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('canvas-holder');
  frameRate(2);
  generateSpiral();

  // Link existing DOM elements from HTML
  inputSteps = select('#input-steps');
  startButton = select('#start-button');
  startButton.mousePressed(startAnimation);
}

function generateSpiral() {
  let x = 0, y = 0;
  let stepCount = 0;
  let totalSteps = steps;
  path = [createVector(x, y)];

  while (totalSteps > 0) {
    stepCount++;

    for (let i = 0; i < stepCount && totalSteps > 0; i++) {
      x++;
      path.push(createVector(x, y));
      totalSteps--;
    }

    for (let i = 0; i < stepCount && totalSteps > 0; i++) {
      y++;
      path.push(createVector(x, y));
      totalSteps--;
    }

    stepCount++;

    for (let i = 0; i < stepCount && totalSteps > 0; i++) {
      x--;
      path.push(createVector(x, y));
      totalSteps--;
    }

    for (let i = 0; i < stepCount && totalSteps > 0; i++) {
      y--;
      path.push(createVector(x, y));
      totalSteps--;
    }
  }
}

function startAnimation() {
  let val = int(inputSteps.value());
  if (val >= 1 && val <= steps) {
    totalStepsToAnimate = val;
    currentStep = 1;
    animationRunning = true;
    trail = [];

    // Clear coordinate display initially
    select('#coordsDisplay').html('');
  } else {
    alert('Enter a number between 1 and 500');
  }
}

function draw() {
  background(0);
  
  fill(255);
  noStroke();
  textFont(horrorFont);
  textSize(48);
  textAlign(CENTER, TOP);
  

  translate(width / 2, height / 2);
  scale(1,-1);

  stroke(255);
  noFill();
    beginShape();
  for (let v of path) {
    // Add jitter to create unsettling spiral effect
    let jitterX = v.x + random(-0.2, 0.2);
    let jitterY = v.y + random(-0.2, 0.2);
    vertex(jitterX * spiralScale, jitterY * spiralScale);
  }
  endShape();


  if (animationRunning && currentStep < totalStepsToAnimate) {
    let p = path[currentStep];
    trail.push(p.copy());
    currentStep++;
  } else if (animationRunning) {
    animationRunning = false;
  }

  // Draw ghost trail
  noStroke();
  for (let i = 0; i < trail.length; i++) {
    let alpha = map(i, 0, trail.length, 50, 255);
    fill(255, 0, 0, alpha);
    ellipse(trail[i].x * spiralScale, trail[i].y * spiralScale, 15);
  }

  if (!animationRunning && totalStepsToAnimate > 0) {
    let final = path[totalStepsToAnimate];
    fill(255, 0, 0);
    ellipse(final.x * spiralScale, final.y * spiralScale, 15);

     // Update coordinate display in left panel
 select('#coordsDisplay').html(`
  <span class="label">Current Coordinates:</span>
  <span class="value">(${final.x}, ${final.y})</span>
`);


  } else if (!animationRunning && totalStepsToAnimate === 0) {
  // Before user interacts, show dot at origin
  let start = path[0];
  fill(255, 0, 0);
  ellipse(start.x * spiralScale, start.y * spiralScale, 15);
} else if (!animationRunning && totalStepsToAnimate > 0) {
  let final = path[totalStepsToAnimate];
  fill(255, 0, 0);
  ellipse(final.x * spiralScale, final.y * spiralScale, 15);
}

}
