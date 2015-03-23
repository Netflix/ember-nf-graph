import Ember from 'ember';
import HasGraphParent from 'ember-cli-ember-dvc/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-cli-ember-dvc/mixins/graph-requires-scale-source';

/**
	Draws a horizontal line on the graph at a given y domain value
	@namespace components
	@class nf-horizontal-line
	@extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
	tagName: 'line',

	attributeBindings: ['lineY:y1', 'lineY:y2', 'x1', 'x2'],

	classNames: ['nf-horizontal-line'],

	/**
		The y domain value at which to draw the horizontal line
		@property y
		@type Number
		@default null
	*/
	y: null,

	/**
		The computed y coordinate of the line to draw
		@property lineY
		@type Number
		@private
		@readonly
	*/
	lineY: function(){
		var y = this.get('y');
		var yScale = this.get('yScale');
		return yScale ? yScale(y) : -1;
	}.property('y', 'yScale'),

	/**
		The left x coordinate of the line
		@property x1
		@type Number
		@default 0
		@private
	*/
	x1: 0,

	/**
		The right x coordinate of the line
		@property x2
		@type Number
		@private
		@readonly
	*/
	x2: Ember.computed.alias('graph.graphWidth'),
});