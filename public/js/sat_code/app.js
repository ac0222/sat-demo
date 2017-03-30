// main app for breakout game

window.onload = function() {
	// grab the necessary elements used to display the game, i.e.
	// the game canvas and the ui canvas
	var gameCanvas = document.getElementById('breakout_canvas');
	//var uiCanvas = document.getElementById('ui_canvas');
	// prepare the listeners for user input
	var pic = new PIC(document);
	// create the world
	var breakoutWorld = new World(pic);
	// put it inside the game container
	var breakoutNG = new BreakoutGame(breakoutWorld, gameCanvas);
	
	// some ui buttons 
	
	var startButton = document.getElementById('start_game_btn');
	var stopButton = document.getElementById('stop_game_btn');
	var resetButton = document.getElementById('reset_game_btn');

	startButton.addEventListener("click", function() {
		breakoutNG.runGame();
	})

	stopButton.addEventListener("click", function() {
		breakoutNG.stopGame();
	})

	resetButton.addEventListener("click", function() {
		breakoutNG.resetGame();
	})
	
	// prevent arrow-key scrollinng which interferes with gameplay
	window.addEventListener("keydown", function(e) {
		if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false);
		
}