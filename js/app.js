'use strict';
var ctx;
var controller;
var player;
var loop;
ctx = document.getElementById('myCanvas').getContext('2d');
ctx.canvas.width = innerWidth;
ctx.canvas.height = 725;






// an object to display the player
player = { // player sprite aka (RECTANGLE)
  height: 50,
  width: 50,
  jumping: true, // true if jumping, false if not
  x: 300,
  x_vel: 0, // speed left and right
  y: 0,
  y_vel: 0
};





function Obstacle(height, width, x, y, color) {
  this.height = height;
  this.width = width;
  this.x = x;
  this.y = y;
  this.color = color;

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(this.x, this.y, this.width, this.height);

  //debugger;
  //console.log('checking for COLLISION', player);

  // OBSTACLE COLLISION DETECTION - Note: Collision properties are a part of the "Obstacle" constructor, and therefore it is the Obstacles that check for player collision
 
  // Variables to determine generally which "side" of an obstacle a player is on - with small margins added/subtracted to serve as measures of "forgiveness" to allow collision properties some leeway to trigger
  var isPlayerOnLeft = player.x + player.width < this.x + 10;
  var isPlayerOnRight = player.x > this.x + this.width - 10;
  var isPlayerAbove = player.y + player.height < this.y + 15;
  var isPlayerBelow = player.y > this.height + this.y - 10;

  // Variables to determine if actual "collision"/overlap of obstacle/player boundaries takes place
  var isRightSideOfPlayerOverlappingLeftSideOfObstacle = player.x + player.width > this.x; // left side collision variable - determines if actual collision is taking place between player/obstacle
  var isLeftSideOfPlayerOverlappingRightSideOfObstacle = player.x - player.width < this.x + this.width - player.width; // right side collision variable - determines if actual collision is taking place between player/obstacle
  var isBottomOfPlayerOverlappingTopOfObstacle = player.y + player.height > this.y; // top side collision variable - determines if actual collision is taking place between player/obstacle
  var isTopOfPlayerOverlappingBottomOfObstacle = player.y < this.y + this.height; // bottom side collision variable - determines if actual collision is taking place between player/obstacle

// Boolean variable to ensure that player is colliding with obstacle on obstacle left within the "height" range of obstacle
  var isCollidingFromLeft = isRightSideOfPlayerOverlappingLeftSideOfObstacle &&
    isTopOfPlayerOverlappingBottomOfObstacle &&
    isBottomOfPlayerOverlappingTopOfObstacle &&
    isPlayerOnLeft;

// Boolean variable to ensure that player is colliding with obstacle on obstacle right within the "height" range of obstacle
  var isCollidingFromRight = isLeftSideOfPlayerOverlappingRightSideOfObstacle &&
    isTopOfPlayerOverlappingBottomOfObstacle &&
    isBottomOfPlayerOverlappingTopOfObstacle &&
    isPlayerOnRight;

// Boolean variable to ensure that player is colliding with obstacle on obstacle top within the "width" range of obstacle
  var isCollidingFromTop = isRightSideOfPlayerOverlappingLeftSideOfObstacle &&
    isLeftSideOfPlayerOverlappingRightSideOfObstacle &&
    isBottomOfPlayerOverlappingTopOfObstacle &&
    isPlayerAbove;

// Boolean variable to ensure that player is colliding with obstacle on obstacle bottom within the "width" range of obstacle
  var isCollidingFromBottom = isTopOfPlayerOverlappingBottomOfObstacle &&
    isPlayerBelow &&
    isLeftSideOfPlayerOverlappingRightSideOfObstacle &&
    isRightSideOfPlayerOverlappingLeftSideOfObstacle;

 // first IF statement detects collision with LEFT side of obstacle is TRUE
  if (isCollidingFromLeft) {
    console.log('left collision', player, this);
    //debugger;
    player.x = this.x - player.width; // set it back to LEFT of obstacle
    player.x_vel = 0; // reduce velocity to zero to ensure player stops immediately without sinking into obstacle object

  // second IF statement detects collision with RIGHT side of obstacle is TRUE
  } else if (isCollidingFromRight) {
    console.log('right collision', player, this);
    //debugger;
    player.x = this.x + this.width;
    player.x_vel = 0; // reduce velocity to zero to ensure player stops immediately without sinking into obstacle object

    // third IF statement detects collision with TOP side of obstacle (and allows player to "stand" on top of obstacles), and re-sets "jump" ability to FALSE to allow player to jump again. Also re-sets y-velocity to avoid "rocket jump" glitch.
  } else if (isCollidingFromTop) {
    console.log('top collision', player, this);
    //debugger;
    player.y = this.y - player.height;
    player.jumping = false;
    player.y_vel = 0; // reduce velocity to zero to ensure player stops immediately without sinking into obstacle object
   
    // fourth IF statement detects collision with BOTTOM side of obstacle
  } else if (isCollidingFromBottom) {
      console.log('bottom collision', player, this);
      //debugger;
    player.y = this.y + this.height;
    player.y_vel = 0; // reduce velocity to zero to ensure player stops immediately without sinking into obstacle object
  }
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
  if (controller.space && player.jumping == false) {
    // negative y value will allow player to move up
    player.y_vel -= 60;
    // prevents player from jumping again if already jumping
    player.jumping = true;
  }
  // controls left movement
  if (controller.left) {
    player.x_vel -= 1; // negative x value to move left
  }
  // controls right movement
  if (controller.right) {
    player.x_vel += 1; // positive x value to move right
  }
  player.y_vel += 1.5; // creates gravity on each frame
  player.x += player.x_vel; // add velocity to x position
  player.y += player.y_vel; // add velocity to y position
  // friction: this slows down the player until it is at a complete stop
  player.x_vel *= 0.9;
  player.y_vel *= 0.9;

  // collision detection
  // if player is falling below the floor
  var groundHeight = ctx.canvas.height - 50; // new variable
  if (player.y > groundHeight - player.height) {
    player.jumping = false; // allow to jump again
    player.y = groundHeight; // dont fall past the floor
    player.y_vel = 0; // stop if hits the floor
  }
  // if player is going past the left or right boundaries of the window
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x > ctx.canvas.width - player.width) {
    player.x = ctx.canvas.width - player.width;
  }


  // draw background
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // draw player
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.fillRect(player.x, player.y, player.width, player.height);

 /* var xCoord = 0
  for (var i = 0; i < 10; i++) {
    new Obstacle(100, ctx.canvas.width * 1, xCoord, ctx.canvas.height, 'green');
    xCoord += (ctx.canvas.width * .1);
  } */

 new Obstacle(100, 100, 300, 525, 'blue');
 new Obstacle(100, 100, 700, 325, 'red');
 new Obstacle(100, 100, 900, 525, 'black');
 new Obstacle(100, 100, 1000, 325, 'green');
 new Obstacle(100, 100, 1400, 225, 'pink');


  // update browser when it is ready to draw again
  window.requestAnimationFrame(loop);
};
// Event listeners for key presses
window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);

// initiate loop
window.requestAnimationFrame(loop);



//TODO: Implement some kind of "parabola" for jumps to avoid making them overpowered -i.e., jump decay or "Delta-T"

//TODO: Fix glitch in which player "snaps" to floor upon reaching a certain distance to the ground

//TODO: Fix glitch where player snaps to top corners of obstacles briefly upon sliding off the top

//TODO: Fix glitch where "jump velocity" of less than 60 renders player unable to jump

//TODO: Remove collision console log commands and debugger lines once finished