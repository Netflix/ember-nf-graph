import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

/**
	Draws a line and a chevron at the specified domain value 
	on the right side of an `nf-graph`. 
	
	### Tips
	
	- Position outside of `nf-graph-content` component, but inside `nf-graph`.
	- Adding `paddingRight` to `nf-graph` component will not affect `nf-right-tick`'s position.
	
	@namespace components
	@class nf-right-tick
	@extends Ember.Component
  @uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',

	classNames: ['nf-right-tick'],
	
	/**
		The transition duration in milliseconds
		@property duration
		@type Number
		@default 400
	*/
	duration: 400,

	/**
		The domain value at which to place the tick
		@property value
		@type Number
		@default null
	*/
	value: null,

	/**
		Sets the visibility of the component. Returns false if `y` is not 
		a numeric data type.
		@property isVisible
		@private
		@readonly
	*/
	isVisible: property('y', function(y){
		return !isNaN(y);
	}),

	/**
		The calculated y coordinate of the tick
		@property y
		@type Number
		@readonly
	*/
	y: property('value', 'graph.yScale', 'graph.paddingTop', function(value, yScale, paddingTop){
		var vy = 0;
		if(yScale) {
			vy = yScale(value) || 0;
		}
		return vy + paddingTop;
	}),

	/**
		The SVG transform used to render the tick
		@property transform
		@type String
		@private
		@readonly
	*/
	transform: property('y', 'graph.width', function(y, graphWidth){
		return 'translate(%@ %@)'.fmt(graphWidth - 6, y - 3);
	}),

	/**
		performs the D3 transition to move the tick to the proper position.
		@method _transitionalUpdate
		@private
	*/
	_transitionalUpdate: function(){
		var transform = this.get('transform');
		var path = this.get('path');
		var duration = this.get('duration');
		path.transition().duration(duration)
			.attr('transform', transform);
	},

	/**
		Schedules the transition when `value` changes on on init.
		@method _triggerTransition
		@private
	*/
	_triggerTransition: function(){
		Ember.run.scheduleOnce('afterRender', this, this._transitionalUpdate);
	}.observes('value').on('init'),

	/**
		Updates the tick position without a transition.
		@method _nonTransitionalUpdate
		@private
	*/
	_nonTransitionalUpdate: function(){
		var transform = this.get('transform');
		var path = this.get('path');
		path.attr('transform', transform);
	},

	/**
		Schedules the update of non-transitional positions
		@method _triggerNonTransitionalUpdate
		@private
	*/
	_triggerNonTransitionalUpdate: function(){
		Ember.run.scheduleOnce('hadRendered', this, this._nonTransitionalUpdate);
	}.observes('graph.width'),

	/**
		Gets the elements required to do the d3 transitions
		@method _getElements
		@private
	*/
	_getElements: function(){
		var g = d3.select(this.$()[0]);
		var path = g.selectAll('path').data([0]);
		this.set('path', path);
	}.on('didInsertElement')
});