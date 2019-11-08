let theta = 0; 
let iters = 85;
let steps = 401;
var vertices = new Array();

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  fill(255);
}

function plot(x, y) {
  var scale = 0.1;
  var nx = (window.innerWidth * 0.5) + (x * scale);
  var ny = (window.innerHeight * 0.5) + (y * scale);
  return createVector(nx, ny);
}


function draw() {
  background(0);
  fill(255);

  textSize(32);
  text(theta, 10, 30);
  
  var x = theta;
  var y = theta;

  for (let iter = 0; iter < iters; iter++) {

    let xx = x * x;
    let yy = y * y;
    let tt = theta * theta;
    let xy = x * y;
    let xt = x * theta;
    let yt = y * theta;
    let t = theta;

    let nx = -xx - xy - yt - x;
    let ny = -yy -tt -xt + yt + x + y -t;

    var pos = plot(nx, ny);
    circle(pos.x, pos.y, 2)

    x = nx
    y = ny  
  }

  theta += 0.000005;
}


 