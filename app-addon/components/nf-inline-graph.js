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
	},

	unregisterGraphic: function(graphic) {
		this.get('graphics').removeObject(graphic);
	},

	_updateData: observer('graphics.@each', 'expand', 'expandedItemsPerRow', 
		function(graphics, expand, expandedItemsPerRow) {
			var data = graphics.map(function(graphic, i) {
				return [i, graphic.getDataValue() || 0];
			});
			
			var groupedData = expand ? data.reduce(function(groups, d, i) {
					var group = groups[groups.length];
					if(i % expandedItemsPerRow === 0) {
						group = [];
						groups.push(group);
					}
					group.push(d);
				}, []).map(function(group) {
					while(expand && group.length < expandedItemsPerRow) {
						group.push([group.length, 0]);
					}
					return group;
				}) : [data];

			var dataExtent = d3.extent(data.map(function(d) {
				return d[1];
			}));

			this.set('groupedData', groupedData);
			this.set('dataExtent', dataExtent);
		}),

	_d3Render: observer('_div', 'groupedData.@each', 'width', 'height', 'expand', 'padding', 'outerPadding', 'rowPadding', 'transition', 'expandedItemsPerRow', 'dataExtent',
		function(div, groupedData, width, height, expand, padding, outerPadding, rowPadding, transition, expandedItemsPerRow, dataExtent) {
			if(!div) {
				return;
			}
			
			var totalRowHeight = height / groupedData.length;
			var rowHeight = totalRowHeight * (1 - rowPadding);

			var groups = div.selectAll('.nf-inline-graph-row').data(groupedData);

			groups.enter().append('g')
				.attr('class', 'nf-inline-graph-row')
			
			groups.transition(transition).attr('transform', function(d, i) {
					return 'translate(0 %@)'.fmt(totalRowHeight * i);
				});

			groups.forEach(function(group, gi) {
				var data = groupedData[gi];
        var xData = data.map(function(d) { return d[0]; });

				var xScale = d3.scale.ordinal()
					.rangeRoundBands([0, width], padding, outerPadding)
					.domain(xData);
				
				var yScale = d3.scale.linear()
					.range([0, rowHeight])
					.domain(dataExtent);
				
				var rangeBand = xScale.rangeBand();

				var bars = d3.select(group[0]).selectAll('.nf-inline-bar')
					.data(groupedData[gi]);


				bars.transition(transition)
					.attr('x', function(d) {
						return xScale(d[0]) || 0;
					})
					.attr('y', function(d) {
						return rowHeight - yScale(d[1]) || 0;
					})
					.attr('width', rangeBand)
					.attr('height', function(d) {
						return yScale(d[1]) || 0;
					});
			});
		}
	),

	_d3Setup: function() {
		this.set('_div', d3.select(this.$()[0]));
	}.on('didInsertElement'),
});