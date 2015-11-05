import Ember from 'ember';
import GraphPosition from 'ember-nf-graph/utils/nf/graph-position';
import { getMousePoint } from 'ember-nf-graph/utils/nf/svg-dom';
import { toArray } from 'ember-nf-graph/utils/nf/array-helpers';
import computed from 'ember-new-computed';

var Observable = Rx.Observable;

var computedBool = computed.bool;

var scaleFactoryProperty = function(axis) {
  var scaleTypeKey = axis + 'ScaleType';
  var powExponentKey = axis + 'PowerExponent';

  return computed(scaleTypeKey, powExponentKey, function(){
    var type = this.get(scaleTypeKey);
    var powExp = this.get(powExponentKey);

    type = typeof type === 'string' ? type.toLowerCase() : '';

    if(type === 'linear') {
      return d3.scale.linear;
    }

    else if(type === 'ordinal') {
      return function(){
        var scale = d3.scale.ordinal();
        // ordinal scales don't have an invert function, so we need to add one
        scale.invert = function(rv) {
          var [min, max] = d3.extent(scale.range());
          var domain = scale.domain();
          var i = Math.round((domain.length - 1) * (rv - min) / (max - min));
          return domain[i];
        };
        return scale;
      }
    }

    else if(type === 'power' || type === 'pow') {
      return function(){
        return d3.scale.pow().exponent(powExp);
      };
    }

    else if(type === 'log') {
      return d3.scale.log;
    }

    else {
      Ember.warn('unknown scale type: ' + type);
      return d3.scale.linear;
    }
  });
};

var domainProperty = function(axis) {
  var dataKey = axis + 'UniqueData';
  var minKey = axis + 'Min';
  var maxKey = axis + 'Max';
  var scaleTypeKey = axis + 'ScaleType';
  var logMinKey = axis + 'LogMin';

  return computed(dataKey + '.[]', minKey, maxKey, scaleTypeKey, logMinKey, function(){
    var data = this.get(dataKey);
    var min = this.get(minKey);
    var max = this.get(maxKey);
    var scaleType = this.get(scaleTypeKey);
    var logMin = this.get(logMinKey);
    var domain = null;

    if(scaleType === 'ordinal') {
      domain = data;
    } else {
      var extent = [min, max];

      if(scaleType === 'log') {
        if (extent[0] <= 0) {
          extent[0] = logMin;
        }
        if (extent[1] <= 0) {
          extent[1] = logMin;
        }
      }

      domain = extent;
    }

    return domain;
  });
};

var scaleProperty = function(axis) {
  var scaleFactoryKey = axis + 'ScaleFactory';
  var rangeKey = axis + 'Range';
  var domainKey = axis + 'Domain';
  var scaleTypeKey = axis + 'ScaleType';
  var ordinalPaddingKey = axis + 'OrdinalPadding';
  var ordinalOuterPaddingKey = axis + 'OrdinalOuterPadding';

  return computed(
    scaleFactoryKey,
    rangeKey,
    scaleTypeKey,
    ordinalPaddingKey,
    domainKey,
    ordinalOuterPaddingKey,
    function(){
      var scaleFactory = this.get(scaleFactoryKey);
      var range = this.get(rangeKey);
      var domain = this.get(domainKey);
      var scaleType = this.get(scaleTypeKey);
      var ordinalPadding = this.get(ordinalPaddingKey);
      var ordinalOuterPadding = this.get(ordinalOuterPaddingKey);

      var scale = scaleFactory();

      if(scaleType === 'ordinal') {
        scale = scale.domain(domain).rangeBands(range, ordinalPadding, ordinalOuterPadding);
      } else {
        scale = scale.domain(domain).range(range).clamp(true);
      }

      return scale;
    }
  );
};

