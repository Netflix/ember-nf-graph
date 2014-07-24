import Ember from 'ember';



// gets teh data nearest to the xValue provided.
function nearestToXValue(xValue, sortedData) {
	if(!sortedData || sortedData.length === 0) {
		return null;
	}
	var i, current, next;

	for(i = 0; i < sortedData.length; i++) {
		current = sortedData[i];
		next = i < sortedData.length - 1 ? sortedData[i+1] : null;
		if(xValue === current[0]) {
			return current;
		}

		if(xValue < current[0]) {
			return (!next || Math.abs(current[0] - xValue) <= Math.abs(next[0] - xValue)) ? current : next;
		}
	}
	
	return null;
}
/**
	Collection of utility functions for dealing with devining positions given certain
	scales and domain data.

	@namespace mixins
	@class graph-data-position-utils
*/
export default Ember.Mixin.create({
	
	/**
		Searches a given array for a data point nearest an x coordinate, given a specific scale.

		@method getNearestDataToXPosition
		@param rangeX {Number} an x pixel value of a point relative to the top left
				corner of the graph content.
		@param sortedData {Array} the {{#crossLink "mixins.graph-data-graphic/sortedData:property"}}{{/crossLink}}
				to search for the nearest data.
		@param xScale the {{#crossLink "components.nf-graph/xScale:property"}}{{/crossLink}} used to convert the pixel
				x value into a domain value with which to search the array.
		@return {Array} The data point found to be nearest the rangeX x position passed.
	*/
	getNearestDataToXPosition: function(rangeX, sortedData, xScale) {
		if(xScale.invert) {
			var domainX = xScale.invert(rangeX);
			return nearestToXValue(domainX, sortedData);
		}

		// it's ordinal
		var range = xScale.range();
		var index = Math.round((rangeX - range[0]) / (range[1] - range[0]));
		return xScale.domain()[index];
	}
});