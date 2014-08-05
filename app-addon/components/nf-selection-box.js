import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';
/**
	Draws a rectangle on an `nf-graph` given domain values `xMin`, `xMax`, `yMin` and `yMax`.
	@namespace components
  @class nf-selection-box
  @uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',	

	/**
		The duration of the transition in ms
		@property duration
		@type Number
		@default 400
	*/
	duration: 400,

	/**
		The minimum x domain value to encompass.
		@property xMin
		@default null
	*/
	xMin: null,

	/**
		The maximum x domain value to encompoass.
		@property xMax
		@default null
	*/
	xMax: null,

	/**
		The minimum y domain value to encompass.
		@property yMin
		@default null
	*/
	yMin: null,

	/** 
		The maximum y domain value to encompass
		@property yMax
		@default null
	*/
	yMax: null,

	classNames: ['nf-selection-box'],

	/**
		The computed x position of the box.
		@property x
		@type Number
		@readonly
	*/
	x: property('xMin', 'graph.xScale', function(xMin, xScale){
		return xScale(xMin) || 0;
	}),

	/**
		The computed y position of the box.
		@property y
		@type Number
		@readonly
	*/
	y: property('yMax', 'graph.yScale', function(yMax, yScale) {
		return yScale(yMax) || 0;
	}),

	/**
		The computed width of the box.
		@property width
		@type Number
		@readonly
	*/
	width: property('xMin', 'xMax', 'graph.xScale', function(xMin, xMax, xScale){
		var x0 = xScale(xMin);
		var x1 = xScale(xMax);
		return Math.abs(x1 - x0) || 0;
	}),

	/**
		The computed height of the box
		@property width
		@type number
		@readonly
	*/
	height: property('yMin', 'yMax', 'graph.yScale', function(yMin, yMax, yScale){
		var y0 = yScale(yMin);
		var y1 = yScale(yMax);
		return Math.abs(y1 - y0) || 0;
	}),

	/**
		Gets the updated position of the box, and begins a transition to that position
		@method updatePosition
	*/
	updatePosition: function(){
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
	},

	/**
		Observes values supplied to xMin, xMax, yMin and yMax and schedules an
		update to the position of the box.
		@method _triggerPositionUpdate
		@private
	*/

	_triggerPositionUpdate: function(){
		Ember.run.scheduleOnce('afterRender', this, this.updatePosition);
	}.observes('xMin', 'xMax', 'yMin', 'yMax'),

	/**
		Sets up the box's initial position on didInsertElement
		@method _initializePosition
		@private
	*/
	_initializePosition: function(){
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
		this.updatePosition();
	}.on('didInsertElement'),
});