'use strict';
var ctx;
var controller;
var rectangle;
var loop;
var obstacle;
ctx = document.getElementById('myCanvas').getContext('2d');
ctx.canvas.width = innerWidth;
ctx.canvas.height = 625;

// an object to display the rectangle
rectangle = {
  height: 50,
  width: 50,
  jumping: true, // true if jumping, false if not
  x: 150,
  x_vel: 0, // speed left and right
  y: 0,
  y_vel: 0
};

obstacle = { // obstacle rectangle to jump over
  height: 100,
  width: 100,
  x: 300,
  y: 525,
};

function Obstacle(height, width, x, y, color) {
  this.height = height;
  this.width = width;
  this.x = x;
  this.y = y - this.height;
  this.color = color;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);

  // obstacle collision detection
  // first IF statement detects collision with LEFT side of obstacle
  if (rectangle.x > this.x - rectangle.width &&
    rectangle.y > this.y &&
    rectangle.x < this.x) {
    rectangle.x = this.x - rectangle.width;
    // second IF statement detect collision with RIGHT side of obstacle
  } else if (rectangle.x < this.x + this.width &&
    rectangle.y > this.y &&
    rectangle.x > this.x + rectangle.width) {
    rectangle.x = this.x + this.width;
    // third IF statement detects collision with TOP of obstacle (and would allow character/box to "stand" on top), and re-sets "jump" ability to FALSE to allow player to jump again. Also re-sets y-velocity to avoid "rocket jump" glitch.
  } else if (rectangle.y > this.y - rectangle.height &&
    rectangle.x > this.x - rectangle.width &&
    rectangle.x < this.x + this.width) {
    rectangle.y = this.y - rectangle.height;
    rectangle.jumping = false;
    rectangle.y_vel = 10;
  }
  // else if (rectangle.y > ctx.canvas.height - this.y)
}

// object to control the keyboard input
controller = {
  left: false,
  right: false,
  space: false,
  keyListener: function (event) {
    // if key is pressed down, keyState will equal true. If it is not pressed, keyState will get false
    var keyState = (event.type == 'keydown') ? true : false;
    // switch statement to determine which key is being pressed. This could have been done with an 'if.. else if' statement, but the switch statement is a much cleaner way to handle this. Also, each key on a keyboard has a specific 'keyCode' attached to it. keyCode is a built in JavaScript variable.
    switch (event.keyCode) {
      case 37: // left arrow key
        controller.left = keyState;
        break;
      case 32: // space bar key
        controller.space = keyState;
        break;
      case 39: // right arrow key
        controller.right = keyState;
    }
  }
};
loop = function () {
  // controls jumping movement
  if (controller.space && rectangle.jumping == false) {
    // negative y value will allow rectangle to move up
    rectangle.y_vel -= 60;
    // prevents rectangle from jumping again if already jumping
    rectangle.jumping = true;
  }
  // controls left movement
  if (controller.left) {
    rectangle.x_vel -= 1; // negative x value to move left
  }
  // controls right movement
  if (controller.right) {
    rectangle.x_vel += 1; // positive x value to move right
  }
  rectangle.y_vel += 1.5; // creates gravity on each frame
  rectangle.x += rectangle.x_vel; // add velocity to x position
  rectangle.y += rectangle.y_vel; // add velocity to y position
  // friction: this slows down the rectangle until it is at a complete stop
  rectangle.x_vel *= 0.9;
  rectangle.y_vel *= 0.9;
  // collision detection
  // if rectangle is falling below the floor
  if (rectangle.y > ctx.canvas.height - 50) {
    rectangle.jumping = false; // allow to jump again
    rectangle.y = ctx.canvas.height - 50; // dont fall past the floor
    rectangle.y_vel = 0; // stop if hits the floor
  }
  // if rectangle is going past the left or right boundaries of the window
  if (rectangle.x < 0) {
    rectangle.x = 0;
  } else if (rectangle.x > ctx.canvas.width - 50) {
    rectangle.x = ctx.canvas.width - 50;
  }

  // obstacle collision detection
  // first IF statement detects collision with LEFT side of obstacle
  if (rectangle.x > 300 - rectangle.width &&
    rectangle.y > ctx.canvas.height - obstacle.height &&
    rectangle.x < 300) {
    rectangle.x = 300 - rectangle.width;
    // second IF statement detect collision with RIGHT side of obstacle
  } else if (rectangle.x < 350 + rectangle.width &&
    rectangle.y > ctx.canvas.height - obstacle.height &&
    rectangle.x > 350) {
    rectangle.x = 350 + rectangle.width;
    // third IF statement detects collision with TOP of obstacle (and would allow character/box to "stand" on top), and re-sets "jump" ability to FALSE to allow player to jump again. Also re-sets y-velocity to avoid "rocket jump" glitch.
  } else if (rectangle.y > ctx.canvas.height - obstacle.height - rectangle.height &&
    rectangle.x > obstacle.x - rectangle.width &&
    rectangle.x < obstacle.x + obstacle.width) {
    rectangle.y = ctx.canvas.height - 150;
    rectangle.jumping = false;
    rectangle.y_vel = 10;
  }

  // draw background
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // draw rectangle
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);

  // draw obstacle
  ctx.fillStyle = 'brown';
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

  // var xCoord = 0
  // for (var i = 0; i < 10; i++) {
  //   new Obstacle(100, ctx.canvas.width * 1, xCoord, ctx.canvas.height, 'green');
  //   xCoord += (ctx.canvas.width * .1);
  // }

  new Obstacle(100, 100, 100, ctx.canvas.height, 'blue');
  new Obstacle(50, 200, 600, 475, 'orange');
  new Obstacle(200, 100, 500, ctx.canvas.height, 'green');
  new Obstacle(100, 100, 900, ctx.canvas.height, 'black');

  // update browser when it is ready to draw again
  window.requestAnimationFrame(loop);
};
// Event listeners for key presses
window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);

// initiate loop
window.requestAnimationFrame(loop);