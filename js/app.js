var ctx, controller, rectangle, loop;
// var spriteSheet;
ctx = document.getElementById('myCanvas').getContext('2d');

ctx.canvas.width = innerWidth;
ctx.canvas.height = 625;

// an object to display the rectangle
rectangle = {
  height: 50,
  width: 50,
  jumping: true, // true if jumping, false if not
  x: 500,
  x_vel: 0, // speed left and right
  y: 0,
  y_vel: 0
};

// object to control the keyboard input
controller = {

  left: false,
  right: false,
  up: false,

  keyListener: function (event) {

    // if key is pressed down, keyState will equal true. If it is not pressed, keyState will get false
    var keyState = (event.type == 'keydown') ? true : false;

    // switch statement to determine which key is being pressed. This could have been done with an 'if.. else if' statement, but the switch statement is a much cleaner way to handle this. Also, each key on a keyboard has a specific 'keyCode' attached to it. keyCode is a built in JavaScript variable.
    switch (event.keyCode) {

    case 37: // left arrow key
      controller.left = keyState;
      break;
    case 38: // up arrow key
      controller.up = keyState;
      break;
    case 39: // right arrow key
      controller.right = keyState;
    }
  }
};

loop = function () {

  // controls jumping movement
  if (controller.up && rectangle.jumping == false) {

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

  rectangle.y_vel += 1; // creates gravity on each frame
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

  // if rectangle is going passed the left or right boundaries of the window
  if (rectangle.x < 0) {
    rectangle.x = 0;
  } else if (rectangle.x > ctx.canvas.width - 50) {
    rectangle.x = ctx.canvas.width - 50;
  }

  // draw background
  ctx.fillStyle = 'skyblue';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // draw rectangle
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  ctx.fill();

  // update browser when it is ready to draw again
  window.requestAnimationFrame(loop);
};

// Event listeners for key presses
window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);
window.requestAnimationFrame(loop);
