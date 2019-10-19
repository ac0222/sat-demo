// Breakout game main container
import {
	WIN_FLAG,
	LOSS_FLAG,
	REFRESH_RATE
} from './constants';

class BreakoutGame {
	constructor(world, canvas) {
		this.intervalID = null;
		this.world = world;
		this.canvas = canvas;
	}

	// this is the game's main loop
	runGame() {
		// keep hold of current scope
		var currentScope = this;
		var lastFrame = performance.now();
		var deltaT = null;
		var retval = null;

		this.intervalID = setInterval(
			function() {
				// keep track of time elapsed between frames
				deltaT = performance.now() - lastFrame;
				lastFrame = performance.now();
				retval = currentScope.processFrame(deltaT); 
				if (retval == WIN_FLAG) {
					clearInterval(currentScope.intervalID);
					currentScope.world.displayWinScreen(currentScope.canvas);
				}
				if (retval == LOSS_FLAG) {
					clearInterval(currentScope.intervalID);
					currentScope.world.displayLossScreen(currentScope.canvas);
				}
			}
			, (1/REFRESH_RATE)*1000
		);
	}

	processFrame(deltaT) {
		var retval = null;
		retval = this.world.update(deltaT);
		this.world.render(this.canvas);
		return retval;
	}

	stopGame() {
		clearInterval(this.intervalID);
	}

	resetGame () {
		clearInterval(this.intervalID);
		this.world.init();
		this.world.render(this.canvas);
	}
}

export default BreakoutGame;
