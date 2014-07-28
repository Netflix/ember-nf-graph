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
    The first element from {{#crossLink "mixins.graph-data-graphic/sortedData:property"}}{{/crossLink}}

    @property firstSortedData
    @type Array
    @readonly
  */
  firstSortedData: function(){
  	var sortedData = this.get('sortedData');
  	return sortedData && sortedData.length > 0 ? sortedData[0] : null;
  }.property('sortedData'),


  /**
    The last element from {{#crossLink "mixins.graph-data-graphic/sortedData:property"}}{{/crossLink}}

    @property firstSortedData
    @type Array
    @readonly
  */
  lastSortedData: function(){
  	var sortedData = this.get('sortedData');
  	return sortedData && sortedData.length > 0 ? sortedData[sortedData.length - 1] : null;
  }.property('sortedData'),
});