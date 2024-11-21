

const LINE_GAP = 12;
const BEGINNING = ['symbols/x0.png', 'symbols/x1.png'];
const SYMBOLS = ['symbols/x2.png', 'symbols/x3.png', 'symbols/x4.png', 'symbols/x5.png', 'symbols/x6.png', 'symbols/x7.png', 'symbols/x8.png', 'symbols/x9.png', 'symbols/x10.png', 'symbols/x11.png', 'symbols/x12.png', 'symbols/x13.png', 'symbols/x14.png', 'symbols/x15.png']

const source = document.getElementById('canvas-container');
const target = document.getElementById('blur-1');
const target2 = document.getElementById('blur-2');
const sourcePosition = source.getBoundingClientRect();

target.style.top = `${sourcePosition.top}px`;
target.style.left = `${sourcePosition.left}px`;
target2.style.top = `${sourcePosition.top}px`;

let points;
let images = [];
let start = [];

function preload() {
  for (let i = 0; i < SYMBOLS.length; i++) {
    images[i] = loadImage(SYMBOLS[i]);
  }
  start[0] = loadImage(BEGINNING[0]);
  start[1] = loadImage(BEGINNING[1]);
}

function lines() {
  let k = width / points.length;
  let i = 0;
  stroke(200);
  for (let p of points) {
    line(k / 2 + i, 0, k / 2 + i, 200);
    i += k;
  }
}

function curves() {
  let factor = width / 5000;
  let f = frameCount % 360;
  strokeWeight(1.5);
  stroke(0);
  noFill();
  for (let i = -2; i < 3; i++) {
    let h = height / 2 + LINE_GAP * i;
    beginShape();
    for (let x = 5; x <= width - 5; x += 60) {
      let y = h + 20 * sin(x * factor + f + sin(f));
      vertex(x, y);
    }
    endShape();

  }
}

class Symbols {
  constructor(s, x) {
    this.pos = createVector(x, height / 2);
    this.x_offset = random(360);
    this.y_offset = random(-5, 10);
    this.i = random(images);
    this.scale = 0.32;
    if (s == 0) {
      this.i = random(start);
      if (this.i == start[0]) {
        this.y_offset = -10;
        this.scale = 0.5;
      }
      else scale = 0.4;
    }
  }
  update() {
    let factor = width / 5000;
    let f = frameCount % 360;
    if (this.pos.x < 0) {
      this.scale = 0.35;
      this.pos.x = width;
      this.i = random(images);
    }
    this.pos.x -= 2;
    this.pos.y = height / 3 + this.y_offset + 20 * sin(this.pos.x * factor + f + sin(f + this.x_offset));
    // vertical movement = origin + offset for y + AMPLITUDE * wave with parameters (x coordinate times a scalar + frameCount + wave perpendicular to this wave) 
  }
  show() {
    image(this.i, this.pos.x, this.pos.y, this.i.width * this.scale, this.i.height * this.scale);
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, 200);
  canvas.parent('canvas-container');
  angleMode(DEGREES);
  frameRate(144);

  let k = int(width / 80) - 1;
  let gap = width / k;
  points = [];
  for (let i = 0; i < k; i++) {
    points[i] = new Symbols(i, width + i * gap);
  }
}

function draw() {
  background(255);
  curves();
  for (let p of points) {
    p.show();
    p.update();
  }
}