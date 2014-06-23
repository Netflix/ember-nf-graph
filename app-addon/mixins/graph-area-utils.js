import Ember from 'ember';

export default Ember.Mixin.create({
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