var minProperty = function(axis, defaultTickCount){
  var _DataExtent_ = axis + 'DataExtent';
  var _MinMode_ = axis + 'MinMode';
  var _Axis_tickCount_ = axis + 'Axis.tickCount';
  var _ScaleFactory_ = axis + 'ScaleFactory';
  var __Min_ = '_' + axis + 'Min';
  var _prop_ = axis + 'Min';
  var _autoScaleEvent_ = 'didAutoUpdateMin' + axis.toUpperCase();

  return computed(
    _MinMode_,
    _DataExtent_,
    _Axis_tickCount_,
    _ScaleFactory_,
    {
      get() {
        var mode = this.get(_MinMode_);
        var ext;

        var change = val => {
          this.set(_prop_, val);
          this.trigger(_autoScaleEvent_);
        };

        if(mode === 'auto') {
          change(this.get(_DataExtent_)[0] || 0);
        }

        else if(mode === 'push') {
          ext = this.get(_DataExtent_)[0];
          if(!isNaN(ext) && ext < this[__Min_]) {
            change(ext);
          }
        }

        else if(mode === 'push-tick') {
          var extent = this.get(_DataExtent_);
          ext = extent[0];

          if(!isNaN(ext) && ext < this[__Min_]) {
            var tickCount = this.get(_Axis_tickCount_) || defaultTickCount;
            var newDomain = this.get(_ScaleFactory_)().domain(extent).nice(tickCount).domain();
            change(newDomain[0]);
          }
        }

        return this[__Min_];
      },
      set(key, value) {
        if (value !== undefined) {
          this[__Min_] = value;
        }
        return this[__Min_];
      }
    }
  );
};

var maxProperty = function(axis, defaultTickCount) {
  var _DataExtent_ = axis + 'DataExtent';
  var _Axis_tickCount_ = axis + 'Axis.tickCount';
  var _ScaleFactory_ = axis + 'ScaleFactory';
  var _MaxMode_ = axis + 'MaxMode';
  var __Max_ = '_' + axis + 'Max';
  var _prop_ = axis + 'Max';
  var _autoScaleEvent_ = 'didAutoUpdateMax' + axis.toUpperCase();

  return computed(
    _MaxMode_,
    _DataExtent_,
    _ScaleFactory_,
    _Axis_tickCount_,
    {
      get() {
        var mode = this.get(_MaxMode_);
        var ext;

        var change = val => {
          this.set(_prop_, val);
          this.trigger(_autoScaleEvent_);
        };

        if(mode === 'auto') {
          change(this.get(_DataExtent_)[1] || 1);
        }

        else if(mode === 'push') {
          ext = this.get(_DataExtent_)[1];
          if(!isNaN(ext) && this[__Max_] < ext) {
            change(ext);
          }
        }

        else if(mode === 'push-tick') {
          var extent = this.get(_DataExtent_);
          ext = extent[1];

          if(!isNaN(ext) && this[__Max_] < ext) {
            var tickCount = this.get(_Axis_tickCount_) || defaultTickCount;
            var newDomain = this.get(_ScaleFactory_)().domain(extent).nice(tickCount).domain();
            change(newDomain[1]);
          }
        }

        return this[__Max_];
      },
      set(key, value) {
        if (value !== undefined) {
          this[__Max_] = value;
        }
        return this[__Max_];
      }
    }
  );
};

