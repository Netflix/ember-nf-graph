import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import RequiresScaleSource from '../mixins/graph-requires-scale-source';
import { normalizeScale } from '../utils/nf/scale-utils';

/**
	An SVG path primitive that plots based on a graph's scale.
	@namespace components
	@class nf-svg-path
	@extends Ember.Component
	@uses mixins.graph-has-graph-parent
	@uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, {
	type: 'path',

	classNames: ['nf-svg-path'],

	attributeBindings: ['d'],

	/**
		The array of points to use to plot the path. This is an array of arrays, in the following format:

					// specify path pen commands
					[
						[50, 50, 'L'],
						[100, 100, 'L']
					]

					// or they will default to 'L'
					[
						[50, 50],
						[100, 100]
					]

	@property points
	@type Array
	*/
	points: null,

	/**
		The data points mapped to scale
		@property svgPoints
		@type Array
	*/
	svgPoints: function(){
		var points = this.get('points');
		var xScale = this.get('xScale');
		var yScale = this.get('yScale');
		if(Ember.isArray(points) && points.length > 0) {
			return points.map(function(v) {
				var dx = normalizeScale(xScale, v[0]);
				var dy = normalizeScale(yScale, v[1]);
				var c = v.length > 2 ? v[2] : 'L';
				return [dx, dy, c];
			});
		} 
	}.property('points.[]', 'xScale', 'yScale'),

	/**
		The raw svg path d attribute output
		@property d
		@type String
	*/
	d: function(){
		var svgPoints = this.get('svgPoints');
		if(Ember.isArray(svgPoints) && svgPoints.length > 0) {
			return svgPoints.reduce(function(d, pt, i) {
				if(i === 0) {
					d += 'M' + pt[0] + ',' + pt[1];
				}
				d += ' ' + pt[2] + pt[0] + ',' + pt[1];
				return d;
			}, '');
		} else {
			return 'M0,0';
		}
	}.property('svgPoints'),
});