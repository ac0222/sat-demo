var Interval = function(lo, hi) {
	this.lo = lo;
	this.hi = hi;
	if (this.hi < this.lo) {
		console.log("interval error!");
	}
}

Interval.prototype.getOverlapInfo = function(other) {
	var overlapInfo = {};
	// there are 4 types of overlap:
	if (this.lo<other.lo && this.hi>other.hi) {
		// 'this' interval completely contains the 'other' interval
		overlapInfo.otype = "container";
		overlapInfo.osize = other.hi - other.lo;
	} else if (other.lo<this.lo && other.hi>this.hi) {
		// 'other' interval completely contains the 'this' interval
		overlapInfo.otype = "contained";
		overlapInfo.osize = this.hi - this.lo;
	} else if (this.hi > other.lo && this.hi < other.hi) {
		// right overlap
		overlapInfo.otype = "right";
		overlapInfo.osize = this.hi - other.lo;
	} else if (other.lo < this.lo && other.hi > this.lo) {
		// left overlap
		overlapInfo.otype = "left";
		overlapInfo.osize = other.hi - this.lo;
	} else {
		overlapInfo = null;
	}
	return overlapInfo;
}