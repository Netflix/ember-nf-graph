import Ember from 'ember';
export default Ember.Mixin.create({
	createLineFn: function(xscale, yscale, interpolate){ 
		var interp = interpolate || 'linear';
        return function(data) {
        	if(!data) {
        		return 'M0,0';
        	}
        	
        	return d3.svg.line()
    	      .x(function (d) { return xscale(d[0]); })
    	      .y(function (d) { return yscale(d[1]); })
    	      .interpolate(interp)(data);
        };
	}
});