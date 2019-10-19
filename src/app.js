// main app for breakout game

import PIC from './breakout/PIC';
import World from './breakout/World';
import BreakoutGame from './breakout/BreakoutGame';

window.onload = function() {
	// grab the necessary elements used to display the game, i.e.
	// the game canvas and the ui canvas
	let gameCanvas = document.getElementById('breakout_canvas');
	//var uiCanvas = document.getElementById('ui_canvas');
	// prepare the listeners for user input
	let pic = new PIC(document);
	// create the world
	let breakoutWorld = new World(pic);
	// put it inside the game container
	let breakoutNG = new BreakoutGame(breakoutWorld, gameCanvas);
	
	// some ui buttons 
	
	let startButton = document.getElementById('start_game_btn');
	let stopButton = document.getElementById('stop_game_btn');
	let resetButton = document.getElementById('reset_game_btn');

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
