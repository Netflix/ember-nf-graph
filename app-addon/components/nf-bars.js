import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import parsePropExpr from '../utils/parse-property-expression';
import { property } from '../utils/computed-property-helpers';
import RequireScaleSource from '../mixins/graph-requires-scale-source';
import GraphicWithTrackingDot from '../mixins/graph-graphic-with-tracking-dot';

/**
	Adds a bar graph to an `nf-graph` component.

	**Requires the graph has `xScaleType === 'ordinal'`***

	@namespace components
  @class nf-bars
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-registered-graphic
  @uses mixins.graph-data-graphic
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RegisteredGraphic, DataGraphic, RequireScaleSource, GraphicWithTrackingDot, {
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
	bars: property('xScale', 'yScale', 'renderedData.@each', 'graph.graphHeight', 'getBarClass',
		function(xScale, yScale, renderedData, graphHeight, getBarClass) {
			if(!xScale || !yScale || !renderedData) {
				return null;
			}

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