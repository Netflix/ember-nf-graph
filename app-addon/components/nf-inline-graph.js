import Ember from 'ember';

import { property, observer } from '../utils/computed-property-helpers';

export default Ember.Component.extend({
	tagName: 'div',
	
	isInlineGraph: true,

	classNames: ['nf-inline-graph'],

	width: 400,
	
	transition: 500,

	collapsedHeight: 100,
	
	padding: 0.5,

	outerPadding: 0.5,

	rowPadding: 0.1,

	expand: false,
	
	expandedHeight: 500,

	expandedItemsPerRow: 20,

	height: property('expand', 'collapsedHeight', 'expandedHeight', 
		function(expand, collapsedHeight, expandedHeight) {
			return expand ? expandedHeight : collapsedHeight;
		}
	),

	graphics: property(function() {
		return [];
	}),

	registerGraphic: function(graphic) {
		this.get('graphics').pushObject(graphic);
		var d3Setups = this.get('d3Setups');

		var graphicName = graphic.get('name');
		if(!d3Setups[graphicName]) {
			d3Setups[graphicName] = graphic.get('d3Setup');
		}
	},

	unregisterGraphic: function(graphic) {
		this.get('graphics').removeObject(graphic);
	},

	rowCount: property('expand', 'expandedItemsPerRow', 'data.length', function(expand, expandedItemsPerRow, dataLength) {
		return expand ? Math.ceiling(dataLength / expandedItemsPerRow) : 1;
	}),

	rowTotalHeight: property('height', 'rowCount', function(height, rowCount) {
		return height / rowCount;
	}),

	rowHeight: property('rowPaddingHeight', 'rowTotalHeight', function(rowPaddingHeight, rowTotalHeight) {
		return rowTotalHeight - rowPaddingHeight;
	}),

	rowPaddingHeight: property('rowTotalHeight', 'rowPadding', 'expand', function(rowTotalHeight, rowPadding, expand) {
		return expand ? rowTotalHeight * rowPadding : 0;
	}),

	xScaleFactory: property('width', 'expand', 'expandedItemsPerRow', 
		function(width, expand, expandedItemsPerRow){
			return function(data, i) {
				var range = [0, width];
				var row = expand ? Math.floor(i / expandedItemsPerRow) : 0;
				var domain = data.map(function(d) {
					return d[0];
				});

				if(expand) {
					var startIndex = Math.floor(i / expandedItemsPerRow) * expandedItemsPerRow;
					var endIndex = startIndex + expandedItemsPerRow;
					domain = domain.filter(function(d, i) {
						return startIndex <= i && i < endIndex;
					});
				}
				return d3.scale.ordinal().rangeRoundBands(range).domain(domain);
			};
		}
	),

	yScaleFactory: property('expand', 'rowHeight', 'expandedItemsPerRow', 
		function(expand, rowHeight, expandedItemsPerRow) {
			return function(data, i) {
				var yData = data.map(function(d) { return d[1]; });
				var domain = d3.extent(yData);
				var row = expand ? Math.floor(i / expandedItemsPerRow) : 0;
				var rangeMin = row * rowHeight;
				var rangeMax = rangeMin + rowHeight;
				return d3.scale.linear().range([rangeMin, rangeMax]).domain(domain);
			};
		}
	),

	_updateData: observer('graphics.@each.value', function(graphics) {
		this.set('data', graphics.map(function(d, i) {
			return [i, d];
		}));
	}),

	_render: observer('data',
		function(data) {
			var xScaleFactory = this.get('xScaleFactory');
			var yScaleFactory = this.get('yScaleFactory');
			var rowHeight = this.get('rowHeight');
			var _div = this.get('_div');
			
			var rangeBand = xScaleFactory(data, 0).rangeBand();

			// update bars
			_div.selectAll('.nf-inline-bar')
				.data(data)
			.enter().append('rect')
				.transition().duration(transition)
				.attr('x', function(d, i) {
					return xScaleFactory(data, i)(d[0]);
				})
				.attr('y', function(d, i) {
					return rowHeight - yScaleFactory(data, i)(d[1]);
				})
				.attr('width', rangeBand)
				.attr('height', function(d, i) {
					return yScaleFactory(data, i)(d[1]);
				});
		}
	),

	_d3Setup: function() {
		this.set('_div', d3.select(this.$()[0]));
	}.on('didInsertElement'),
});