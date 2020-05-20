'use strict';
var ctx;
var controller;
var character;
var loop;
var spriteSheet;
var spriteSize = 100;
var drawPlayer;

ctx = document.getElementById('myCanvas').getContext('2d');
ctx.canvas.width = innerWidth;
ctx.canvas.height = 725;






// an object to display the character
character = { // character sprite aka (RECTANGLE)
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
  //console.log('checking for COLLISION', character);

  // OBSTACLE COLLISION DETECTION - Note: Collision properties are a part of the "Obstacle" constructor, and therefore it is the Obstacles that check for character collision
 
  // Variables to determine generally which "side" of an obstacle a character is on - with small margins added/subtracted to serve as measures of "forgiveness" to allow collision properties some leeway to trigger
  var ischaracterOnLeft = character.x + character.width < this.x + 10;
  var ischaracterOnRight = character.x > this.x + this.width - 10;
  var ischaracterAbove = character.y + character.height < this.y + 15;
  var ischaracterBelow = character.y > this.height + this.y - 10;

  // Variables to determine if actual "collision"/overlap of obstacle/character boundaries takes place
  var isRightSideOfcharacterOverlappingLeftSideOfObstacle = character.x + character.width > this.x; // left side collision variable - determines if actual collision is taking place between character/obstacle
  var isLeftSideOfcharacterOverlappingRightSideOfObstacle = character.x - character.width < this.x + this.width - character.width; // right side collision variable - determines if actual collision is taking place between character/obstacle
  var isBottomOfcharacterOverlappingTopOfObstacle = character.y + character.height > this.y; // top side collision variable - determines if actual collision is taking place between character/obstacle
  var isTopOfcharacterOverlappingBottomOfObstacle = character.y < this.y + this.height; // bottom side collision variable - determines if actual collision is taking place between character/obstacle

// Boolean variable to ensure that character is colliding with obstacle on obstacle left within the "height" range of obstacle
  var isCollidingFromLeft = isRightSideOfcharacterOverlappingLeftSideOfObstacle &&
    isTopOfcharacterOverlappingBottomOfObstacle &&
    isBottomOfcharacterOverlappingTopOfObstacle &&
    ischaracterOnLeft;

// Boolean variable to ensure that character is colliding with obstacle on obstacle right within the "height" range of obstacle
  var isCollidingFromRight = isLeftSideOfcharacterOverlappingRightSideOfObstacle &&
    isTopOfcharacterOverlappingBottomOfObstacle &&
    isBottomOfcharacterOverlappingTopOfObstacle &&
    ischaracterOnRight;

// Boolean variable to ensure that character is colliding with obstacle on obstacle top within the "width" range of obstacle
  var isCollidingFromTop = isRightSideOfcharacterOverlappingLeftSideOfObstacle &&
    isLeftSideOfcharacterOverlappingRightSideOfObstacle &&
    isBottomOfcharacterOverlappingTopOfObstacle &&
    ischaracterAbove;

// Boolean variable to ensure that character is colliding with obstacle on obstacle bottom within the "width" range of obstacle
  var isCollidingFromBottom = isTopOfcharacterOverlappingBottomOfObstacle &&
    ischaracterBelow &&
    isLeftSideOfcharacterOverlappingRightSideOfObstacle &&
    isRightSideOfcharacterOverlappingLeftSideOfObstacle;

 // first IF statement detects collision with LEFT side of obstacle is TRUE
  if (isCollidingFromLeft) {
    console.log('left collision', character, this);
    //debugger;
    character.x = this.x - character.width; // set it back to LEFT of obstacle
    character.x_vel = 0; // reduce velocity to zero to ensure character stops immediately without sinking into obstacle object

  // second IF statement detects collision with RIGHT side of obstacle is TRUE
  } else if (isCollidingFromRight) {
    console.log('right collision', character, this);
    //debugger;
    character.x = this.x + this.width;
    character.x_vel = 0; // reduce velocity to zero to ensure character stops immediately without sinking into obstacle object

    // third IF statement detects collision with TOP side of obstacle (and allows character to "stand" on top of obstacles), and re-sets "jump" ability to FALSE to allow character to jump again. Also re-sets y-velocity to avoid "rocket jump" glitch.
  } else if (isCollidingFromTop) {
    console.log('top collision', character, this);
    //debugger;
    character.y = this.y - character.height;
    character.jumping = false;
    character.y_vel = 0; // reduce velocity to zero to ensure character stops immediately without sinking into obstacle object
   
    // fourth IF statement detects collision with BOTTOM side of obstacle
  } else if (isCollidingFromBottom) {
      console.log('bottom collision', character, this);
      //debugger;
    character.y = this.y + this.height;
    character.y_vel = 0; // reduce velocity to zero to ensure character stops immediately without sinking into obstacle object
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
  if (controller.space && character.jumping == false) {
    // negative y value will allow character to move up
    character.y_vel -= 60;
    // prevents character from jumping again if already jumping
    character.jumping = true;
  }
  // controls left movement
  if (controller.left) {
    character.x_vel -= 1; // negative x value to move left
  }
  // controls right movement
  if (controller.right) {
    character.x_vel += 1; // positive x value to move right
  }
  character.y_vel += 1.5; // creates gravity on each frame
  character.x += character.x_vel; // add velocity to x position
  character.y += character.y_vel; // add velocity to y position
  // friction: this slows down the character until it is at a complete stop
  character.x_vel *= 0.9;
  character.y_vel *= 0.9;

  // collision detection
  // if character is falling below the floor
  var groundHeight = ctx.canvas.height - 50; // new variable
  if (character.y > groundHeight - character.height) {
    character.jumping = false; // allow to jump again
    character.y = groundHeight; // dont fall past the floor
    character.y_vel = 0; // stop if hits the floor
  }
  // if character is going past the left or right boundaries of the window
  if (character.x < 0) {
    character.x = 0;
  } else if (character.x > ctx.canvas.width - character.width) {
    character.x = ctx.canvas.width - character.width;
  }


  // draw background
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // draw character
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.fillRect(character.x, character.y, character.width, character.height);

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

//TODO: Fix glitch in which character "snaps" to floor upon reaching a certain distance to the ground

//TODO: Fix glitch where character snaps to top corners of obstacles briefly upon sliding off the top

//TODO: Fix glitch where "jump velocity" of less than 60 renders character unable to jump

//TODO: Remove collision console log commands and debugger lines once finished