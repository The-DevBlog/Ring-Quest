'use strict';
var ctx;
var controller;
var character;
var loop;
var spriteSheet, floor, background, ring, platform;
var spriteSize = 75;
var drawPlayer;
var TILE_SIZE = 100;

var jumpSound = new Audio('./sounds/jump.mp3');
jumpSound.volume = 0.5;

loadImages(); // preload images

ctx = document.getElementById('myCanvas').getContext('2d');

var Animate = function (delay, frameSet) {
  this.delay = delay; // delay between frames
  this.frame = 0;
  this.frameIdx = 0; // individual frame index
  this.count = 0;
  // left walking, right walking and standing still frames
  this.frameSet = frameSet;
};

Animate.prototype = {
  // change which frameset to display
  change: function (frameSet, delay = 15) {
    // if the current frameset changes, then change the following
    // properties
    if (this.frameSet !== frameSet) {
      this.count = 0;
      this.delay = delay;
      this.frameSet = frameSet;
      this.frameIdx = 0;
      this.frame = this.frameSet[this.frameIdx];
    }
  },

  // invoke on every game cycle
  update: function () {
    this.count++; // tracks game engine iterations
    // reset the count if it is equal to or greater than the delay, this enables the delay between frames
    if (this.count >= this.delay) {
      this.count = 0;

      // NOTE - the following if statement is the same as the above statement
      if (this.frameIdx === this.frameSet.length - 1) {
        this.frameIdx = 0;
      } else if (this.frameSet.length === 1) {
        this.frameIdx = 0;
      } else {
        this.frameIdx += 1;
      }
      this.frame = this.frameSet[this.frameIdx];
    }
  }
};

// an object to display the character
character = {
  height: 75,
  width: 75,
  jumping: true, // true if jumping, false if not
  x: 25,
  x_vel: 0, // speed left and right
  y: 0,
  y_vel: 0,
  animate: new Animate()
};

// an object to represent player sprite sheet and define frames
spriteSheet = {
  frameSet: [
    [0, 1], // standing still
    [2, 3], // walking right
    [4, 5], // walking left
    [6] // jumping
  ],
  image: new Image(),
  image2: new Image()
};

