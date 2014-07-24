import Ember from 'ember';
import parsePropertyExpr from '../utils/parse-property-expression';

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
    The {{#crossLink "mixins.graph-data-graphic/sortedData:property"}}{{/crossLink}} 
    filtered down to only the data that is visible within the graph's domain.

    @property visibleData
    @type Array
    @readonly
  */
  visibleData: function() {
  	var xMin = this.get('graph.xMin');
  	var xMax = this.get('graph.xMax');
    var sortedData = this.get('sortedData');

    if(!sortedData) {
    	return null;
    }

    return sortedData.filter(function(d) {
    	var x = d[0];
    	return xMin <= x && x <= xMax;
    });
  }.property('sortedData', 'graph.xMin', 'graph.xMax'),

  /**
    The first element from {{#crossLink "mixins.graph-data-graphic/visibleData:property"}}{{/crossLink}}

    @property firstVisibleData
    @type Array
    @readonly
  */
  firstVisibleData: function(){
  	var visibleData = this.get('visibleData');
  	return visibleData && visibleData.length > 0 ? visibleData[0] : null;
  }.property('visibleData'),


  /**
    The last element from {{#crossLink "mixins.graph-data-graphic/visibleData:property"}}{{/crossLink}}

    @property firstVisibleData
    @type Array
    @readonly
  */
  lastVisibleData: function(){
  	var visibleData = this.get('visibleData');
  	return visibleData && visibleData.length > 0 ? visibleData[visibleData.length - 1] : null;
  }.property('visibleData'),
});