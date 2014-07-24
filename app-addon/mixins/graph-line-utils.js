	import Ember from 'ember';

	/**
		@namespace mixins
		@class graph-line-utils
		@extends Ember.Mixin
		*/
	export default Ember.Mixin.create({

		/**
			Create a d3 line function from a given scales and interpolation

			@method createLineFn
			@param xScale {Function} d3 scale function
			@param yScale {Function} d3 scale function
			@param interpolate {String} d3 interpolator name
			@return {Function} a d3 function that will create SVG path data from a given data set.
			*/
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