function Obstacle(height, width, x, y) {
  this.height = height;
  this.width = width;
  this.x = x;
  this.y = y;

  // OBSTACLE COLLISION DETECTION - Note: Collision properties are a part of the "Obstacle" constructor, and therefore it is the Obstacles that check for character collision

  // Variables to determine generally which "side" of an obstacle a character is on - with small margins added/subtracted to serve as measures of "forgiveness" to allow collision properties some leeway to trigger
  var isCharacterOnLeft = character.x + character.width < this.x + 20;
  var isCharacterOnRight = character.x > this.x + this.width - 20;
  var isCharacterAbove = character.y + character.height < this.y + 20;
  var isCharacterBelow = character.y > this.height + this.y - 40;

  // Variables to determine if actual "collision"/overlap of obstacle/character boundaries takes place


  // left side collision variable - determines if actual collision is taking place between character/obstacle
  var isRightSideOfCharacterOverlappingLeftSideOfObstacle = character.x + character.width > this.x;

  // right side collision variable - determines if actual collision is taking place between character/obstacle
  var isLeftSideOfCharacterOverlappingRightSideOfObstacle = character.x < this.x + this.width;

  // top side collision variable - determines if actual collision is taking place between character/obstacle
  var isBottomOfCharacterOverlappingTopOfObstacle = character.y + character.height > this.y;

  // bottom side collision variable - determines if actual collision is taking place between character/obstacle
  var isTopOfCharacterOverlappingBottomOfObstacle = character.y < this.y + this.height;

  // Boolean variable to ensure that character is colliding with obstacle on obstacle left within the "height" range of obstacle
  var isCollidingFromLeft = isRightSideOfCharacterOverlappingLeftSideOfObstacle &&
    isTopOfCharacterOverlappingBottomOfObstacle &&
    isBottomOfCharacterOverlappingTopOfObstacle &&
    isCharacterOnLeft;

  // Boolean variable to ensure that character is colliding with obstacle on obstacle right within the "height" range of obstacle
  var isCollidingFromRight = isLeftSideOfCharacterOverlappingRightSideOfObstacle &&
    isTopOfCharacterOverlappingBottomOfObstacle &&
    isBottomOfCharacterOverlappingTopOfObstacle &&
    !isCharacterAbove &&
    isCharacterOnRight;

  // Boolean variable to ensure that character is colliding with obstacle on obstacle top within the "width" range of obstacle
  var isCollidingFromTop = isRightSideOfCharacterOverlappingLeftSideOfObstacle &&
    isLeftSideOfCharacterOverlappingRightSideOfObstacle &&
    isBottomOfCharacterOverlappingTopOfObstacle &&
    isCharacterAbove;

  // Boolean variable to ensure that character is colliding with obstacle on obstacle bottom within the "width" range of obstacle
  var isCollidingFromBottom = isTopOfCharacterOverlappingBottomOfObstacle &&
    isCharacterBelow &&
    isLeftSideOfCharacterOverlappingRightSideOfObstacle &&
    isRightSideOfCharacterOverlappingLeftSideOfObstacle;

  // End game variable
  var isTouchingRing = (character.x + character.width > MAP.width - 80 && character.y < 600) && (character.x + character.width > MAP.width - 80 && character.y > 400);

  // first IF statement detects collision with LEFT side of obstacle is TRUE
  if (isCollidingFromLeft) {
    //console.log('left collision', character, this);
    //debugger;
    character.x = this.x - character.width; // set it back to LEFT of obstacle
    character.x_vel = 0; // reduce velocity to zero to ensure character stops immediately without sinking into obstacle object

    // second IF statement detects collision with RIGHT side of obstacle is TRUE
  } else if (isCollidingFromRight) {
    // console.log('right collision', character, this);
    // debugger;
    character.x = this.x + this.width;
    character.x_vel = 0; // reduce velocity to zero to ensure character stops immediately without sinking into obstacle object

    // third IF statement detects collision with TOP side of obstacle (and allows character to "stand" on top of obstacles), and re-sets "jump" ability to FALSE to allow character to jump again. Also re-sets y-velocity to avoid "rocket jump" glitch.
  } else if (isCollidingFromTop) {
    //console.log('top collision', character, this);
    //debugger;
    character.y = this.y - character.height;
    character.jumping = false;
    character.y_vel = 0; // reduce velocity to zero to ensure character stops immediately without sinking into obstacle object
    controller.space = false;
    // fourth IF statement detects collision with BOTTOM side of obstacle
  } else if (isCollidingFromBottom) {
    //console.log('bottom collision', character, this);
    //debugger;
    character.y = this.y + this.height;
    character.y_vel = 0; // reduce velocity to zero to ensure character stops immediately without sinking into obstacle object
  } else if (isTouchingRing) {
    alert('You win!'); // this alert and below code ensures that the browser will reload and only run the alert once when winning the game
    document.location.reload();
    clearInterval(interval);
  }
}

// Controller object to control the keyboard input
controller = {
  left: false,
  right: false,
  space: false,
  keyListener: function (event) {
    // if key is pressed down, keyState will equal true. If it is not pressed, keyState will get false
    var keyState = (event.type === 'keydown') ? true : false;
    // switch statement to determine which key is being pressed. This could have been done with an 'if.. else if' statement, but the switch statement is a much cleaner way to handle this. Also, each key on a keyboard has a specific 'keyCode' attached to it. keyCode is a built in JavaScript variable.
    switch (event.keyCode) {
      case 65: // "A" key to go left
        controller.left = keyState;
        break;
      case 87: // "W" key to jump
        controller.space = keyState;
        break;
      case 68: // "D" key to go right
        controller.right = keyState;
    }
  }
};

