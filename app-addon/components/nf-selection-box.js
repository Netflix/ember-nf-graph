import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';

/**
 * draws a rectangle on an `nf-graph` given domain values `xMin`, `xMax`, `yMin` and `yMax`.
 * @namespace components
 * @class nf-selection-box
 */
export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',	
	transition: 500,

	xMin: null,
	xMax: null,
	yMin: null,
	yMax: null,

	classNames: ['nf-selection-box'],

	x: function(){
		var xScale = this.get('graph.xScale');
		return xScale(this.get('xMin')) || 0;
	}.property('xMin', 'graph.xScale'),

	y: function(){
		var yScale = this.get('graph.yScale');
		return yScale(this.get('yMax')) || 0;
	}.property('yMax', 'graph.yScale'),

	width: function(){
		var xScale = this.get('graph.xScale');
		var x0 = xScale(this.get('xMin'));
		var x1 = xScale(this.get('xMax'));
		return Math.abs(x1 - x0) || 0;
	}.property('xMin', 'xMax', 'graph.xScale'),

	height: function(){
		var yScale = this.get('graph.yScale');
		var y0 = yScale(this.get('yMin'));
		var y1 = yScale(this.get('yMax'));
		return Math.abs(y1 - y0) || 0;
	}.property('yMin', 'yMax', 'graph.yScale'),

	updateElements: function(){
		var x = this.get('x');
		var y = this.get('y');
		var width = this.get('width');
		var height = this.get('height');
		var transition = this.get('transition');
		var g = this.get('g');
		var rect = this.get('rect');

		g.transition(transition)
			.attr('transform', 'translate(%@ %@)'.fmt(x, y));

		rect.transition(transition)
			.attr('width', width)
			.attr('height', height);
	}.observes('x', 'y', 'width', 'height'),

	getElements: function(){
		var g = d3.select(this.$()[0]);
		var rect = g.selectAll('rect').data([0]);
		
		var x = this.get('x');
		var y = this.get('y');
		var width = this.get('width');
		var height = this.get('height');

		g.attr('transform', 'translate(%@ %@)'.fmt(x, y));
		rect.attr('width', width).attr('height', height);
		
		this.set('g', g);
		this.set('rect', rect);
		this.updateElements();
	}.on('didInsertElement'),
});