/**
  A container component for building complex Cartesian graphs.

  ## Minimal example

       {{#nf-graph width=100 height=50}}
         {{#nf-graph-content}}
           {{nf-line data=lineData xprop="foo" yprop="bar"}}
         {{/nf-graph-content}}
       {{/nf-graph}}

  The above will create a simple 100x50 graph, with no axes, and a single line
  plotting the data it finds on each object in the array `lineData` at properties
  `foo` and `bar` for x and y values respectively.

  ## More advanced example

       {{#nf-graph width=500 height=300}}
         {{#nf-x-axis height="50" as |tick|}}
           <text>{{tick.value}}</text>
         {{/nf-x-axis}}

         {{#nf-y-axis width="120" as |tick|}}
           <text>{{tick.value}}</text>
         {{/nf-y-axis}}

         {{#nf-graph-content}}
           {{nf-line data=lineData xprop="foo" yprop="bar"}}
         {{/nf-graph-content}}
       {{/nf-graph}}

  The above example will create a 500x300 graph with both axes visible. The graph will not
  render either axis unless its component is present.


  @namespace components
  @class nf-graph
  @extends Ember.Component
*/
export default Ember.Component.extend({
  tagName: 'div',

  /**
    The exponent to use for xScaleType "pow" or "power".
    @property xPowerExponent
    @type Number
    @default 3
  */
  xPowerExponent: 3,

  /**
    The exponent to use for yScaleType "pow" or "power".
    @property yPowerExponent
    @type Number
    @default 3
  */
  yPowerExponent: 3,

  /**
    The min value to use for xScaleType "log" if xMin <= 0
    @property xLogMin
    @type Number
    @default 0.1
  */
  xLogMin: 0.1,

  /**
    The min value to use for yScaleType "log" if yMin <= 0
    @property yLogMin
    @type Number
    @default 0.1
  */
  yLogMin: 0.1,

  /**
    Allows child compoenents to identify graph parent.
    @property isGraph
    @private
  */
  isGraph: true,

  /**
    Identifies this graph to its children as providing scales.
    @property isScaleSource
    @private
  */
  isScaleSource: true,

  /**
    @property hasRendered
    @private
  */
  hasRendered: false,

  /**
    Gets or sets the whether or not multiple selectable graphics may be
    selected simultaneously.
    @property selectMultiple
    @type Boolean
    @default false
  */
  selectMultiple: false,

  /**
    The width of the graph in pixels.
    @property width
    @type Number
    @default 300
  */
  width: 300,

  /**
    The height of the graph in pixels.
    @property height
    @type Number
    @default 100
  */
  height: 100,

  /**
    The padding at the top of the graph
    @property paddingTop
    @type Number
    @default 0
  */
  paddingTop: 0,

  /**
    The padding at the left of the graph
    @property paddingLeft
    @type Number
    @default 0
  */
  paddingLeft: 0,

  /**
    The padding at the right of the graph
    @property paddingRight
    @type Number
    @default 0
  */
  paddingRight: 0,

  /**
    The padding at the bottom of the graph
    @property paddingBottom
    @type Number
    @default 0
  */
  paddingBottom: 0,

  /**
    Determines whether to display "lanes" in the background of
    the graph.
    @property showLanes
    @type Boolean
    @default false
  */
  showLanes: false,

  /**
    Determines whether to display "frets" in the background of
    the graph.
    @property showFrets
    @type Boolean
    @default false
  */
  showFrets: false,

  /**
    The type of scale to use for x values.

    Possible Values:
    - `'linear'` - a standard linear scale
    - `'log'` - a logarithmic scale
    - `'power'` - a power-based scale (exponent = 3)
    - `'ordinal'` - an ordinal scale, used for ordinal data. required for bar graphs.

    @property xScaleType
    @type String
    @default 'linear'
  */
  xScaleType: 'linear',

  /**
    The type of scale to use for y values.

    Possible Values:
    - `'linear'` - a standard linear scale
    - `'log'` - a logarithmic scale
    - `'power'` - a power-based scale (exponent = 3)
    - `'ordinal'` - an ordinal scale, used for ordinal data. required for bar graphs.

    @property yScaleType
    @type String
    @default 'linear'
  */
  yScaleType: 'linear',

  /**
    The padding between value steps when `xScaleType` is `'ordinal'`
    @property xOrdinalPadding
    @type Number
    @default 0.1
  */
  xOrdinalPadding: 0.1,

  /**
    The padding at the ends of the domain data when `xScaleType` is `'ordinal'`
    @property xOrdinalOuterPadding
    @type Number
    @default 0.1
  */
  xOrdinalOuterPadding: 0.1,

  /**
    The padding between value steps when `xScaleType` is `'ordinal'`
    @property yOrdinalPadding
    @type Number
    @default 0.1
  */
  yOrdinalPadding: 0.1,

  /**
    The padding at the ends of the domain data when `yScaleType` is `'ordinal'`
    @property yOrdinalOuterPadding
    @type Number
    @default 0.1
  */
  yOrdinalOuterPadding: 0.1,

  /**
    the `nf-y-axis` component is registered here if there is one present
    @property yAxis
    @readonly
    @default null
  */
  yAxis: null,

  /**
    The `nf-x-axis` component is registered here if there is one present
    @property xAxis
    @readonly
    @default null
  */
  xAxis: null,

  /**
    Backing field for `xMin`
    @property _xMin
    @private
  */
  _xMin: null,

  /**
    Backing field for `xMax`
    @property _xMax
    @private
  */
  _xMax: null,

  /**
    Backing field for `yMin`
    @property _yMin
    @private
  */
  _yMin: null,

  /**
    Backing field for `yMax`
    @property _yMax
    @private
  */
  _yMax: null,

  /**
    Gets or sets the minimum x domain value to display on the graph.
    Behavior depends on `xMinMode`.
    @property xMin
  */
  xMin: minProperty('x', 8),

  /**
    Gets or sets the maximum x domain value to display on the graph.
    Behavior depends on `xMaxMode`.
    @property xMax
  */
  xMax: maxProperty('x', 8),

  /**
    Gets or sets the minimum y domain value to display on the graph.
    Behavior depends on `yMinMode`.
    @property yMin
  */
  yMin: minProperty('y', 5),

  /**
    Gets or sets the maximum y domain value to display on the graph.
    Behavior depends on `yMaxMode`.
    @property yMax
  */
  yMax: maxProperty('y', 5),


  /**
    Sets the behavior of `xMin` for the graph.

    ### Possible values:

    - 'auto': (default) xMin is always equal to the minimum domain value contained in the graphed data. Cannot be set.
    - 'fixed': xMin can be set to an exact value and will not change based on graphed data.
    - 'push': xMin can be set to a specific value, but will update if the minimum x value contained in the graph is less than
      what xMin is currently set to.
    - 'push-tick': xMin can be set to a specific value, but will update to next "nice" tick if the minimum x value contained in
      the graph is less than that xMin is set to.

    @property xMinMode
    @type String
    @default 'auto'
  */
  xMinMode: 'auto',

  /**
    Sets the behavior of `xMax` for the graph.

    ### Possible values:

    - 'auto': (default) xMax is always equal to the maximum domain value contained in the graphed data. Cannot be set.
    - 'fixed': xMax can be set to an exact value and will not change based on graphed data.
    - 'push': xMax can be set to a specific value, but will update if the maximum x value contained in the graph is greater than
      what xMax is currently set to.
    - 'push-tick': xMax can be set to a specific value, but will update to next "nice" tick if the maximum x value contained in
      the graph is greater than that xMax is set to.

    @property xMaxMode
    @type String
    @default 'auto'
  */
  xMaxMode: 'auto',

  /**
    Sets the behavior of `yMin` for the graph.

    ### Possible values:

    - 'auto': (default) yMin is always equal to the minimum domain value contained in the graphed data. Cannot be set.
    - 'fixed': yMin can be set to an exact value and will not change based on graphed data.
    - 'push': yMin can be set to a specific value, but will update if the minimum y value contained in the graph is less than
      what yMin is currently set to.
    - 'push-tick': yMin can be set to a specific value, but will update to next "nice" tick if the minimum y value contained in
      the graph is less than that yMin is set to.

    @property yMinMode
    @type String
    @default 'auto'
  */
  yMinMode: 'auto',

  /**
    Sets the behavior of `yMax` for the graph.

    ### Possible values:

    - 'auto': (default) yMax is always equal to the maximum domain value contained in the graphed data. Cannot be set.
    - 'fixed': yMax can be set to an exact value and will not change based on graphed data.
    - 'push': yMax can be set to a specific value, but will update if the maximum y value contained in the graph is greater than
      what yMax is currently set to.
    - 'push-tick': yMax can be set to a specific value, but will update to next "nice" tick if the maximum y value contained in
      the graph is greater than that yMax is set to.

    @property yMaxMode
    @type String
    @default 'auto'
  */
  yMaxMode: 'auto',

  /**
    The data extents for all data in the registered `graphics`.

    @property dataExtents
    @type {Object}
    @default {
      xMin: Number.MAX_VALUE,
      xMax: Number.MIN_VALUE,
      yMin: Number.MAX_VALUE,
      yMax: Number.MIN_VALUE
    }
  */
  dataExtents: computed('graphics.[].data', function(){
    var graphics = this.get('graphics');
    return graphics.reduce((c, x) => c.concat(x.get('mappedData')), []).reduce((extents, [x, y]) => {
      extents.xMin = extents.xMin < x ? extents.xMin : x;
      extents.xMax = extents.xMax > x ? extents.xMax : x;
      extents.yMin = extents.yMin < y ? extents.yMin : y;
      extents.yMax = extents.yMax > y ? extents.yMax : y;
      return extents;
    }, {
      xMin: Number.MAX_VALUE,
      xMax: Number.MIN_VALUE,
      yMin: Number.MAX_VALUE,
      yMax: Number.MIN_VALUE
    });
  }),

  /**
    The action to trigger when the graph automatically updates the xScale
    due to an "auto" "push" or "push-tick" domainMode.

    sends the graph component instance value as the argument.

    @property autoScaleXAction
    @type {string}
    @default null
  */
  autoScaleXAction: null,

  _sendAutoUpdateXAction() {
    this.sendAction('autoScaleXAction', this);
  },

  _sendAutoUpdateYAction() {
    this.sendAction('autoScaleYAction', this);
  },

  /**
    Event handler that is fired for the `didAutoUpdateMaxX` event
    @method didAutoUpdateMaxX
  */
  didAutoUpdateMaxX() {
    Ember.run.once(this, this._sendAutoUpdateXAction);
  },

  /**
    Event handler that is fired for the `didAutoUpdateMinX` event
    @method didAutoUpdateMinX
  */
  didAutoUpdateMinX() {
    Ember.run.once(this, this._sendAutoUpdateXAction);
  },

  /**
    Event handler that is fired for the `didAutoUpdateMaxY` event
    @method didAutoUpdateMaxY
  */
  didAutoUpdateMaxY() {
    Ember.run.once(this, this._sendAutoUpdateYAction);
  },

  /**
    Event handler that is fired for the `didAutoUpdateMinY` event
    @method didAutoUpdateMinY
  */
  didAutoUpdateMinY() {
    Ember.run.once(this, this._sendAutoUpdateYAction);
  },

  /**
    The action to trigger when the graph automatically updates the yScale
    due to an "auto" "push" or "push-tick" domainMode.

    Sends the graph component instance as the argument.

    @property autoScaleYAction
    @type {string}
    @default null
  */
  autoScaleYAction: null,

  /**
    Gets the highest and lowest x values of the graphed data in a two element array.
    @property xDataExtent
    @type Array
    @readonly
  */
  xDataExtent: computed('dataExtents', function(){
    var { xMin, xMax } = this.get('dataExtents');
    return [xMin, xMax];
  }),

  /**
    Gets the highest and lowest y values of the graphed data in a two element array.
    @property yDataExtent
    @type Array
    @readonly
  */
  yDataExtent: computed('dataExtents', function(){
    var { yMin, yMax } = this.get('dataExtents');
    return [yMin, yMax];
  }),

  /**
    @property xUniqueData
    @type Array
    @readonly
  */
  xUniqueData: computed('graphics.[].mappedData', function(){
    var graphics = this.get('graphics');
    var uniq = graphics.reduce((uniq, graphic) => {
      return graphic.get('mappedData').reduce((uniq, d) => {
        if(!uniq.some(x => x === d[0])) {
          uniq.push(d[0]);
        }
        return uniq;
      }, uniq);
    }, []);
    return Ember.A(uniq);
  }),


  /**
    @property yUniqueData
    @type Array
    @readonly
  */
  yUniqueData: computed('graphics.[].mappedData', function(){
    var graphics = this.get('graphics');
    var uniq = graphics.reduce((uniq, graphic) => {
      return graphic.get('mappedData').reduce((uniq, d) => {
        if(!uniq.some(y => y === d[1])) {
          uniq.push(d[1]);
        }
        return uniq;
      }, uniq);
    }, []);
    return Ember.A(uniq);
  }),

  /**
    Gets the DOM id for the content clipPath element.
    @property contentClipPathId
    @type String
    @readonly
    @private
  */
  contentClipPathId: computed('elementId', function(){
    return this.get('elementId') + '-content-mask';
  }),

  /**
    Registry of contained graphic elements such as `nf-line` or `nf-area` components.
    This registry is used to pool data for scaling purposes.
    @property graphics
    @type Array
    @readonly
   */
  graphics: computed(function(){
    return Ember.A();
  }),

  /**
    An array of "selectable" graphics that have been selected within this graph.
    @property selected
    @type Array
    @readonly
  */
  selected: null,

  /**
    Computed property to show yAxis. Returns `true` if a yAxis is present.
    @property showYAxis
    @type Boolean
    @default false
   */
  showYAxis: computedBool('yAxis'),

  /**
    Computed property to show xAxis. Returns `true` if an xAxis is present.
    @property showXAxis
    @type Boolean
    @default false
   */
  showXAxis: computedBool('xAxis'),

  /**
    Gets a function to create the xScale
    @property xScaleFactory
    @readonly
   */
  xScaleFactory: scaleFactoryProperty('x'),

  /**
    Gets a function to create the yScale
    @property yScaleFactory
    @readonly
   */
  yScaleFactory: scaleFactoryProperty('y'),

  /**
    Gets the domain of x values.
    @property xDomain
    @type Array
    @readonly
   */
  xDomain: domainProperty('x'),

  /**
    Gets the domain of y values.
    @property yDomain
    @type Array
    @readonly
   */
  yDomain: domainProperty('y'),

  /**
    Gets the current xScale used to draw the graph.
    @property xScale
    @type Function
    @readonly
   */
  xScale: scaleProperty('x'),

  /**
    Gets the current yScale used to draw the graph.
    @property yScale
    @type Function
    @readonly
   */
  yScale: scaleProperty('y'),

  /**
    Registers a graphic such as `nf-line` or `nf-area` components with the graph.
    @method registerGraphic
    @param graphic {Ember.Component} The component object to register
   */
  registerGraphic: function (graphic) {
    var graphics = this.get('graphics');
    graphics.pushObject(graphic);
    graphic.on('hasData', this, this.updateExtents);
  },

  /**
    Unregisters a graphic such as an `nf-line` or `nf-area` from the graph.
    @method unregisterGraphic
    @param graphic {Ember.Component} The component to unregister
   */
  unregisterGraphic: function(graphic) {
    graphic.off('hasData', this, this.updateExtents);
    var graphics = this.get('graphics');
    graphics.removeObject(graphic);
  },

  updateExtents() {
    this.get('xDataExtent');
    this.get('yDataExtent');
  },

  /**
    The y range of the graph in pixels. The min and max pixel values
    in an array form.
    @property yRange
    @type Array
    @readonly
   */
  yRange: computed('graphHeight', function(){
    return [this.get('graphHeight'), 0];
  }),

  /**
    The x range of the graph in pixels. The min and max pixel values
    in an array form.
    @property xRange
    @type Array
    @readonly
   */
  xRange: computed('graphWidth', function(){
    return [0, this.get('graphWidth')];
  }),

  /**
    Returns `true` if the graph has data to render. Data is conveyed
    to the graph by registered graphics.
    @property hasData
    @type Boolean
    @default false
    @readonly
   */
  hasData: computed.notEmpty('graphics'),

  /**
    The x coordinate position of the graph content
    @property graphX
    @type Number
    @readonly
   */
  graphX: computed('paddingLeft', 'yAxis.width', 'yAxis.orient', function() {
    var paddingLeft = this.get('paddingLeft');
    var yAxisWidth = this.get('yAxis.width') || 0;
    var yAxisOrient = this.get('yAxis.orient');
    if(yAxisOrient === 'right') {
      return paddingLeft;
    }
    return paddingLeft + yAxisWidth;
  }),

  /**
    The y coordinate position of the graph content
    @property graphY
    @type Number
    @readonly
   */
  graphY: computed('paddingTop', 'xAxis.orient', 'xAxis.height', function(){
    var paddingTop = this.get('paddingTop');
    var xAxisOrient = this.get('xAxis.orient');
    if(xAxisOrient === 'top') {
      var xAxisHeight = this.get('xAxis.height') || 0;
      return xAxisHeight + paddingTop;
    }
    return paddingTop;
  }),

  /**
    The width, in pixels, of the graph content
    @property graphWidth
    @type Number
    @readonly
   */
  graphWidth: computed('width', 'paddingRight', 'paddingLeft', 'yAxis.width', function() {
    var paddingRight = this.get('paddingRight') || 0;
    var paddingLeft = this.get('paddingLeft') || 0;
    var yAxisWidth = this.get('yAxis.width') || 0;
    var width = this.get('width') || 0;
    return Math.max(0, width - paddingRight - paddingLeft - yAxisWidth);
  }),

  /**
    The height, in pixels, of the graph content
    @property graphHeight
    @type Number
    @readonly
   */
  graphHeight: computed('height', 'paddingTop', 'paddingBottom', 'xAxis.height', function(){
    var paddingTop = this.get('paddingTop') || 0;
    var paddingBottom = this.get('paddingBottom') || 0;
    var xAxisHeight = this.get('xAxis.height') || 0;
    var height = this.get('height') || 0;
    return Math.max(0, height - paddingTop - paddingBottom - xAxisHeight);
  }),

  /**
    An SVG transform to position the graph content
    @property graphTransform
    @type String
    @readonly
   */
  graphTransform: computed('graphX', 'graphY', function(){
    var graphX = this.get('graphX');
    var graphY = this.get('graphY');
    return `translate(${graphX} ${graphY})`;
  }),

  /**
    Sets `hasRendered` to `true` on `willInsertElement`.
    @method _notifyHasRendered
    @private
  */
  _notifyHasRendered: Ember.on('willInsertElement', function () {
    this.set('hasRendered', true);
  }),

  /**
    Gets the mouse position relative to the container
    @method mousePoint
    @param container {SVGElement} the SVG element that contains the mouse event
    @param e {Object} the DOM mouse event
    @return {Array} an array of `[xMouseCoord, yMouseCoord]`
   */
  mousePoint: function (container, e) {
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = e.clientX;
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      return [ point.x, point.y ];
    }
    var rect = container.getBoundingClientRect();
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
  },

  /**
    A computed property returned the view's controller.
    @property parentController
    @type Ember.Controller
    @readonly
  */
  parentController: computed.alias('templateData.view.controller'),

  /**
    Selects the graphic passed. If `selectMultiple` is false, it will deselect the currently
    selected graphic if it's different from the one passed.
    @method selectGraphic
    @param graphic {Ember.Component} the graph component to select within the graph.
  */
  selectGraphic: function(graphic) {
    if(!graphic.get('selected')) {
      graphic.set('selected', true);
    }
    if(this.selectMultiple) {
      this.get('selected').pushObject(graphic);
    } else {
      var current = this.get('selected');
      if(current && current !== graphic) {
        current.set('selected', false);
      }
      this.set('selected', graphic);
    }
  },

  /**
    deselects the graphic passed.
    @method deselectGraphic
    @param graphic {Ember.Component} the graph child component to deselect.
  */
  deselectGraphic: function(graphic) {
    graphic.set('selected', false);
    if(this.selectMultiple) {
      this.get('selected').removeObject(graphic);
    } else {
      var current = this.get('selected');
      if(current && current === graphic) {
        this.set('selected', null);
      }
    }
  },

  /**
    The initialization method. Fired on `init`.
    @method _setup
    @private
  */
  init() {
    this._super(...arguments);
    this.set('selected', this.selectMultiple ? Ember.A() : null);
  },

  /**
    The amount of leeway, in pixels, to give before triggering a brush start.
    @property brushThreshold
    @type {Number}
    @default 7
  */
  brushThreshold: 7,

  /**
    The name of the action to trigger when brushing starts
    @property brushStartAction
    @type {String}
    @default null
  */
  brushStartAction: null,

  /**
    The name of the action to trigger when brushing emits a new value
    @property brushAction
    @type {String}
    @default null
  */
  brushAction: null,

  /**
    The name of the action to trigger when brushing ends
    @property brushEndAction
    @type {String}
    @default null
  */
  brushEndAction: null,

  _setupBrushAction: Ember.on('didInsertElement', function(){
    var content = this.$('.nf-graph-content');

    var mouseMoves = Observable.fromEvent(content, 'mousemove');
    var mouseDowns = Observable.fromEvent(content, 'mousedown');
    var mouseUps = Observable.fromEvent(Ember.$(document), 'mouseup');
    var mouseLeaves = Observable.fromEvent(content, 'mouseleave');

    this._brushDisposable = Observable.merge(mouseDowns, mouseMoves, mouseLeaves).
      // get a streams of mouse events that start on mouse down and end on mouse up
      window(mouseDowns, function() { return mouseUps; })
      // filter out all of them if there are no brush actions registered
      // map the mouse event streams into brush event streams
      .map(x => this._toBrushEventStreams(x)).
      // flatten to a stream of action names and event objects
      flatMap(x => this._toComponentEventStream(x)).
      // HACK: this is fairly cosmetic, so skip errors.
      retry().
      // subscribe and send the brush actions via Ember
      subscribe(x => {
        Ember.run(this, () => this._triggerComponentEvent(x));
      });
  }),

  _toBrushEventStreams: function(mouseEvents) {
    // get the starting mouse event
    return mouseEvents.take(1).
      // calculate it's mouse point and info
      map( this._getStartInfo ).
      // combine the start with the each subsequent mouse event
      combineLatest(mouseEvents.skip(1), toArray).
      // filter out everything until the brushThreshold is crossed
      filter(x => this._byBrushThreshold(x)).
      // create the brush event object
      map(x => this._toBrushEvent(x));
  },

  _triggerComponentEvent: function(d) {
    this.trigger(d[0], d[1]);
  },

  _toComponentEventStream: function(events) {
    return Observable.merge(
      events.take(1).map(function(e) {
        return ['didBrushStart', e];
      }), events.map(function(e) {
        return ['didBrush', e];
      }), events.last().map(function(e) {
        return ['didBrushEnd', e];
      })
    );
  },

  didBrush: function(e) {
    if(this.get('brushAction')) {
      this.sendAction('brushAction', e);
    }
  },

  didBrushStart: function(e) {
    document.body.style.setProperty('-webkit-user-select', 'none');
    document.body.style.setProperty('-moz-user-select', 'none');
    document.body.style.setProperty('user-select', 'none');
    if(this.get('brushStartAction')) {
      this.sendAction('brushStartAction', e);
    }
  },

  didBrushEnd: function(e) {
    document.body.style.removeProperty('-webkit-user-select');
    document.body.style.removeProperty('-moz-user-select');
    document.body.style.removeProperty('user-select');
    if(this.get('brushEndAction')) {
      this.sendAction('brushEndAction', e);
    }
  },

  _toBrushEvent: function(d) {
    var start = d[0];
    var currentEvent =  d[1];
    var currentPoint = getMousePoint(currentEvent.currentTarget, d[1]);

    var startPosition = GraphPosition.create({
      originalEvent: start.originalEvent,
      graph: this,
      graphX: start.mousePoint.x,
      graphY: start.mousePoint.y
    });

    var currentPosition = GraphPosition.create({
      originalEvent: currentEvent,
      graph: this,
      graphX: currentPoint.x,
      graphY: currentPoint.y
    });

    var left = startPosition;
    var right = currentPosition;

    if(start.originalEvent.clientX > currentEvent.clientX) {
      left = currentPosition;
      right = startPosition;
    }

    return {
      start: startPosition,
      current: currentPosition,
      left: left,
      right: right
    };
  },

  _byBrushThreshold: function(d) {
    var startEvent = d[0].originalEvent;
    var currentEvent = d[1];
    return Math.abs(currentEvent.clientX - startEvent.clientX) > this.get('brushThreshold');
  },

  _getStartInfo: function(e) {
    return {
      originalEvent: e,
      mousePoint: getMousePoint(e.currentTarget, e)
    };
  },

  willDestroyElement: function(){
    if(this._brushDisposable) {
      this._brushDisposable.dispose();
    }
  },
});
