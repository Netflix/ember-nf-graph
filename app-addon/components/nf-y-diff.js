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
	duration: 300,
	contentY: 0,
	contentX: 0,
	y: 0,
	height: 0,

	diff: property('a', 'b', function(a, b){
		return b - a;
	}),

	isPositive: Ember.computed.gte('diff', 0),
	
	x: Ember.computed.alias('graph.yAxis.x'),
	
	isOrientRight: Ember.computed.equal('graph.yAxis.orient', 'right'),

	width: Ember.computed.alias('graph.yAxis.width'),

	parentController: Ember.computed.alias('templateData.view.controller'),

	isVisible: property('a', 'b', function(a, b){
		return typeof a === 'number' && typeof b === 'number';
	}),

	contentTransform: property('contentX', 'contentY', function(contentX, contentY) {
		return 'translate(%@ %@)'.fmt(contentX, contentY);
	}),

	_updatePosition: observer('a', 'b', 'graph.yScale', 'graph.graphY', function(a, b, yScale, graphY){
		var y = Math.min(yScale(a), yScale(b)) + graphY;
		var height = Math.abs(yScale(b) - yScale(a));
		var contentY = y + (height / 2);

		this.transition().duration(this.duration)
			.set('y', y || 0)
			.set('height', height || 0)
			.set('contentY', contentY || 0);
	}),

	_setup: function(){

	}.on('init'),
});