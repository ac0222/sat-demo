var Point2D = function(x, y) {
	this.x = x;
	this.y = y;
}

Point2D.prototype.getDistance = function(p2) {
	var dx = this.x - p2.x;
	var dy = this.y - p2.y;
	return Math.sqrt(dx*dx + dy*dy);
}

Point2D.prototype.toVector = function() {
	return new Vector2D(this.x, this.y, "cartesian");
}

Point2D.prototype.equals = function(other) {
	if (Math.abs(this.x - other.x)<EPS && 
		Math.abs(this.y - other.y)<EPS) {
		return true;
	} else {
		return false;
	}
}