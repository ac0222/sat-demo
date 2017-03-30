// actual program 
window.onload = function() {

	var canvas = document.getElementById("my_canvas");
	var ctx = canvas.getContext('2d');
	canvas.style.background = "#eee";
	canvas.setAttribute("width", WORLD_WIDTH);
	canvas.setAttribute("height", WORLD_HEIGHT);
	
	var pic = new PIC(document);
	var world = new World(pic);
	var lastFrame = null;


	function mainLoop() {
		/*
		var rect1 = new Rectangle(20, 10,
			new Point2D(100, 100),
			0,
			new Vector2D(0, 0, "cartesian"), 0, "bounce",
			"green", "purple");

		var tr1 = new Triangle(20,
			new Point2D(100, 100),
			0,
			new Vector2D(0, 0, "cartesian"), 0, "static",
			"green", "purple");
		
		var circ1 = new Circle(20,
			new Point2D(100, 100),
			0,
			new Vector2D(0, 0, "cartesian"), 0, "static",
			"green", "purple");	

		console.log(rect1.equals(rect1));
		*/
		/*
		var i1 = new Interval(13, 100);
		var i2 = new Interval(1, 60);
		console.log(i1.getOverlapInfo(i2));
		*/
		/*
		var v1 = new Vector2D(1, 0, "cartesian");
		console.log(v1.extend(5));
		console.log(v1.withdraw(5));		
		*/
		/*
		var rect = new Rectangle(20, 50,
			new Point2D(150, 150),
			0,
			"blue", "purple");
		rect.render(ctx);

		var circ = new Circle(20,
			new Point2D(150, 219),
			0,
			"blue", "purple");
		circ.render(ctx);	
		console.log(Shape.pcCollisionDetection(rect, circ));	
	*/
		/*
		var tr = new Triangle(20,
			new Point2D(135, 120),
			0,
			"green", "red");
		tr.render(ctx);
		//console.log(Shape.getEdgeVectors(tr.getVertices()));
		//console.log(Shape.getEdgeOrthogonals(tr.getVertices()));

		var rect = new Rectangle(20, 50,
			new Point2D(150, 150),
			0,
			"blue", "purple");
		rect.render(ctx);

		//console.log(Shape.getEdgeVectors(rect.getVertices()));
		//console.log(Shape.getEdgeOrthogonals(rect.getVertices()));

		var mtv = Shape.ppCollisionDetection(tr, rect);
		console.log(tr.centre);
		if (mtv == null) {
			console.log("no collision");
		} else {
			console.log(mtv);
			Shape.stickyCollision(tr, rect, mtv);
		}

		console.log(tr.centre);

		tr.render(ctx);
		*/
		
		requestAnimationFrame(mainLoop);
		deltaT = performance.now() - lastFrame;
		lastFrame = performance.now();
		world.update(deltaT);
		world.render(canvas);
		
		
		
	}

	lastFrame = performance.now();
	mainLoop();
}

