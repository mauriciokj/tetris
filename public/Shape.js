Tetris.Shape = function () {
  this.type = null;
  this.orientation = null;
  this.color = null;

  this.centerX = null;
  this.centerY = null;

  this.shape = null;
  this.blocks = [];

  this.isTweening = false;
  this.tweenCounter = 0;

  this.tempCounter = 0;
};

Tetris.Shape.prototype = {

  NUM_BLOCKS_IN_SHAPE: 4,
  NUM_SHAPE_TYPES: 7,
  NUM_ORIENTATIONS: 4,

  // Shape type
  I: 0,
  J: 1,
  L: 2,
  O: 3,
  S: 4,
  Z: 5,
  T: 6,

  randomizeShape: function () {

    this.type = Math.floor(Math.random() * this.NUM_SHAPE_TYPES);
    this.orientation = Math.floor(Math.random() * this.NUM_ORIENTATIONS);
    this.color = Math.floor(Math.random() * Tetris.NUM_COLORS);

    this.initBlocks();
  },

  initBlocks: function () {

    var i;
    for(i = 0; i < this.NUM_BLOCKS_IN_SHAPE; i++) {
      this.blocks[i] = new Tetris.Block();
    }
  },

  preview: function () {

    //TODO
  },

  clearPreview: function () {

    //TODO
  },

  activate: function () {
    this.shape = Tetris.shapes[this.type];
    this.centerX = this.shape.orientation[this.orientation].startingLocation.x;
    this.centerY = this.shape.orientation[this.orientation].startingLocation.y;

    var i, newX, newY;

    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.shape.orientation[this.orientation].blockPosition[i].x;
      newY = this.centerY + this.shape.orientation[this.orientation].blockPosition[i].y;
      this.blocks[i].makeBlock(newX, newY, this.color);
    }
  },

  clearActive: function () {

    this.type = null;
    this.orientation = null;
    this.color = null;

    this.centerX = null;
    this.centerY = null;

    this.blocks = null;
  },

  placeShapeInBoard: function () {

    var i, block;

    for(i = 0; i < this.blocks.length; i++) {
      block = this.blocks[i];
      Tetris.board[block.y][block.x] = this.blocks[i];
    }
  },

  isOnBoard: function (x, y) {

    if(x >= 0 && y >= 0 &&
       x < Tetris.BOARD_WIDTH && y < Tetris.BOARD_HEIGHT) {
      return true;
    }
    return false;
  },

  isOccupied: function (x, y) {

    if(Tetris.board[y][x] === null) {
      return false;
    }
    return true;
  },

  canMoveShape: function (direction) {

    var i, newX, newY;

    for(i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Tetris.DOWN:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y + 1;
          break;
        case Tetris.LEFT:
          newX = this.blocks[i].x - 1;
          newY = this.blocks[i].y;
          break;
        case Tetris.RIGHT:
          newX = this.blocks[i].x + 1;
          newY = this.blocks[i].y;
          break;
      }
      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  },

  moveShape: function (direction) {

    if(!this.canMoveShape(direction)){
      throw "Cannot move active shape in direction: " + direction;
    }

    var i, newX, newY;

    // Move the Shape's blocks
    for(i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Tetris.DOWN:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y + 1;
          break;
        case Tetris.LEFT:
          newX = this.blocks[i].x - 1;
          newY = this.blocks[i].y;
          break;
        case Tetris.RIGHT:
          newX = this.blocks[i].x + 1;
          newY = this.blocks[i].y;
          break;
      }
     this.blocks[i].moveBlock(newX, newY);
    }

    // Update the Shape's center
    switch(direction) {
      case Tetris.DOWN:
        this.centerX += 0;
        this.centerY += 1;
        break;
      case Tetris.LEFT:
        this.centerX += -1;
        this.centerY += 0;
        break;
      case Tetris.RIGHT:
        this.centerX += 1;
        this.centerY += 0;
        break;
    }
  },

  canRotate: function () {

    if (this.isTweening) {
      return false;
    }

    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % this.NUM_ORIENTATIONS;

    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.shape.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.shape.orientation[newOrientation].blockPosition[i].y;

      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  },

  rotate: function () {

    if(!this.canRotate()) {
      throw "Cannot rotate active shape";
    }

    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % this.NUM_ORIENTATIONS;
    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.shape.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.shape.orientation[newOrientation].blockPosition[i].y;
      this.blocks[i].moveBlock(newX, newY);
    }
    this.orientation = newOrientation;
    this.isTweening = true;
  },

  updateTween: function () {

    if (this.tweenCounter > 10) {
      this.isTweening = false;
      this.tweenCounter = 0;
    }
    this.tweenCounter++;
  }
};
