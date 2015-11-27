var Game = function(canvasId) {
  var canvas = document.getElementById(canvasId);
  var ctx = canvas.getContext('2d');
  this.gameSize = { x: canvas.width, y: canvas.height };

  this.bodies = createInvaders(this).concat(new Player(this, this.gameSize));

  var self = this;
  loadSound("./assets/nes.wav", function(shootSound) {
    self.shootSound = shootSound;
    var tick = function() {
      self.update();
      self.draw(ctx, self.gameSize);
      requestAnimationFrame(tick);
    };

    tick();
  });
};

Game.prototype = {
  update: function() {
    var bodies = this.bodies;
    var notColliding = function(b1) {
      return bodies.filter(function(b2) { return colliding(b1, b2); }).length === 0;
    };
    var gameSize = this.gameSize;
    var onScreen = function(b) {
      return (
        b.center.x < gameSize.x && b.center.x > 0 &&
        b.center.y < gameSize.y && b.center.y > 0);
    };

    this.bodies = this.bodies.filter(notColliding).filter(onScreen);

    for (var i = 0; i < this.bodies.length; i++) {
      this.bodies[i].update();
      // TODO: FIX THIS!!
      // if (this.bodies.indexOf(Player) === 0) {
      //   alert('YOU WIN!')
      // }
      // if (this.bodies.indexOf(Player) === -1) {
      //   alert('YOU LOSE!')
      // }
    }
  },

  draw: function(ctx, gameSize) {
    ctx.clearRect(0, 0, gameSize.x, gameSize.y);
    for (var i = 0; i < this.bodies.length; i++) {
      drawRect(ctx, this.bodies[i])
    }
  },

  addBody: function(body) {
    this.bodies.push(body);
  },

  invadersBelow: function(invader) {
    return this.bodies.filter(function(b) {
      return b instanceof Invader &&
        b.center.y > invader.center.y &&
        b.center.x - invader.center.x < invader.size.x;
    }).length > 0;
  }
};

var Player = function(game, gameSize) {
  this.game = game;
  this.size = {x: 16, y: 16};
  this.center = { x: gameSize.x / 2, y: gameSize.y -this.size.x };
  this.keyboarder = new Keyboarder();
  this.firedFlag = false;
};

Player.prototype = {
  update: function() {
    if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
      this.center.x -= 2;
    } else if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
      this.center.x += 2;
    }

    if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE) && this.firedFlag === false) {
      var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.x / 2},
                              { x: 0, y: -6});
      this.game.addBody(bullet);
      this.game.shootSound.load();
      this.game.shootSound.play();
      this.firedFlag = true;
    }
    if (this.keyboarder.isUp(this.keyboarder.KEYS.SPACE)) {
      this.firedFlag = false;
    }
  }
};

var Invader = function(game, center) {
  this.game = game;
  this.size = {x: 16, y: 16};
  this.center = center;
  this.patrolX = 0;
  this.speedX = 1.3;
};

Invader.prototype = {
  update: function() {
    if (this.patrolX < 0 || this.patrolX > 432) {
      this.speedX = -(this.speedX * 1.03);
      this.center.y +=16;
    }

    this.center.x += this.speedX;
    this.patrolX += this.speedX;

    if (Math.random() > 0.993 && !this.game.invadersBelow(this)) {
      var bullet = new Bullet({ x: this.center.x, y: this.center.y + this.size.x / 2},
                              { x: Math.random() - 0.4, y: 2.4});
      this.game.addBody(bullet);
    }
  }
};

var createInvaders = function(game) {
  var invaders = [];
  for (var i = 0; i < 60; i++) {
    var x = 8 + (i % 12) * 32; // i % a cannot be divisible by
    var y = 8 + (i % 5) * 32; // i % b

    invaders.push(new Invader(game, { x: x, y: y }));
  }
  return invaders;
};

var Bullet = function(center, velocity) {
  this.size = {x: 3, y: 3 };
  this.center = center;
  this.velocity = velocity;
};

Bullet.prototype = {
  update: function() {
    this.center.x += this.velocity.x;
    this.center.y += this.velocity.y;
  }
};

var drawRect = function(ctx, body) {
  ctx.fillRect(body.center.x - body.size.x / 2,
                  body.center.y - body.size.y / 2,
                  body.size.x, body.size.y);
  ctx.fillStyle="#1651DC";
};

var Keyboarder = function() {
  var keyState = {};

  window.onkeydown = function(e) {
    keyState[e.keyCode] = true;
  };

  window.onkeyup = function(e) {
    keyState[e.keyCode] = false;
  };

  this.isDown = function(keyCode) {
    return keyState[keyCode] === true;
  };

  this.isUp = function(keyCode) {
    return keyState[keyCode] == false;
  };

  this.KEYS = { LEFT: 37, RIGHT: 39, SPACE: 32 };
};

var colliding = function(b1, b2) {
  return !(b1 === b2 ||
           b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
           b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
           b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
           b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
};

var loadSound = function(url, callback) {
  var loaded = function() {
    callback(sound);
    sound.removeEventListener('canplaythrough', loaded);
  };

  var sound = new Audio(url);
  sound.addEventListener('canplaythrough', loaded);
  sound.load();
};
