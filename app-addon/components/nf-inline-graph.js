import Ember from 'ember';

import { property } from '../utils/computed-property-helpers';

export default Ember.Component.extend({
	tagName: 'div',
	isInlineGraph: true,
	className: ['nf-inline-graph'],

	width: 400,
	collapsedHeight: 100,
	expandedHeight: 500,
	expand: false,

	height: property('expand', 'collapsedHeight', 'expandedHeight', function(expand, collapsedHeight, expandedHeight) {
		return expand ? expandedHeight : collapsedHeight;
	}),

	xRange: property('width', function(width){
		return [0, width];
	}),

	yRange: property('height', function(height) {
		return [0, height];
	}),

	xScale: null,

	yScale: null,

	graphics: property(function() {
		return [];
	}),

	registerGraphic: function(graphic) {
		this.get('graphics').pushObject(graphic);
	},

	unregisterGraphic: function(graphic) {
		this.get('graphics').removeObject(graphic);
	}
});