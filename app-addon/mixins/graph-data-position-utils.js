import Ember from 'ember';
export default Ember.Mixin.create({
	getNearestDataToXPosition: function(rangeX, sortedData, xScale) {
		var domainX = xScale.invert(rangeX);
		return this.getNearestDataToXValue(domainX, sortedData);
	},

	getNearestDataToXValue: function(xValue, sortedData) {
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
});