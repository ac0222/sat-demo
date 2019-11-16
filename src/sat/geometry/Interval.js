import { OVERLAP_TYPES } from './constants';

class Interval {
	constructor(lo, hi) {
		this.lo = lo;
		this.hi = hi;
		if (this.hi < this.lo) {
			console.log("interval error!");
		}
	}

	getOverlapInfo(other) {
		let overlapInfo = {};
		// there are 4 types of overlap:
		if (this.lo<other.lo && this.hi>other.hi) {
			// 'this' interval completely contains the 'other' interval
			overlapInfo.otype = OVERLAP_TYPES.CONTAINER;
			overlapInfo.osize = other.hi - other.lo;
		} else if (other.lo<this.lo && other.hi>this.hi) {
			// 'other' interval completely contains the 'this' interval
			overlapInfo.otype = OVERLAP_TYPES.CONTAINED;
			overlapInfo.osize = this.hi - this.lo;
		} else if (this.hi > other.lo && this.hi < other.hi) {
			// right overlap
			overlapInfo.otype = OVERLAP_TYPES.RIGHT;
			overlapInfo.osize = this.hi - other.lo;
		} else if (other.lo < this.lo && other.hi > this.lo) {
			// left overlap
			overlapInfo.otype = OVERLAP_TYPES.LEFT;
			overlapInfo.osize = other.hi - this.lo;
		} else {
			overlapInfo = null;
		}
		return overlapInfo;
	}	
}

export default Interval;