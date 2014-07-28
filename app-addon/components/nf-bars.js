import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import { property } from '../utils/computed-property-helpers';

/**
 * Adds a bar graph to an `nf-graph` component.
 *
 * **Requires the graph has `xScaleType === 'ordinal'`***
 *
 * @namespace components
 * @class nf-bars
 */
export default Ember.Component.extend(HasGraphParent, RegisteredGraphic, DataGraphic, {
	tagName: 'g',

	classNames: ['nf-bars'],

	bars: property('graph.xScale', 'graph.yScale', 'renderedData', 'graph.graphHeight',
		function(xScale, yScale, renderedData, graphHeight) {
			var rangeBand = xScale.rangeBand();

			return renderedData.map(function(d) {
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