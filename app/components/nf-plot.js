import Ember from 'ember';
import HasGraphParent from 'ember-cli-ember-dvc/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-cli-ember-dvc/mixins/graph-requires-scale-source';
import GraphEvent from 'ember-cli-ember-dvc/utils/nf/graph-event';

/**
	Plots a group tag on a graph at a given x and y domain coordinate.
	@namespace components
	@class nf-plot
	@extends Ember.Component
	@uses mixins.graph-has-graph-parent
	@uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
	tagName: 'g',

	attributeBindings: ['transform'],

	classNames: ['nf-plot'],

	/**
		The x domain value to set the plot at
		@property x
		@default null
	*/
	x: null,

	/**
		The y domain value to set the plot at
		@property x
		@default null
	*/
	y: null,

	/**
		True if an `x` value is present (defined, not null and non-empty)
		@property hasX
		@type Boolean
		@readonly
	*/
	hasX: Ember.computed.notEmpty('x'),

	/**
		True if an `y` value is present (defined, not null and non-empty)
		@property hasY
		@type Boolean
		@readonly
	*/
	hasY: Ember.computed.notEmpty('y'),

	/**
		The calculated visibility of the component
		@property isVisible
		@type Boolean
		@readonly
	*/
	isVisible: Ember.computed.and('hasX', 'hasY'),

	/**
		The calculated x coordinate
		@property rangeX
		@type Number
		@readonly
	*/
	rangeX: function(){
		var xScale = this.get('xScale');
		var x = this.get('x');
		var hasX = this.get('hasX');
		return (hasX && xScale ? xScale(x) : 0) || 0;
	}.property('x', 'xScale'),

	/**
		The calculated y coordinate
		@property rangeY
		@type Number
		@readonly
	*/
	rangeY: function(){
		var yScale = this.get('yScale');
		var y = this.get('y');
		var hasY = this.get('hasY');
		return (hasY && yScale ? yScale(y) : 0) || 0;
	}.property('y', 'yScale'),

	/**
		The SVG transform of the component's `<g>` tag.
		@property transform
		@type String
		@readonly
	*/
	transform: function(){
		return 'translate(%@ %@)'.fmt(this.get('rangeX'), this.get('rangeY'));
	}.property('rangeX', 'rangeY'),

	data: null,

	click: function(e) {
		var context = GraphEvent.create({
			x: this.get('x'),
			y: this.get('y'),
			data: this.get('data'),
			source: this,
			graph: this.get('graph'),
			originalEvent: e,
		});
		this.sendAction('action', context);
	},
});









