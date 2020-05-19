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
  //  draw obstacle
  ctx.fillStyle = 'brown';
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  // update browser when it is ready to draw again
  window.requestAnimationFrame(loop);
};
// Event listeners for key presses
window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);
window.requestAnimationFrame(loop);

// Display canvas context, draw tile buffer here.
const DISPLAY = document.querySelector('canvas').getContext('2d', {alpha:false, desynchronized:false});
// Tile buffer canvas context, draw individual tiles here.
const BUFFER = document.createElement('canvas').getContext('2d', {alpha:false, desynchronized:true});

// width and height for every tile
const TILE_SIZE = 16;

// The TILES object contains "tile" objects with keys that correspond to map values. Each tile has an *object color**

// 0: plainbackground
// 1: floorpath
// 2: platform
// 3: ringofpower

const TILES = {
  0: { color: '#552828' }, 
  1: { color: '#6B6B6B' }, 
  2: { color: '#008000' },
  3: { color: '#FFD700' },
}

// Holds info about the map, including tile indices array
const MAP = {
  columns: 16,
  rows: 14,
  height: 14 * TILE_SIZE,
  width: 16 * TILE_SIZE,
}

// Used during image scaling to ensure rendered image isn't skewed
width_height_ratio: 16 / 14;

// tiles in this array correspond to those in TILES object
  tiles: [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2,
    0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2,
    0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0,
    0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0,
    0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 3]
  };

  // Renders tiles to buffer
    funtion renderTiles() {
      var map_index = 0;

      // increment by actual TILE_SIZE to avoid multiplying on every interation
      for(var top = 0; top < MAP.height; top += TILE_SIZE) {
        for(var left = 0; left < MAP.width; left += TILE_SIZE) {
          var tile_value = MAP.tiles[map_index];
          var tile = TILES[tile_value];
          // Does buffer fillStyle change which kinds of tiles I can use?
          BUFFER.fillStyle = tile.color;

          BUFFER.fillRect(left, top, TILE_SIZE, TILE_SIZE);
          map_index ++;
        }
      }
    }

    // Render the buffer to the display. If this example required a game loop or repeated draws, this function allows you to only make one drawImage call here instead of 1 call for every tile.
    function renderDisplay() {
      DISPLAY.drawImage(BUFFER.canvas, 0, 0);
    }

    // This function resizes the CSS width and height of the DISPLAY canvas to force it to scale to fit the window.
    function resize(event) {
      var height = document.documentElement.clientHeight;
      var width = document.documentElement.clientWidth;

      // Makes sure the DISPLAY canvas is resized in a way that maintains the MAP's width/height ratio.
      if(width / height < MAP.width_height_ratio) height = Math.floor(width / MAP.width_height_ratio);
      else width = Math.floor(height * MAP.width_height_ratio);

      DISPLAY.canvas.style.height = height + 'px';
      DISPLAY.canvas.style.width = width + 'px';

      // renderDisplay();
    }



// Setting the initial height and width of the BUFFER and DISPLAY canvases.
BUFFER.canvas.width = DISPLAY.canvas.width = MAP.width;
BUFFER.canvas.height = DISPLAY.canvas.height = MAP.height;
BUFFER.imageSmoothingEnabled = DISPLAY.imageSmoothingEnabled = false;

renderTiles();

window.addEventListener('resize', resize);

resize();
renderDisplay();
