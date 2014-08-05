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

	attributeBindings: ['transform'],

	classNameBindings: [':nf-y-diff', 'isPositive:positive:negative', 'isOrientRight:orient-right:orient-left'],

	a: null,
	
	b: null,
	
	contentPadding: 5,
	
	duration: 400,

	yCenter: property('height', 'y', function(height, y) {
		return y + (height / 2) || 0;
	}),

	y: property('graph.yScale', 'a', 'b', function(yScale, a, b) {
		if(!yScale) {
			return 0;
		}
		a = a || 0;
		b = b || 0;
		return Math.min(yScale(a), yScale(b)) || 0;
	}),

	height: property('graph.yScale', 'a', 'b', function(yScale, a, b) {
		if(!yScale) {
			return 0;
		}
		a = a || 0;
		b = b || 0;
		return Math.abs(yScale(a) - yScale(b));
	}),

	transform: Ember.computed.alias('graph.yAxis.transform'),

	diff: property('a', 'b', function(a, b){
		return b - a;
	}),

	isPositive: Ember.computed.gte('diff', 0),
	
	isOrientRight: Ember.computed.equal('graph.yAxis.orient', 'right'),

	width: Ember.computed.alias('graph.yAxis.width'),

	parentController: Ember.computed.alias('templateData.view.controller'),

	contentX: property('isOrientRight', 'width', 'contentPadding', function(isOrientRight, width, contentPadding) {
		return isOrientRight ? width - contentPadding : contentPadding;
	}),

	contentTransform: property('yCenter', 'contentX', function(yCenter, contentX) {
		return 'translate(%@ %@)'.fmt(contentX, yCenter);
	}),

	_transition: function(){
		var y = this.get('y');
		var height = this.get('height');
		var contentTransform = this.get('contentTransform');
		var duration = this.duration;
		var elem = this.$()[0];

		var d3Elem = d3.select(elem);

		d3Elem.selectAll('.nf-y-diff rect')
			.transition()
			.duration(duration)
			.attr('height', height)
			.attr('y', y);

		d3Elem.selectAll('.nf-y-diff-content')
			.transition()
			.duration(duration)
			.attr('transform', contentTransform);
	},

	_nonTransitionalUpdate: function(){
		var contentTransform = this.get('contentTransform');
		var elem = this.$()[0];
		d3.select(elem).selectAll('.nf-y-diff-content')
			.attr('transform', contentTransform);
	},

	_triggerUpdates: function() {
		Ember.run.scheduleOnce('afterRender', this, this._transition);
	}.observes('a', 'b').on('init'),


	_triggerNonTransitionalUpdate: function(){
		Ember.run.scheduleOnce('afterRender', this, this._nonTransitionalUpdate);
	}.observes('isOrientRight', 'width', 'contentPadding').on('init'),
});