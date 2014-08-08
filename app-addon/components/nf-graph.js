import Ember from 'ember';
import { property, observer } from '../utils/computed-property-helpers';

var SCALE_TYPES = {
  'linear': d3.scale.linear,
  'power': function () {
    return d3.scale.pow().exponent(3);
  },
  'log': d3.scale.log,
  'ordinal': d3.scale.ordinal
};

var computedBool = Ember.computed.bool;

var scaleFactoryProperty = function(axis) {
  return property(axis + 'ScaleType', function (type) {
    var factory = SCALE_TYPES[type];
    if (!factory) {
      throw new Error('invalid scale type: ' + type);
    }
    return factory;
  });
};

var domainProperty = function(axis) {
  return property(
    axis + 'Data', axis + 'Min', axis + 'Max', axis + 'ScaleType',
    function(data, min, max, scaleType) {
      var domain = null;

      if(scaleType === 'ordinal') {
        domain = data;
      } else {
        var extent = [min, max];

        if(scaleType === 'log') {
          if (extent[0] <= 0) {
            extent[0] = 1;
          }
          if (extent[1] <= 0) {
            extent[1] = 1;
          }
        }

        domain = extent;
      }

      return domain;
    }
  );
};

var scaleProperty = function(axis) {
  return property(
    axis + 'ScaleFactory', axis + 'Range', axis + 'Domain', axis + 'ScaleType', axis + 'TickCount', axis + 'OrdinalPadding', axis + 'OrdinalOuterPadding',
    function(scaleFactory, range, domain, scaleType, tickCount, ordinalPadding, ordinalOuterPadding) {
      var scale = scaleFactory();

      if(scaleType === 'ordinal') {
        scale = scale.domain(domain).rangeRoundBands(range, ordinalPadding, ordinalOuterPadding);
      } else {        
        scale = scale.domain(domain).range(range);
      }

      return scale;
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
         {{#nf-x-axis height="50"}}
           <text>{{tick.value}}</text>
         {{/nf-x-axis}}
   
         {{#nf-y-axis width="120"}}
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
*/
export default Ember.Component.extend({
  tagName: 'div',  

  /** 
    Allows child compoenents to identify graph parent.
    @property isGraph
  */
  isGraph: true,

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

  _xMin: null,
  _xMax: null,
  _yMin: null,
  _yMax: null,

  xMin: function(key, value) {
    var mode = this.xMinMode;
    if(mode === 'fixed' && arguments.length > 1) {
      this._xMin = value;
    }

    if(mode === 'auto') {
      return this.get('xDataExtent')[0];
    }
    return this._xMin;
  }.property('xMinMode', 'xDataExtent'),

  xMax: function(key, value) {
    var mode = this.xMaxMode;
    if(mode === 'fixed' && arguments.length > 1) {
      this._xMax = value;
    }

    if(mode === 'auto') {
      return this.get('xDataExtent')[1];
    }
    return this._xMax;
  }.property('xMaxMode', 'xDataExtent'),

  yMin: function(key, value) {
    var mode = this.yMinMode;
    if(mode === 'fixed' && arguments.length > 1) {
      this._yMin = value;
    }

    if(mode === 'auto') {
      return this.get('yDataExtent')[0];
    }
    return this._yMin;
  }.property('yMinMode', 'yDataExtent'),

  yMax: function(key, value) {
    var mode = this.yMaxMode;
    if(mode === 'fixed' && arguments.length > 1) {
      this._yMax = value;
    }

    if(mode === 'auto') {
      return this.get('yDataExtent')[1];
    }
    return this._yMax;
  }.property('yMaxMode', 'yDataExtent'),
  

  xMinMode: 'auto',
  xMaxMode: 'auto',
  yMinMode: 'auto',
  yMaxMode: 'auto',

  xDataExtent: property('xData.@each', function(xData) {
    return xData && xData.length > 0 ? d3.extent(xData) : [0, 1];
  }),

  yDataExtent: property('yData.@each', function(yData) {
    return yData && yData.length > 0 ? d3.extent(yData) : [0, 1];
  }),

  /**
    Gets all x data from all graphics.
    @property xData
    @type Array
    @readonly
  */
  xData: property('graphics.@each.xData', function(graphics) {
    var all = [];
    graphics.forEach(function(graphic) {
      all = all.concat(graphic.get('xData'));
    });
    return all;
  }),

  /**
    Gets all y data from all graphics
    @property yData
    @type Array
    @readonly
  */
  yData: property('graphics.@each.yData', function(graphics) {
    var all = [];
    graphics.forEach(function(graphic) {
      all = all.concat(graphic.get('yData'));
    });
    return all;
  }),

  /**
    Registry of contained graphic elements such as `nf-line` or `nf-area` components.
    This registry is used to pool data for scaling purposes.
    @property graphics
    @type Array
    @readonly
   */
  graphics: null,

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
  },

  /**
    Unregisters a graphic such as an `nf-line` or `nf-area` from the graph.
    @method unregisterGraphic
    @param graphic {Ember.Component} The component to unregister
   */
  unregisterGraphic: function(graphic) {
    var graphics = this.get('graphics');
    graphics.removeObject(graphic);
  },
  
  /**
    The y range of the graph in pixels. The min and max pixel values
    in an array form.
    @property yRange
    @type Array
    @readonly
   */
  yRange: property('graphHeight', function (graphHeight) {
    return [graphHeight, 0];
  }),

  /**
    The x range of the graph in pixels. The min and max pixel values
    in an array form.
    @property xRange
    @type Array
    @readonly
   */
  xRange: property('graphWidth', function (graphWidth) {
    return [0, graphWidth];
  }),

  /**
    Returns `true` if the graph has data to render. Data is conveyed
    to the graph by registered graphics.
    @property hasData
    @type Boolean
    @default false
    @readonly
   */
  hasData: property('graphics', function(graphics) {
    return graphics && graphics.length > 0;
  }),

  /**
    The x coordinate position of the graph content
    @property graphX
    @type Number
    @readonly
   */
  graphX: property(
    'paddingLeft', 'yAxis.width', 'yAxis.orient', 
    function (paddingLeft, yAxisWidth, yAxisOrient) {
      if(yAxisOrient === 'right') {
        return paddingLeft;
      }
      return paddingLeft + yAxisWidth;
    }
  ),

  /** 
    The y coordinate position of the graph content
    @property graphY
    @type Number
    @readonly
   */
  graphY: property('paddingTop', 'xAxis.orient', 'xAxis.height', 
    function (paddingTop, xAxisOrient, xAxisHeight) {
      if(xAxisOrient === 'top') {
        return xAxisHeight + paddingTop;
      }
      return paddingTop;
    }
  ),

  /**
    The width, in pixels, of the graph content
    @property graphWidth
    @type Number
    @readonly
   */
  graphWidth: property('width', 'paddingRight', 'paddingLeft', 'yAxis.width',
    function (width, paddingLeft, paddingRight, yAxisWidth) {
      paddingRight = paddingRight || 0;
      paddingLeft = paddingLeft || 0;
      yAxisWidth = yAxisWidth || 0;
      return width - paddingRight - paddingLeft - yAxisWidth;
    }
  ),

  /**
    The height, in pixels, of the graph content
    @property graphHeight
    @type Number
    @readonly
   */
  graphHeight: property('height', 'paddingTop', 'paddingBottom', 'xAxis.height',
    function (height, paddingTop, paddingBottom, xAxisHeight) {
      paddingTop = paddingTop || 0;
      paddingBottom = paddingBottom || 0;
      xAxisHeight = xAxisHeight || 0;
      return height - paddingTop - paddingBottom - xAxisHeight;
    }
  ),

  /**
    An SVG transform to position the graph content
    @property graphTransform
    @type String
    @readonly
   */
  graphTransform: property('graphX', 'graphY', function (graphX, graphY) {
    return 'translate(%@, %@)'.fmt(graphX, graphY);
  }),

  /**
    Sets `hasRendered` to `true` on `willInsertElement`.
    @method _notifyHasRendered
    @private
  */
  _notifyHasRendered: function () {
    this.set('hasRendered', true);
  }.on('willInsertElement'),

  /**
    Gets the elements for the `svg` and `graphContentGroup` properties. Also wires up
    DOM events for the graph. Fires on `didInsertElement`
    @method _registerDOM
    @private
  */
  _registerDOM: function () {
    var graphContentGroup = this.$('.nf-graph-content');
    var self = this;

    this.set('svg', this.$('svg'));
    this.set('graphContentGroup', graphContentGroup);

    graphContentGroup.on('mousemove', function (e) {
      Ember.run(function () {
        var mouse = self.mousePoint(graphContentGroup[0], e);
        self.set('mouseX', mouse[0]);
        self.set('mouseY', mouse[1]);
      });
    });

    graphContentGroup.on('mouseleave', function () {
      Ember.run(function () {
        self.set('mouseX', -1);
        self.set('mouseY', -1);
      });
    });
  }.on('didInsertElement'),

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
  parentController: Ember.computed.alias('templateData.view.controller'),

  /**
    The x pixel value of the current mouse hover position.
    Will be `-1` if the mouse is not hovering over the graph content
    @property mouseX
    @type Number
    @default -1
  */
  mouseX: -1,

  /**
    The y pixel value of the current mouse hover position.
    Will be `-1` if the mouse is not hovering over the graph content.
    @property mouseY
    @type Number
    @default -1
  */
  mouseY: -1,

  /**
    Gets the x domain value at the current mouse x hover position.
    @property hoverX
    @readonly
  */
  hoverX: null,

  /**
    Gets teh y domain value at the current mouse y hover position.
    @property hoverY
    @readonly
  */
  hoverY: null,

  /**
    updates `hoverX` when `mouseX` changes or something causes the scale to change.
    @method updateHoverX
    @private
  */
  updateHoverX: observer('mouseX', 'xScale', function(mouseX, xScale){
    var hx = mouseX !== -1 && xScale && xScale.invert ? xScale.invert(mouseX) : null;
    this.set('hoverX', isNaN(hx) ? null : hx);
  }),

  /**
    updates `hoverY` when `mouseY` changes or something causes the scale to change.
    @method updateHoverY
    @private
  */  
  updateHoverY: observer('mouseY', 'yScale', function(mouseY, yScale) {
    var hy = mouseY !== -1 && yScale && yScale.invert ? yScale.invert(mouseY) : null;
    this.set('hoverY', isNaN(hy) ? null : hy);
  }),

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
  _setup: function(){
    this.set('graphics', []);
    this.set('selected', this.selectMultiple ? [] : null);
  }.on('init'),
});
