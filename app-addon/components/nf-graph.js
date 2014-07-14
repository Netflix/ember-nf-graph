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

var computedAlias = Ember.computed.alias;
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
    axis + 'Data', axis + 'DomainMode', axis + 'Min', axis + 'Max', axis + 'ScaleType',
    function(data, domainMode, min, max, scaleType) {
      var domain = null;

      if(scaleType === 'ordinal') {
        this.set(axis + 'Min', data[0]);
        this.set(axis + 'Max', data[data.length - 1]);
        domain = data;
      } else {
        var extent = [min, max];

        if(domainMode === 'auto') {
          extent = d3.extent(data);
          this.set(axis + 'Min', extent[0]);
          this.set(axis + 'Max', extent[1]);
        }

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


export default Ember.Component.extend({
  tagName: 'div',
  
  isGraph: true,
  hasRendered: false,

  width: 300,
  height: 100,

  paddingTop: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,

  showLanes: false,

  xDomainMode: 'auto',
  yDomainMode: 'auto',

  xScaleType: 'linear',
  yScaleType: 'linear',
  
  xOrdinalPadding: 0.1,
  xOrdinalOuterPadding: 0.1,

  yOrdinalPadding: 0.1,
  yOrdinalOuterPadding: 0.1,

  yAxis: null,
  xAxis: null,

  _xMin: 0,
  _xMax: 1,
  _yMin: 0,
  _yMax: 1,  

  xMin: computedAlias('_xMin'),
  xMax: computedAlias('_xMax'),
  yMin: computedAlias('_yMin'),
  yMax: computedAlias('_yMax'),

  graphics: computedAlias('_graphics'),
  showYAxis: computedBool('yAxis'),
  showXAxis: computedBool('xAxis'),

  _graphicsSortedDataChanged: observer(
    'graphics.@each.sortedData', 
    function(graphics){
      var all = graphics.reduce(function(all, graphic) {
        all = all.concat(graphic.get('sortedData') || []);
        return all;
      }, []);

      this.set('xData', all.map(function(d) { return d[0]; }));
      this.set('yData', all.map(function(d) { return d[1]; }));
    }
  ),

  xScaleFactory: scaleFactoryProperty('x'),
  yScaleFactory: scaleFactoryProperty('y'),

  xDomain: domainProperty('x'),
  yDomain: domainProperty('y'),

  xScale: scaleProperty('x'),
  yScale: scaleProperty('y'),

  // used to register lines, areas, etc.
  registerGraphic: function (graphic) {
    var graphics = this.get('graphics');
    graphics.pushObject(graphic);
  },

  unregisterGraphic: function(graphic) {
    var graphics = this.get('graphics');
    graphics.removeObject(graphic);
  },

  _hoverChangeHandlers: property(function(){
    return [];
  }),

  _hoverEndHandlers: property(function(){
    return [];
  }),

  hoverChange: function(handler) {
    this.get('_hoverChangeHandlers').pushObject(handler);
  },

  hoverEnd: function(handler) {
    this.get('_hoverEndHandlers').pushObject(handler);
  },
  
  onDidGraphHoverChange: function (e, mouseX, mouseY) {
    var graphics = this.get('graphics');
    
    if (!graphics) {
      return;
    }

    var data = {
      x: mouseX,
      y: mouseY
    };

    this.get('_hoverChangeHandlers').forEach(function(handler) {
      handler(e, data);
    });
  },

  onDidGraphHoverEnd: function (e) {
    var graphics = this.get('graphics');
    if (!graphics) {
      return;
    }

    this.get('_hoverEndHandlers').forEach(function(handler) {
      handler(e);
    });
  },

  yRange: property('graphHeight', function (graphHeight) {
    return [graphHeight, 0];
  }),

  xRange: property('graphWidth', function (graphWidth) {
    return [0, graphWidth];
  }),

  hasData: property('graphics', function(graphics) {
    return graphics && graphics.length > 0;
  }),

  graphX: property(
    'paddingLeft', 'yAxis.width', 'yAxis.orient', 
    function (paddingLeft, yAxisWidth, yAxisOrient) {
      if(yAxisOrient === 'right') {
        return paddingLeft;
      }
      return paddingLeft + yAxisWidth;
    }
  ),

  graphY: property('paddingTop', 'xAxis.orient', 'xAxis.height', 
    function (paddingTop, xAxisOrient, xAxisHeight) {
      if(xAxisOrient === 'top') {
        return xAxisHeight + paddingTop;
      }
      return paddingTop;
    }
  ),

  graphWidth: property('width', 'paddingRight', 'paddingLeft', 'yAxis.width',
    function (width, paddingLeft, paddingRight, yAxisWidth) {
      paddingRight = paddingRight || 0;
      paddingLeft = paddingLeft || 0;
      yAxisWidth = yAxisWidth || 0;
      return width - paddingRight - paddingLeft - yAxisWidth;
    }
  ),

  graphHeight: property('height', 'paddingTop', 'paddingBottom', 'xAxis.height',
    function (height, paddingTop, paddingBottom, xAxisHeight) {
      paddingTop = paddingTop || 0;
      paddingBottom = paddingBottom || 0;
      xAxisHeight = xAxisHeight || 0;
      return height - paddingTop - paddingBottom - xAxisHeight;
    }
  ),

  graphTransform: property('graphX', 'graphY', function (graphX, graphY) {
    return 'translate(%@, %@)'.fmt(graphX, graphY);
  }),

  willInsertElement: function () {
    this.set('hasRendered', true);
  },

  didInsertElement: function () {
    var graph = this.$('.graph');
    var self = this;

    graph.on('mousemove', function (e) {
      Ember.run(function () {
        var mouse = self.mousePoint(graph[0], e);
        self.onDidGraphHoverChange(e, mouse[0], mouse[1]);
      });
    });

    graph.on('mouseleave', function (e) {
      Ember.run(function () {
        self.onDidGraphHoverEnd(e);
      });
    });
  },

  // gets mouse position relative to the container
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

  parentController: Ember.computed.alias('templateData.view.controller'),

  _setup: function(){
    this.set('graphics', []);
  }.on('init')
});
