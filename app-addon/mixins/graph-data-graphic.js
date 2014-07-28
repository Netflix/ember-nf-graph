import Ember from 'ember';
import parsePropertyExpr from '../utils/parse-property-expression';
import { property } from '../utils/computed-property-helpers';

/**
  This is mixed in to {{#crossLink components.nf-graph}}nf-graph{{/crossLink}} child components that need to register data
  with the graph. Includes methods for extracting, sorting and scrubbing data
  for use in graphing components.

  Requires {{#crossLink "mixins.graph-registered-graphic"}}{{/crossLink}} and 
  {{#crossLink "mixins.graph-has-graph-parent"}}{{/crossLink}}

  @namespace mixins
  @class graph-data-graphic
*/
export default Ember.Mixin.create({
	isDataGraphic: true,

  /**
    Gets or sets the data used by the component to plot itself.

    @property data
    @type Array
    @default null
  */
  data: null,

  /**
    The path of the property on each object in 
    {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}}
    to use as x data to plot on the graph.

    @property x
    @type String
    @default 'x'
  */
	xprop: 'x',

  /**
    The path of the property on each object in 
    {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}}
    to use as y data to plot on the graph.

    @property y
    @type String
    @default 'y'
  */
	yprop: 'y',

  /**
    The function to get the x value from each 
    {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}} object

    @property xPropFn
    @type Function
    @readonly
  */
	xPropFn: function() {
		return parsePropertyExpr(this.get('xprop'));
	}.property('xprop'),

  /**
    The function to get the y value from each 
    {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}} object

    @property yPropFn
    @type Function
    @readonly
  */
	yPropFn: function() {
		return parsePropertyExpr(this.get('yprop'));
	}.property('yprop'),

  /**
    The sorted and mapped data pulled from {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}}
    An array of arrays, structures as so:

          [[x,y],[x,y],[x,y]];

    ** each inner array also has a property `data` on it, containing the original data object **

    @property sortedData
    @type Array
    @readonly
  */
	sortedData: function(){
    var data = this.get('data');
    var xPropFn = this.get('xPropFn');
    var yPropFn = this.get('yPropFn');
    var xScaleType = this.get('xScaleType');

    if(!data) {
      return null;
    }

    var mapped = data.map(function(d, i) {
    	var item = [xPropFn(d), yPropFn(d)];
    	item.data = d;
    	item.origIndex = i;
    	return item;
    });

    if(xScaleType !== 'ordinal') {
      mapped.sort(function(a, b) {
      	var ax = a[0];
        var bx = b[0];
        return ax === bx ? 0 : (ax > bx) ? 1 : -1;
      });
    }
    
    return mapped;
  }.property('data.@each', 'xPropFn', 'yPropFn'),


  /**
    The list of data points from {{#crossLink "mixins.graph-data-graphc/sortedData:property"}}{{/crossLink}} that
    fits within the x domain, plus up to one data point outside of that domain in each direction.
    @property renderedData
    @type Array
    @readonly
  */
  renderedData: property('sortedData.@each', 'graph.xScaleType', 'graph.xMin', 'graph.xMax', function(sortedData, xScaleType, xMin, xMax) {
    if(!sortedData || sortedData.length === 0) {
      return [];
    }

    if(xScaleType === 'ordinal') {
      return sortedData.slice();
    }

    return sortedData.filter(function(d, i) {
      var x = d[0];
      var prev = sortedData[i-1];
      var next = sortedData[i+1];
      var prevX = prev ? prev[0] : null;
      var nextX = next ? next[0] : null;

      return between(x, xMin, xMax) || between(prevX, xMin, xMax) || between(nextX, xMin, xMax);
    });
  }),

  /**
    The first element from {{#crossLink "mixins.graph-data-graphic/renderedData:property"}}{{/crossLink}}
    that is actually visible within the x domain.
    @property firstSortedData
    @type Array
    @readonly
  */
  firstVisibleData: property('renderedData', 'xMin', function(renderedData, xMin) {
    var first = renderedData[0];
    if(first && xMin > first[0] && renderedData.length > 1) {
      first = renderedData[1];
    }
    return first;
  }),


  /**
    The last element from {{#crossLink "mixins.graph-data-graphic/renderedData:property"}}{{/crossLink}}
    that is actually visible within the x domain.
    @property lastVisibleData
    @type Array
    @readonly
  */
  lastVisibleData: property('renderedData', 'xMax', function(renderedData, xMax) {
    var last = renderedData[renderedData.length - 1];
    if(last && xMax < last[0] && renderedData.length > 1) {
      last = renderedData[renderedData.length - 2];
    }
    return last;
  }),
});

function between(x, a, b) {
  return a <= x && x <= b;
}