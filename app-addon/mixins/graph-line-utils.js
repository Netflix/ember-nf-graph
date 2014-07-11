import Ember from 'ember';
export default Ember.Mixin.create({
	createLineFn: function(xScale, yScale, interpolate){ 
		var interp = interpolate || 'linear';

        var xMod = xScale.rangeBand ? xScale.rangeBand() / 2 : 0;
        var yMod = yScale.rangeBand ? yScale.rangeBand() / 2 : 0;

        return function(data) {
        	if(!data || data.length === 0) {
        		return 'M0,0';
        	}
        	
        	return d3.svg.line()
    	      .x(function (d) { return xScale(d[0]) + xMod; })
    	      .y(function (d) { return yScale(d[1]) + yMod; })
    	      .interpolate(interp)(data);
        };
	}
});