loop = function () {

  // controls jumping movement
  if (controller.space && character.jumping === false) {
    // negative y value will allow character to move up
    character.y_vel -= 60;
    // prevents character from jumping again if already jumping
    character.jumping = true;
    jumpSound.play();
    //document.getElementById("sounds/jump.mp3").play();
  }

  // if character is jumping, display jumping sprite set
  if (character.y_vel < 0) {
    character.animate.change(spriteSheet.frameSet[3]);
  }

  // if character is standing still, display standing still sprite set
  if (!controller.left && !controller.right && character.jumping === false) {
    character.animate.change(spriteSheet.frameSet[0], 30);
  }

  // controls left movement
  if (controller.left) {
    character.animate.change(spriteSheet.frameSet[2], 15); // animate sprite with left-facing movement frames
    character.x_vel -= 0.5; // negative x value to move left
  }

  // controls right movement
  if (controller.right) {
    character.animate.change(spriteSheet.frameSet[1], 15); // animate sprite with right-facing movement frames
    character.x_vel += 0.5; // positive x value to move right
  }
  character.y_vel += 1.5; // creates gravity on each frame
  character.x += character.x_vel; // add velocity to x position
  character.y += character.y_vel; // add velocity to y position

  // friction: this slows down the character until it is at a complete stop
  character.x_vel *= 0.9;
  character.y_vel *= 0.9;

  // if character is going past the left or right boundaries of the window
  if (character.x < 0) {
    character.x = 0;
  } else if (character.x > ctx.canvas.width - character.width) {
    character.x = ctx.canvas.width - character.width;
  }

  // draw background
  renderTiles();

  // Invoke function to draw the player character
  drawPlayer();

  // update animation
  character.animate.update();

  // update browser when it is ready to draw again
  window.requestAnimationFrame(loop);
};

// draw the player to the screen
drawPlayer = function () {
  // cut out the sprite in chunks to display the correct frames
  ctx.drawImage(spriteSheet.image, character.animate.frame * spriteSize, 0, spriteSize, spriteSize, Math.floor(character.x), Math.floor(character.y), spriteSize, spriteSize);
};

// start the animation loop AFTER the images have loaded
spriteSheet.image.addEventListener('load', function () {
  window.requestAnimationFrame(loop);
});

spriteSheet.image.src = './sprites/character75x75.png';

// Holds info about the map, including tile indices array
var MAP = {
  columns: 32,
  rows: 28,
  height: 28 * TILE_SIZE,
  width: 32 * TILE_SIZE,

  // Used during image scaling to ensure rendered image isn't skewed
  width_height_ratio: 32 / 28,

  // tiles in this array correspond to those in TILES object
  tiles: [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
    0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2,
    0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2,
    0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0,
    0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0,
    0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 2, 2,
    0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 2,
    0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0,
    0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0,
    2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0,
    2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,
  ]
};

// load images to the page before the game starts
function loadImages() {
  floor = new Image();
  background = new Image();
  ring = new Image();
  platform = new Image();

  floor.src = './tile-images/floorpath.png';
  background.src = './tile-images/plainbackgroundtile.png';
  ring.src = './tile-images/ring.png';
  platform.src = './tile-images/platform.png';
}

// Renders tiles to buffer
function renderTiles() {
  var map_index = 0;

  // increment by actual TILE_SIZE to avoid multiplying on every iteration
  for (var top = 0; top < MAP.height; top += TILE_SIZE) {
    for (var left = 0; left < MAP.width; left += TILE_SIZE) {

      // if statement to draw the correct sprite to the correct idx position on the tile map
      if (MAP.tiles[map_index] === 0) {

        // draw background
        ctx.drawImage(background, left, top);

      } else if (MAP.tiles[map_index] === 2) {

        // draw platform
        ctx.drawImage(platform, left, top);

        new Obstacle(100, 100, left, top);

      } else if (MAP.tiles[map_index] === 3) {

        // draw ring
        ctx.drawImage(ring, left, top);
        //new Obstacle(100, 100, left, top);

      } else if (MAP.tiles[map_index] === 1) {

        // draw floor
        ctx.drawImage(floor, left, top);
      } else if (MAP.tiles[map_index] === 4) {

        ctx.drawImage(floor, left, top);
        new Obstacle(100, 100, left, top);
      }

      map_index++;
    }
  }
}

// Setting the initial height and width of the DISPLAY canvas.
ctx.canvas.width = MAP.width;
ctx.canvas.height = MAP.height;

window.addEventListener('keydown', controller.keyListener);
window.addEventListener('keyup', controller.keyListener);