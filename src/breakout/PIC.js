// player input controller
class PIC {
	constructor(document) {
		this.leftPressed = false;
		this.rightPressed = false;
		this.upPressed = false;
		this.downPressed = false;
		this.rotateClockwise = false;
		this.rotateAntiClockwise = false;

		let currentScope = this;
		document.addEventListener("keydown", 
			function(e) {
				currentScope.keyDownHandler(e)
			}
		);
		document.addEventListener("keyup", 
			function(e) {
				currentScope.keyUpHandler(e)
			}
		);
	}
	keyDownHandler(e) {
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
		if (e.keyCode == 90) { // z key
			this.rotateAntiClockwise = true;
		}
		if (e.keyCode == 88) { // x key
			this.rotateClockwise = true;
		}
	}
	
	keyUpHandler(e) {
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
		if (e.keyCode == 90) { // z key
			this.rotateAntiClockwise = false;
		}
		if (e.keyCode == 88) { // x key
			this.rotateClockwise = false;
		}
	}
}


export default PIC;