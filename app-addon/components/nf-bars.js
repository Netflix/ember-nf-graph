import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import { property } from '../utils/computed-property-helpers';

export default Ember.Component.extend(HasGraphParent, RegisteredGraphic, DataGraphic, {
	tagName: 'g',

	bars: property('graph.xScale', 'graph.yScale', 'sortedData', 'graph.graphHeight',
		function(xScale, yScale, sortedData, graphHeight) {
			var rangeBand = xScale.rangeBand();

			return sortedData.map(function(d) {
				var h = yScale(d[1]);
				return {
					x: xScale(d[0]),
					y: h,
					width: rangeBand,
					height: graphHeight - h
				};
			});
		}
	)
});