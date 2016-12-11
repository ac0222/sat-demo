// shape super class
var Shape = function(x, y, c1, c2) {
	this.x = x;
	this.y = y;
	this.c1 = c1;
	this.c2 = c2;
	this.activeColour = this.c1;
}

Shape.prototype.enterCollisionState = function() {
	this.activeColour = this.c2;
}

Shape.prototype.exitCollisionState = function() {
	this.activeColour = this.c1;
}

// rectangle class
var Rectangle = function(height, width, x, y, c1, c2) {
	Shape.call(this, x, y, c1, c2);
	this.height = height;
	this.width = width;
}

// inheritance
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.render = function(ctx) {
	ctx.beginPath()
	ctx.rect(this.x, this.y, this.width, this.height);
	ctx.fillStyle = this.activeColour;
	ctx.fill();
	ctx.closePath();
}

// collision between 2 rectangles
Rectangle.prototype.detectCollision = function(rect2) {
	if (this.x < rect2.x + rect2.width &&
		this.x + this.width > rect2.x &&
		this.y < rect2.y + rect2.height &&
		this.y + this.height > rect2.y) {
		return true;
	} else {
		return false;
	}
}

// circle class
var Circle = function(radius, x, y, c1, c2) {
	Shape.call(this, x, y, c1, c2);
	this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.render = function(ctx) {
	ctx.beginPath();
	ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
	ctx.fillStyle = this.activeColour;
	ctx.fill();
	ctx.closePath();
}

// collision between 2 circles
Circle.prototype.detectCollision = function(circ2) {
	var dx = this.x - circ2.x;
	var dy = this.y - circ2.y;
	var distance = Math.sqrt(dx*dx + dy*dy);
	if (distance < this.radius + circ2.radius) {
		return true;
	} else {
		return false;
	}
}

// player
var Player = function(shape, speed, pic) {
	this.shape = shape;
	this.speed = speed;
	this.pic = pic
}

Player.prototype.update = function() {
	if (this.pic.leftPressed == true) {
		this.shape.x -= Math.abs(this.speed)
	}
	if (this.pic.rightPressed == true) {
		this.shape.x += Math.abs(this.speed)
	}
	if (this.pic.upPressed == true) {
		this.shape.y -= Math.abs(this.speed)
	}
	if (this.pic.downPressed == true) {
		this.shape.y += Math.abs(this.speed)
	}
}

// player input controller
var PIC = function(document) {
	this.leftPressed = false;
	this.rightPressed = false;
	this.upPressed = false;
	this.downPressed = false;
	var currentScope = this;
	document.addEventListener("keydown", function(e) {
		currentScope.keyDownHandler(e)}
		);
	document.addEventListener("keyup", function(e) {
		currentScope.keyUpHandler(e)});
}

PIC.prototype.keyDownHandler = function(e) {
	if (e.keyCode == 37) { // left arrow
		this.leftPressed = true
	}
	if (e.keyCode == 38) { // up arrow
		this.upPressed = true
	}
	if (e.keyCode == 39) { // right arrow
		this.rightPressed = true;
	}
	if (e.keyCode == 40) { // down arrow
		this.downPressed = true;
	}
}

PIC.prototype.keyUpHandler = function(e) {
	if (e.keyCode == 37) { // left arrow
		this.leftPressed = false
	}
	if (e.keyCode == 38) { // up arrow
		this.upPressed = false
	}
	if (e.keyCode == 39) { // right arrow
		this.rightPressed = false;
	}
	if (e.keyCode == 40) { // down arrow
		this.downPressed = false;
	}
}


// actual program 
window.onload = function() {
	var canvas = document.getElementById("my_canvas");
	var ctx = canvas.getContext('2d');
	canvas.style.background = "#eee";
	var shapes = initShapes();
	var pic = new PIC(document);
	var player = new Player(shapes[0], 0.5, pic);

	function mainLoop() {
		requestAnimationFrame(mainLoop);
		// update player
		player.update();
		// clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// render shapes
		for (var i = 0; i < shapes.length; i++) {
			if (i != 0) {
				if (player.shape.detectCollision(shapes[i]) == true) {
					shapes[i].enterCollisionState();
				} else {
					shapes[i].exitCollisionState();
				}
			}
			shapes[i].render(ctx);
		}
	}

	mainLoop();
}

function initShapes() {
	var shapes = [];
	/*
	shapes[0] = new Rectangle(30, 30, 5, 5, "green", "red");
	shapes[1] = new Rectangle(10, 20, 50, 50, "green", "red");
	shapes[2] = new Rectangle(5, 30, 100, 100, "green", "red");
	shapes[3] = new Rectangle(80, 80, 300, 300, "green", "red");
*/
	shapes[0] = new Circle(30, 5, 5, "green", "red");
	shapes[1] = new Circle(10, 50, 50, "green", "red");
	shapes[2] = new Circle(5, 100, 100, "green", "red");
	shapes[3] = new Circle(80, 300, 300, "green", "red");
	return shapes;
}

