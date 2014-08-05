import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import parsePropExpr from '../utils/parse-property-expression';
import { property } from '../utils/computed-property-helpers';

/**
	Adds a bar graph to an `nf-graph` component.

	**Requires the graph has `xScaleType === 'ordinal'`***

	@namespace components
  @class nf-bars
*/
export default Ember.Component.extend(HasGraphParent, RegisteredGraphic, DataGraphic, {
	tagName: 'g',

	classNames: ['nf-bars'],

	/**
		The name of the property on each data item containing the className for the bar rectangle
		@property classprop
		@type String
		@default 'className'
	*/
	classprop: 'className',

	/**
		Gets the function to get the classname from each data item.
		@property getBarClass
		@readonly
		@private
	*/
	getBarClass: property('classprop', function(classprop) {
		return parsePropExpr(classprop);
	}),

	/**
		The bar models used to render the bars.
		@property bars
		@readonly
	*/
	bars: property('graph.xScale', 'graph.yScale', 'renderedData.@each', 'graph.graphHeight', 'getBarClass',
		function(xScale, yScale, renderedData, graphHeight, getBarClass) {
			var rangeBand = xScale.rangeBand();

			return renderedData.map(function(d) {
				var h = yScale(d[1]);
				return {
					x: xScale(d[0]),
					y: h,
					width: rangeBand,
					height: graphHeight - h,
					className: getBarClass(d.data)
				};
			});
		}
	),


});