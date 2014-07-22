import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property, observer } from '../utils/computed-property-helpers';

/**
 * Draws a box underneath (or over) the y axis to between the given `a` and `b`
 * domain values. Component content is used to template a label in that box.
 * 
 * ## Tips
 * 
 * - Should be outside of `nf-graph-content`.
 * - Should be "above" `nf-y-axis` in the markup.
 * - As a convenience, `<text>` elements will automatically be positioned based on y-axis orientation
 * due to default styling.
 *
 * @namespace components
 * @class nf-y-diff
 */
export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',

	classNameBindings: [':nf-y-diff', 'isPositive:positive:negative', 'isOrientRight:orient-right:orient-left'],

	a: null,
	b: null,
	contentPadding: 5,
	transition: 500,

	diff: property('a', 'b', function(a, b){
		return b - a;
	}),

	isPositive: Ember.computed.gte('diff', 0),
	
	x: Ember.computed.alias('graph.yAxis.x'),
	
	isOrientRight: Ember.computed.equal('graph.yAxis.orient', 'right'),

	y: property('a', 'b', 'graph.yScale', 'graph.graphY', function(a, b, yScale, graphY){
		return Math.min(yScale(a), yScale(b)) + graphY;
	}),

	width: Ember.computed.alias('graph.yAxis.width'),

	height: property('graph.yScale', 'a', 'b', function(yScale, a, b) {
		return Math.abs(yScale(b) - yScale(a));
	}),

	parentController: Ember.computed.alias('templateData.view.controller'),

	contentX: property('isOrientRight', 'width', 'contentPadding', 'x', function(isOrientRight, width, contentPadding, x) {
		return x + (isOrientRight ? width - contentPadding : contentPadding);
	}),

	contentY: property('y', 'height', function(y, height){
		return y + (height / 2);
	}),

	isVisible: property('a', 'b', function(a, b){
		return typeof a === 'number' && typeof b === 'number';
	}),

	updateElements: observer('rect', 'content', 'transition', 'x', 'y', 'width', 'height', 'contentY', 'contentX',
		function(rect, content, transition, x, y, width, height, contentY, contentX){
			if(rect) {
				rect.transition(transition).attr('x', x || 0)
					.attr('y', y || 0)
					.attr('width', width || 0)
					.attr('height', height || 0);
			}

			if(content) {
				content.transition(transition).attr('transform', function() {
					return 'translate(%@ %@)'.fmt(contentX || 0, contentY || 0);
				});
			}
		}
	),

	_d3Setup: function(){
		var g = d3.select(this.$()[0]);
		var data = [0];
		var rect = g.selectAll('rect').data(data);
		var content = g.selectAll('g.nf-y-diff-content').data(data);
		this.set('rect', rect);
		this.set('content', content);
		this.updateElements();
	}.on('didInsertElement')

});