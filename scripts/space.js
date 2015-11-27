//	Define the space class.
function Space() {
	this.fps = 30;
	this.canvas = null;
	this.width = 0;
	this.width = 0;
	this.minVelocity = 10;
	this.maxVelocity = 30;
	this.stars = 150;
	this.intervalId = 0;
}

//	The main function - initializes space.
Space.prototype.initialize = function(div) {
	var self = this;

	//	Store the div.
	this.containerDiv = div;
	self.width = window.innerWidth;
	self.height = window.innerHeight;

	window.onresize = function(event) {
		self.width = window.innerWidth;
		self.height = window.innerHeight;
		self.canvas.width = self.width;
		self.canvas.height = self.height;
		self.draw();
 	}

	//	Create the canvas.
	var canvas = document.createElement('canvas');
	div.appendChild(canvas);
	this.canvas = canvas;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
};

Space.prototype.start = function() {

	//	Create the stars.
	var stars = [];
	for(var i=0; i<this.stars; i++) {
		stars[i] = new Star(Math.random()*this.width, Math.random()*this.height, Math.random()*3+1,
		 (Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
	}
	this.stars = stars;

	var self = this;
	//	Start the timer.
	this.intervalId = setInterval(function() {
		self.update();
		self.draw();
	}, 1000 / this.fps);
};

Space.prototype.stop = function() {
	clearInterval(this.intervalId);
};

Space.prototype.update = function() {
	var dt = 1 / this.fps;

	for(var i=0; i<this.stars.length; i++) {
		var star = this.stars[i];
		star.y += dt * star.velocity;
		//	If the star has moved from the bottom of the screen, spawn it at the top.
		if(star.y > this.height) {
			this.stars[i] = new Star(Math.random()*this.width, 0, Math.random()*3+1,
		 	(Math.random()*(this.maxVelocity - this.minVelocity))+this.minVelocity);
		}
	}
};

Space.prototype.draw = function() {

	//	Get the drawing context.
	var ctx = this.canvas.getContext("2d");

	//	Draw the background.
 	ctx.fillStyle = '#040F1A';
	ctx.fillRect(0, 0, this.width, this.height);

	//	Draw stars.
	ctx.fillStyle = '#86A7F3';
	for(var i=0; i<this.stars.length;i++) {
		var star = this.stars[i];
		ctx.fillRect(star.x, star.y, star.size, star.size);
	}
};

function Star(x, y, size, velocity) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.velocity = velocity;
};

//  Create space.
var container = document.getElementById('space');
var space = new Space();
space.initialize(container);
space.start();
