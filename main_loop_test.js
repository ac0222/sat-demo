window.onload = function() {
	var lastFrame = performance.now();
	setInterval(
		function() {
			var deltaT = performance.now() - lastFrame;
			lastFrame = performance.now();
			main(deltaT);
		}
	, (1/60)*1000);
}

function main(deltaT) {
	console.log("time elapsed was: " + deltaT + " ms");
}