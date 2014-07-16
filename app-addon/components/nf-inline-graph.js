import Ember from 'ember';

import { property, observer } from '../utils/computed-property-helpers';

export default Ember.Component.extend({
	tagName: 'div',
	
	isInlineGraph: true,

	classNames: ['nf-inline-graph'],

	width: 400,
	
	transition: 500,

	collapsedHeight: 100,
	
	expandedHeight: 500,
	
	padding: 0.5,

	outerPadding: 0.5,

	expand: false,

	height: property('expand', 'collapsedHeight', 'expandedHeight', 
		function(expand, collapsedHeight, expandedHeight) {
			return expand ? expandedHeight : collapsedHeight;
		}
	),

	xRange: property('width', function(width){
		return [0, width];
	}),

	yRange: property('height', function(height) {
		return [0, height];
	}),

	xDomain: property('data.@each', function(data) {
		return data.map(function(d) {
			return d[0];
		});
	}),

	yDomain: property('data.@each', function(data) {
		return d3.extent(data.map(function(d) {
			return d[1];
		}));
	}),

	xScale: property('xRange', 'xDomain', 'padding', 'outerPadding',
		function(xRange, xDomain, padding, outerPadding){
			return d3.scale.ordinal().domain(xDomain).rangeRoundBands(xRange, padding, outerPadding);
		}
	),

	yScale: property('yRange', 'yDomain',
		function(yRange, yDomain) {
			return d3.scale.linear().domain(yDomain).range(yRange);
		} 
	),

	graphics: property(function() {
		return [];
	}),

	registerGraphic: function(graphic) {
		this.get('graphics').pushObject(graphic);
	},

	unregisterGraphic: function(graphic) {
		this.get('graphics').removeObject(graphic);
	},

	data: property('graphics.@each', function(graphics) {
		return graphics.map(function(graphic, i) {
			return [i, graphic.get('dataValue')];
		});
	}),

	_d3Render: observer('data.@each', '_div', 'yScale', 'height', 'transition', 'xScale',
		function(yData, div, yScale, height, transition, xScale) {
			var inlineGraphics = div.selectAll('.nf-inline-graphic');

			inlineGraphics.data(yData)
				.transition(transition)
				.attr('x', function(d) {
					return xScale(d[0]);
				})
				.attr('y', function(d) {
					return height - yScale(d[1]);
				})
				.attr('height', function(d) {
					return yScale(d[1]);
				})
				.attr('width', xScale.rangeBand());
		}
	),

	_d3Setup: function() {
		this.set('_div', d3.select(this.$()[0]));
	}.on('didInsertElement'),
});