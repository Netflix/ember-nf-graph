import Ember from 'ember';

var SCALE_TYPES = {
  'linear': d3.scale.linear,
  'power': function () {
    return d3.scale.pow().exponent(3);
  },
  'log': d3.scale.log
};

export default Ember.Component.extend({
  tagName: 'div',
  templateName: 'ember-cli-ember-dvc/components/graph-container',
  
  isGraph: true,
  hasRendered: false,

  width: 300,
  height: 100,

  paddingTop: 5,
  paddingLeft: 0,
  paddingRight: 0,
  paddingBottom: 0,

  showLanes: false,

  xDomainMode: 'auto',
  yDomainMode: 'auto',

  _updateDomainExtent: function(){
    var xMin = this.get('xMin');
    var xMax = this.get('xMax');
    var yMin = this.get('yMin');
    var yMax = this.get('yMax');

    this.set('domainExtent', {
      xMin: xMin,
      xMax: xMax,
      yMin: yMin,
      yMax: yMax
    });

    this.set('xDomain', [xMin, xMax]);
    this.set('yDomain', [yMin, yMax]);
  }.observes('xMin', 'xMax', 'yMin', 'yMax').on('init'),

  dataDomainExtent: function(){
    var graphics = this.get('graphics');
    var extent = {};

    if(!graphics) {
      return extent;
    }

    var result = graphics.reduce(function(extent, graphic) {
      var sortedData = graphic.get('sortedData');
      
      if(!sortedData || sortedData.length === 0) {
        return extent;
      }

      var gxMin = sortedData[0][0];
      var gxMax = sortedData[sortedData.length - 1][0];

      var resortedData = sortedData.slice().sort(function(a, b) {
        return a[1] - b[1];
      });
      var gyMin = resortedData[0][1];
      var gyMax = resortedData[resortedData.length - 1][1];

      if(typeof extent.xMin === 'undefined' || extent.xMin > gxMin) {
        extent.xMin = gxMin;
      }
      
      if(typeof extent.xMax === 'undefined' || extent.xMax < gxMax) {
        extent.xMax = gxMax;
      }

      if(typeof extent.yMin === 'undefined' || extent.yMin > gyMin) {
        extent.yMin = gyMin;
      }

      if(typeof extent.yMax === 'undefined' || extent.yMax < gyMax) {
        extent.yMax = gyMax;
      }

      return extent;
    }, extent);

    return result;
  }.property('graphics.@each.sortedData', 'xDomainMode', 'yDomainMode'),

  _xMin: 0,
  _xMax: 1,
  _yMin: 0,
  _yMax: 1,

   xMin: function(name, value) {
    if(arguments.length > 1) {
      this._xMin = value;
    }

    var yDomainMode = this.get('yDomainMode');
    var dataDomainExtent = this.get('dataDomainExtent');

    if(yDomainMode === 'fit' || (yDomainMode === 'auto' && dataDomainExtent.xMin < this._xMin)) {
      this._xMin = dataDomainExtent.xMin;
    }

    return this._xMin;
  }.property('dataDomainExtent', 'yDomainMode'),

   xMax: function(name, value) {
    if(arguments.length > 1) {
      this._xMax = value;
    }

    var yDomainMode = this.get('yDomainMode');
    var dataDomainExtent = this.get('dataDomainExtent');

    if(yDomainMode === 'fit' || (yDomainMode === 'auto' && dataDomainExtent.xMax > this._xMax)) {
      this._xMax = dataDomainExtent.xMax;
    }

    return this._xMax;
  }.property('dataDomainExtent', 'yDomainMode'),

  yMin: function(name, value) {
    if(arguments.length > 1) {
      this._yMin = value;
    }

    var yDomainMode = this.get('yDomainMode');
    var dataDomainExtent = this.get('dataDomainExtent');
    
    if(yDomainMode === 'fit' || (yDomainMode === 'auto' && dataDomainExtent.yMin < this._yMin)) {
      this._yMin = dataDomainExtent.yMin;
    }

    return this.get('_yMin');
  }.property('dataDomainExtent', 'yDomainMode'),

  yMax: function(name, value) {
    if(arguments.length > 1) {
      this._yMax = value;
    }

    var yDomainMode = this.get('yDomainMode');
    var dataDomainExtent = this.get('dataDomainExtent');

    if(yDomainMode === 'fit' || (yDomainMode === 'auto' && dataDomainExtent.yMax > this._yMax)) {
      this._yMax = dataDomainExtent.yMax;
    }

    return this._yMax;
  }.property('dataDomainExtent', 'yDomainMode'),

  xScaleType: 'linear',
  yScaleType: 'linear',

  _graphics: null,

  graphics: function(key, value) {
    if(arguments.length > 1) {
      this.set('_graphics', value);
    }

    if(!this.get('_graphics')) {
      this.set('_graphics', []);
    }

    return this.get('_graphics');
  }.property('_graphics'),

  yAxis: null,
  xAxis: null,


  showYAxis: function () {
    return !!this.get('yAxis');
  }.property('yAxis'),

  showXAxis: function () {
    return !!this.get('xAxis');
  }.property('xAxis'),

  xScaleFactory: function () {
    var type = this.get('xScaleType');
    var factory = SCALE_TYPES[type];
    if (!factory) {
      throw new Error('invalid scale type: ' + type);
    }
    return factory;
  }.property('xScaleType'),

  yScaleFactory: function () {
    var type = this.get('yScaleType');
    var factory = SCALE_TYPES[type];
    if (!factory) {
      throw new Error('invalid scale type: ' + type);
    }
    return factory;
  }.property('yScaleType'),

  xScale: function () {
    var scale = this.get('xScaleFactory')();
    var domain = this.get('xDomain');
    var range = this.get('xRange');
    var type = this.get('xScaleType');
    
    if (type === 'log') {
      if (domain[0] <= 0) {
        domain[0] = 1;
      }
      if (domain[1] <= 0) {
        domain[1] = 1;
      }
    }

    return scale.domain(domain).range(range);
  }.property('xScaleFactory', 'xRange', 'xDomain', 'xScaleType', 'xTickCount'),

  yScale: function () {
    var scale = this.get('yScaleFactory')();
    var domain = this.get('yDomain');
    var range = this.get('yRange');
    var type = this.get('yScaleType');
    var niceArg;

    if (type === 'log') {
      if (domain[0] <= 0) {
        domain[0] = 1;
      }
      if (domain[1] <= 0) {
        domain[1] = 1;
      }
      niceArg = this.get('yTickCount');
    }

    var result = scale.domain(domain).range(range).nice(niceArg);
    console.log('yScale', result, domain, range);
    return result;
  }.property('yScaleFactory', 'yRange', 'yDomain', 'yScaleType', 'yTickCount'),

  // used to register lines, areas, etc.
  registerGraphic: function (graphic) {
    console.log('register', this.blah);
    var graphics = this.get('graphics');
    graphics.pushObject(graphic);
  },

  unregisterGraphic: function(graphic) {
    var graphics = this.get('graphics');
    graphics.removeObject(graphic);
  },

  onDidGraphHoverChange: function (e, mouseX, mouseY) {
    var graphics = this.get('graphics');
    if (!graphics) {
      return;
    }

    var xScale = this.get('xScale');
    var yScale = this.get('yScale');

    var data = {
      x: mouseX,
      y: mouseY,
      xValue: xScale.invert(mouseX),
      yValue: yScale.invert(mouseY)
    };

    graphics.forEach(function (g) {
      if (g.didGraphHoverChange) {
        g.didGraphHoverChange(e, data);
      }
    });
  },

  onDidGraphHoverEnd: function (e) {
    var graphics = this.get('graphics');
    if (!graphics) {
      return;
    }

    graphics.forEach(function (g) {
      if (g.didGraphHoverEnd) {
        g.didGraphHoverEnd(e);
      }
    });
  },

  yRange: function () {
    var max = this.get('graphHeight');
    return [max, 0];
  }.property('graphHeight'),

  xRange: function () {
    var max = this.get('graphWidth');
    return [0, max];
  }.property('graphWidth'),

  hasData: function () {
    var graphics = this.get('graphics');
    return graphics && graphics.length > 0;
  }.property('graphics'),

  graphX: function () {
    var paddingLeft = this.get('paddingLeft');
    var yAxisWidth = this.get('yAxis.width');
    var yAxisOrient = this.get('yAxis.orient');

    if(yAxisOrient === 'right') {
      return paddingLeft;
    }

    return paddingLeft + yAxisWidth;
  }.property('paddingLeft', 'yAxis.width', 'yAxis.orient'),

  graphY: function () {
    var xAxisOrient = this.get('xAxis.orient');
    var xAxisHeight = this.get('xAxis.height');
    var paddingTop = this.get('paddingTop');

    if(xAxisOrient === 'top') {
      return xAxisHeight + paddingTop;
    }

    return paddingTop;
  }.property('paddingTop', 'xAxis.orient', 'xAxis.height'),

  graphWidth: function () {
    var width = this.get('width');
    var paddingLeft = this.get('paddingLeft') || 0;
    var paddingRight = this.get('paddingRight') || 0;
    var yAxisWidth = this.get('yAxis.width') || 0;
    return width - paddingRight - paddingLeft - yAxisWidth;
  }.property('width', 'paddingRight', 'paddingLeft', 'yAxis.width'),

  graphHeight: function () {
    var height = this.get('height');
    var paddingTop = this.get('paddingTop') || 0;
    var paddingBottom = this.get('paddingBottom') || 0;
    var xAxisHeight = this.get('xAxis.height') || 0;
    return height - paddingTop - paddingBottom - xAxisHeight;
  }.property('graphY', 'height', 'paddingBottom', 'xAxis.height'),

  graphTransform: function () {
    var graphX = this.get('graphX');
    var graphY = this.get('graphY');
    return 'translate(%@, %@)'.fmt(graphX, graphY);
  }.property('graphX', 'graphY'),

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

  debug: false,

  debugInfo: function(){
    if(this.get('debug')) {
      var info = {
        name: this.get('name'),
        xMin: this.get('xMin'),
        xMax: this.get('xMax'),
        yMin: this.get('yMin'),
        yMax: this.get('yMax'),
        dataDomainExtent: this.get('dataDomainExtent'),
        domainExtent: this.get('domainExtent'),
        graphicsLength: this.get('graphics.length'),
        xScale: [this.get('xScale').range(), this.get('xScale').domain()],
        yScale: [this.get('yScale').range(), this.get('yScale').domain()]
      };

      console.log('DEBUG: ', info);
      return JSON.stringify(info, null, '  ');
    }
  }.property('debug', 'xMin', 'xMax', 'yMin', 'yMax', 'dataDomainExtent', 'domainExtent', 'graphics.length', 'name', 'xScale', 'yScale')
});
