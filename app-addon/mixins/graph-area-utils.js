import Ember from 'ember';

/**
  Utility functions for drawing an area.
  
  @namespace mixins
  @class graph-area-utils
  @extends Ember.Mixin
*/
export default Ember.Mixin.create({

  /**
    Creates a d3 area function from a given set of scales and an interpolator

    @method createAreaFn
    @param xScale {Function} a d3 scale
    @param yScale {Function} a d3 scale
    @param interpolator {String} the name of the d3 interpolator to use.
    @return {Function} a function that when called will create SVG path data.
  */
	createAreaFn: function(xScale, yScale, interpolator) {
      var interp = interpolator || 'linear';
      var xMod = xScale.rangeBand ? xScale.rangeBand() / 2 : 0;
      var yMod = yScale.rangeBand ? yScale.rangeBand() / 2 : 0;

      return function(data) {
        if(!data || data.length === 0) {
          return 'M0,0';
        }

        return d3.svg.area()
          .x(function (d) {
            return (xScale(d[0]) || 0) + xMod;
          })
          .y0(function (d) {
            return (yScale(d[1]) || 0) + yMod;
          })
          .y1(function (d) {
            return (yScale(d[2]) || 0) + yMod;
          })
          .interpolate(interp)(data);
      };
	}
});