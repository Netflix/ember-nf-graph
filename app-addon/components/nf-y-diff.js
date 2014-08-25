import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';

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

	/**
		The starting domain value of the difference measurement. The subrahend of the difference calculation.
		@property a
		@type Number
		@default null
	*/
	a: null,
	
	/**
		The ending domain value of the difference measurement. The minuend of the difference calculation.
		@property b
		@type Number
		@default null
	*/
	b: null,
	
	/**
		The amount of padding, in pixels, between the edge of the difference "box" and the content container
		@property contentPadding
		@type Number
		@default 5
	*/
	contentPadding: 5,
	
	/**
		The duration of the transition, in milliseconds, as the difference slides vertically
		@property duration
		@type Number
		@default 400
	*/
	duration: 400,

	/**
		The calculated vertical center of the difference box, in pixels.
		@property yCenter
		@type Number
		@readonly
	*/
	yCenter: property('height', 'y', function(height, y) {
		return y + (height / 2) || 0;
	}),

	/**
		The calculated top of the difference box, in pixels
		@property y
		@type Number
		@readonly
	*/
	y: property('yScale', 'a', 'b', function(yScale, a, b) {
		if(!yScale) {
			return 0;
		}
		a = a || 0;
		b = b || 0;
		return Math.min(yScale(a), yScale(b)) || 0;
	}),

	/**
		The calculated height of the difference box, in pixels.
		@property height
		@type Number
		@readonly
	*/
	height: property('yScale', 'a', 'b', function(yScale, a, b) {
		if(!yScale) {
			return 0;
		}
		a = a || 0;
		b = b || 0;
		return Math.abs(yScale(a) - yScale(b));
	}),

	/**
		The SVG transformation of the component.
		@property transform
		@type String
		@private
		@readonly
	*/
	transform: Ember.computed.alias('graph.yAxis.transform'),

	/**
		The calculated difference between `a` and `b`.
		@property diff
		@type Number
		@readonly
	*/
	diff: property('a', 'b', function(a, b){
		return b - a;
	}),

	/**
		Returns `true` if `diff` is a positive number
		@property isPositive
		@type Boolean
		@readonly
	*/
	isPositive: Ember.computed.gte('diff', 0),
	
	/**
		Returns `true` if the graph's y-axis component is configured to orient right.
		@property isOrientRight
		@type Boolean
		@readonly
	*/
	isOrientRight: Ember.computed.equal('graph.yAxis.orient', 'right'),

	/**
		The width of the difference box
		@property width
		@type Number
		@readonly
	*/
	width: Ember.computed.alias('graph.yAxis.width'),

	/**
		The view controller for the view this component is present in
		@property parentController
		@type Ember.Controller
		@private
		@readonly
	*/
	parentController: Ember.computed.alias('templateData.view.controller'),

	/**
		The x pixel coordinate of the content container.
		@property contentX
		@type Number
		@readonly
	*/
	contentX: property('isOrientRight', 'width', 'contentPadding', function(isOrientRight, width, contentPadding) {
		return isOrientRight ? width - contentPadding : contentPadding;
	}),

	/**
		The SVG transformation used to position the content container.
		@property contentTransform
		@type String
		@private
		@readonly
	*/
	contentTransform: property('yCenter', 'contentX', function(yCenter, contentX) {
		return 'translate(%@ %@)'.fmt(contentX, yCenter);
	}),

	/**
		Begins the the D3 transition to adjust the vertical positions of the diff box
		@method _transitionalUpdate
		@private
	*/
	_transitionalUpdate: function(){
		var y = this.get('y');
		var height = this.get('height');
		var contentTransform = this.get('contentTransform');
		var duration = this.duration;
		var elem = this.get('elem');

		if(elem) {
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
		}
	},

	/**
		Updates the elements horizontal positions using D3.
		@method _nonTransitionalUpdate
		@private
	*/
	_nonTransitionalUpdate: function(){
		var contentTransform = this.get('contentTransform');
		var elem = this.get('elem');
		if(elem) {
			d3.select(elem).selectAll('.nf-y-diff-content')
				.attr('transform', contentTransform);
		}
	},

	/**
		Schedules a transition when `a` or `b` changes, and when the component is initialized.
		@method _triggerUpdates
		@private
	*/
	_triggerUpdates: function() {
		Ember.run.scheduleOnce('afterRender', this, this._transitionalUpdate);
	}.observes('a', 'b').on('init'),


	/**
		Schedules non-transitioned properties on the elements to update when underlying values are changed.
		@method _triggerNonTransitionalUpdate
		@private
	*/
	_triggerNonTransitionalUpdate: function(){
		Ember.run.scheduleOnce('afterRender', this, this._nonTransitionalUpdate);
	}.observes('isOrientRight', 'width', 'contentPadding').on('init'),

	_getElement: function(){
		this.set('elem', this.$()[0]);
	}.on('didInsertElement'),
});