import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import DataGraphic from '../mixins/graph-data-graphic';
import RegisteredGraphic from '../mixins/graph-registered-graphic';
import parsePropExpr from '../utils/parse-property-expression';
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
	getBarClass: function() {
		var classprop = this.get('classprop');
		return classprop ? parsePropExpr(classprop) : null;
	}.property('classprop'),

	/**
		The nf-bars-group this belongs to, if any.
		@property group
		@type components.nf-bars-group
		@default null
	*/
	group: null,

	/**
		The index of this component within the group, if any.
		@property groupIndex
		@type Number
		@default null
	*/
	groupIndex: null,

	/**
		The graph content height
		@property graphHeight
		@type Number
		@readonly
	*/
	graphHeight: Ember.computed.oneWay('graph.graphHeight'),

	barWidth: function(){
		var xScale = this.get('xScale');
		return xScale && xScale.rangeBand ? xScale.rangeBand() : 0;
	}.property('xScale'),

	groupOffsetX: function(){
		var group = this.get('group');
		var groupIndex = this.get('groupIndex');
		return group ? group.getBarOffsetX(groupIndex) : 0;
	}.property('group', 'groupIndex'),

	getBarXPosition: function() {
		var xScale = this.get('xScale');
		var groupOffsetX = this.get('groupOffsetX');
		return function(x) {
			return groupOffsetX + (xScale ? xScale(x) : 0);
		};
	}.property('xScale', 'groupOffsetX'),

	/**
		The bar models used to render the bars.
		@property bars
		@readonly
	*/
	bars: function(){
		var xScale = this.get('xScale');
		var yScale = this.get('yScale');
		var renderedData = this.get('renderedData');
		var graphHeight = this.get('graphHeight');
		var getBarClass = this.get('getBarClass');
		var getBarXPosition = this.get('getBarXPosition');

		if(!xScale || !yScale || !Ember.isArray(renderedData)) {
			return null;
		}

		var barWidth = this.get('barWidth');

		return renderedData.map(function(d) {
			var h = yScale(d[1]);
			return {
				x: getBarXPosition(d[0]),
				y: h,
				width: barWidth,
				height: graphHeight - h,
				className: getBarClass(d.data),
				dataPoint: d,
			};
		});
	}.property('xScale', 'yScale', 'renderedData.[]', 'graphHeight', 'getBarClass', 'barWidth'),

	/**
		The name of the action to fire when a bar is clicked.
		@property barClick
		@type String
		@default null
	*/
	barClick: null,

	actions: {
		nfBarClickBar: function(dataPoint) {
			if(this.get('barClick')) {
				this.sendAction('barClick', {
					data: dataPoint.data,
					x: dataPoint[0],
					y: dataPoint[1],
					source: this,
					graph: this.get('graph'),
				});
			}
		}
	}

});