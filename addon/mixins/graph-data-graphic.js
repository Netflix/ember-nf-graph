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

  mappedData: computed('data.[]', {
    get() {
      var yPropFn = this.get('yPropFn');
      var xPropFn = this.get('xPropFn');
      var data = this.get('data');
      if(Ember.isArray(data)) {
        return data.map(function(d, i) {
          var item = [xPropFn(d), yPropFn(d)];
          item.data = d;
          item.origIndex = i;
          return item;
        });
      }
      return [];
    }
  }),

  _triggerHasData: on('init', observer('data.[]', function(){
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
    'mappedData.[]',
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
    @property firstVisibleData
    @type {Object}
    @readonly
  */
  firstVisibleData: computed('renderedData.[]', 'xMin', {
    get() {
      var { renderedData, xPropFn, yPropFn, xMin } = this.getProperties('renderedData', 'xPropFn', 'yPropFn', 'xMin');

      var first = renderedData[0];
      if(first && xMin > first[0] && renderedData.length > 1) {
        first = renderedData[1];
      }

      return first ? {
        x: xPropFn(first.data),
        y: yPropFn(first.data),
        data: first.data,
        renderX: first[0],
        renderY: first[1]
      } : null;
    }
  }),


  /**
    The last element from {{#crossLink "mixins.graph-data-graphic/renderedData:property"}}{{/crossLink}}
    that is actually visible within the x domain.
    @property lastVisibleData
    @type {Object}
    @readonly
  */
  lastVisibleData: computed('renderedData.[]', 'yPropFn', 'xPropFn', 'xMax', {
    get() {
      var { renderedData, xPropFn, yPropFn, xMax } = this.getProperties('renderedData', 'xPropFn', 'yPropFn', 'xMax');
      var last = renderedData[renderedData.length - 1];

      if(last && xMax < last[0] && renderedData.length > 1) {
        last = renderedData[renderedData.length - 2];
      }

      return last ? {
        x: xPropFn(last.data),
        y: yPropFn(last.data),
        data: last.data,
        renderX: last[0],
        renderY: last[1]
      }: null;
    }
  }),

  _getRenderedDataNearXRange: function(rangeX) {
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

  getDataNearXRange(rangeX) {
    var rendered = this._getRenderedDataNearXRange(rangeX);

    if(!rendered) {
      return null;
    }

    var renderX = rendered[0];
    var renderY = rendered[1];
    var data = rendered.data;
    var { x, y } = this.getActualTrackData(renderX, renderY, data);

    return { renderX, renderY, data, x, y };
  },

  /**
    Gets the actual data at a rendered tracking point passed to it.
    This is overridden in nf-area to account for stacking of data.
    @method getActualTrackData
    @param renderX {number} the x domain value the data is rendered at
    @param renderY {number} the y domain value the data is rendered at
    @param data {Object} the raw data from the point
    @return {Object} simple x, y point structure
  */
  getActualTrackData(renderX, renderY, data) {
    return { x: renderX, y: renderY, data };
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
