import Ember from 'ember';

/**
 * Utility functions for drawing an area.
 * @namespace mixins
 * @class graph-area-utils
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({

  /**
   * @function createAreaFn
   * @param xScale {Function} a d3 scale
   * @param yScale {Function} a d3 scale
   * @param interpolator {String} the name of the d3 interpolator to use.
   * @return {Function} a function that when called will create SVG path data.
   */
	createAreaFn: function(xScale, yScale, interpolator) {
    return d3.svg.area()
          .x(function (d) {
            return xScale(d[0]);
          })
          .y0(function (d) {
            return yScale(d[1]);
          })
          .y1(function (d) {
            return yScale(d[2]);
          })
          .interpolate(interpolator);
	}
});