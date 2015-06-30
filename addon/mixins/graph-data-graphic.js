import Ember from 'ember';
import parsePropertyExpr from '../utils/parse-property-expression';
import { nearestIndexTo } from '../utils/nf/array-helpers';
import computed from 'ember-new-computed';

var { on, observer } = Ember;

var noop = function(){};

/**
  This is mixed in to {{#crossLink components.nf-graph}}nf-graph{{/crossLink}} child components that need to register data
  with the graph. Includes methods for extracting, sorting and scrubbing data
  for use in graphing components.

  Requires {{#crossLink "mixins.graph-registered-graphic"}}{{/crossLink}} and 
  {{#crossLink "mixins.graph-has-graph-parent"}}{{/crossLink}}

  @namespace mixins
  @class graph-data-graphic
  @extends Ember.Mixin
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

  mappedData: computed('data.@each', {
    get() {
      var yPropFn = this.get('yPropFn');
      var xPropFn = this.get('xPropFn');
      return this.get('data').map(function(d, i) {
        var item = [xPropFn(d), yPropFn(d)];
        item.data = d;
        item.origIndex = i;
        return item;
      });
    }
  }),

  _triggerHasData: on('init', observer('data.@each', function(){
    Ember.run.once(this, this._sendTriggerHasData);
  })),

  _sendTriggerHasData() {
    this.trigger('hasData', this.get('mappedData'));
  },

  /**
    The path of the property on each object in 
    {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}}
    to use as x data to plot on the graph.

    @property xprop
    @type String
    @default 'x'
  */
  xprop: 'x',

  /**
    The path of the property on each object in 
    {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}}
    to use as y data to plot on the graph.

    @property yprop
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
  xPropFn: computed('xprop', {
    get() {
      var xprop = this.get('xprop');
      return xprop ? parsePropertyExpr(xprop) : noop;
    }
  }),

  /**
    The function to get the y value from each 
    {{#crossLink "mixins.graph-data-graphic/data:property"}}{{/crossLink}} object

    @property yPropFn
    @type Function
    @readonly
  */
  yPropFn: computed('yprop', {
    get() {
      var yprop = this.get('yprop');
      return yprop ? parsePropertyExpr(yprop) : noop;
    }
  }),

  /**
    The list of data points from {{#crossLink "mixins.graph-data-graphc/mappedData:property"}}{{/crossLink}} that
    fits within the x domain, plus up to one data point outside of that domain in each direction.
    @property renderedData
    @type Array
    @readonly
  */
  renderedData: computed(
    'mappedData.@each',
    'graph.xScaleType',
    'graph.xMin',
    'graph.xMax',
    {
      get() {
        var mappedData = this.get('mappedData');
        var graph = this.get('graph');
        var xScaleType = graph.get('xScaleType');
        var xMin = graph.get('xMin');
        var xMax = graph.get('xMax');

        if(!mappedData || mappedData.length === 0) {
          return [];
        }

        if(xScaleType === 'ordinal') {
          return mappedData;
        }

        return mappedData.filter(function(d, i) {
          var x = d[0];
          var prev = mappedData[i-1];
          var next = mappedData[i+1];
          var prevX = prev ? prev[0] : null;
          var nextX = next ? next[0] : null;

          return between(x, xMin, xMax) || between(prevX, xMin, xMax) || between(nextX, xMin, xMax);
        });
      }
    }
  ),

  /**
    The first element from {{#crossLink "mixins.graph-data-graphic/renderedData:property"}}{{/crossLink}}
    that is actually visible within the x domain.
    @property firstSortedData
    @type Array
    @readonly
  */
  firstVisibleData: computed('renderedData.@each', 'xMin', {
    get() {
      var renderedData = this.get('renderedData');
      var xMin = this.get('xMin');
      var first = renderedData[0];
      if(first && xMin > first[0] && renderedData.length > 1) {
        first = renderedData[1];
      }
      return first ? {
        x: first[0],
        y: first[1],
        data: first.data,
      } : null;
    }
  }),


  /**
    The last element from {{#crossLink "mixins.graph-data-graphic/renderedData:property"}}{{/crossLink}}
    that is actually visible within the x domain.
    @property lastVisibleData
    @type Array
    @readonly
  */
  lastVisibleData: computed('renderedData.@each', 'xMax', {
    get() {
      var renderedData = this.get('renderedData');
      var xMax = this.get('xMax');
      var last = renderedData[renderedData.length - 1];
      if(last && xMax < last[0] && renderedData.length > 1) {
        last = renderedData[renderedData.length - 2];
      }
      return last ? {
        x: last[0],
        y: last[1],
        data: last.data,
      }: null;
    }
  }),

  getDataNearXRange: function(rangeX) {
    var xScale = this.get('xScale');
    var isLinear = xScale && xScale.invert;
    if(isLinear) {
      return this.getDataNearX(xScale.invert(rangeX));
    } else {
      //ordinal
      var range = this.get('graph.xRange');
      var v = Math.abs(rangeX - range[0]) / Math.abs(range[1] - range[0]);
      var renderedData = this.get('renderedData');
      var i = Math.floor(v * renderedData.length);
      return renderedData[i];
    }
  },

  getDataNearX: function(x) {
    x = +x;
    if(x === x) {
      var renderedData = this.get('renderedData');
      var index = nearestIndexTo(renderedData, x, function(d){
        return d ? d[0] : null;
      });
      return index !== -1 ? renderedData[index] : null;
    }
  },
});

function between(x, a, b) {
  return a <= x && x <= b;
}