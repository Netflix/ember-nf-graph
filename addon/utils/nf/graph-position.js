import Ember from 'ember';

/**
  Position calculation class for nf-graph related events
  @namespace utils.nf
  @class graph-position
  @extends Ember.Object
*/
export default Ember.Object.extend({
  /**
    @property graph
    @type component.nf-graph
    @default null
  */
  graph: null,

  /**
    @property source
    @type Ember.Component
  */
  source: null,

  /**
    The x position relative to graph
    @property graphX
    @type Number
  */
  graphX: Ember.computed('x', 'xScale', function(key, value) {
    if(arguments.length > 1) {
      this._graphX = value;
    } else {
      var scale = this.get('xScale');
      if(scale) {
        var x = this.get('x');
        this._graphX = scale(x);
      }
    }
    return this._graphX || NaN;
  }),

  /**
    The y position relative to graph
    @property graphY
    @type Number
  */
  graphY: Ember.computed('y', 'yScale', function(key, value) {
    if(arguments.length > 1) {
      this._graphY = value;
    } else {
      var scale = this.get('yScale');
      if(scale) {
        var y = this.get('y');
        this._graphY = scale(y);
      }
    }
    return this._graphY || NaN;
  }),

  /**
    The x domain value
    @property x
    @type Number
  */
  x: Ember.computed('graphX', 'xScale', function(key, value) {
    if(arguments.length > 1) {
      this._x = value;
    } else {
      var scale = this.get('xScale');
      if (scale && scale.invert){
        var graphX = this.get('graphX');
        this._x = scale.invert(graphX);
      } 
    }
    return this._x || 0;
  }),

  /**
    The y domain value
    @property y
    @type Number
  */
  y: Ember.computed('graphY', 'yScale', function(key, value) {
    if(arguments.length > 1) {
      this._y = value;
    } else {
      var scale = this.get('yScale');
      if (scale && scale.invert){
        var graphY = this.get('graphY');
        this._y = scale.invert(graphY);
      } 
    }
    return this._y || 0;
  }),

  /**
    The x position relative to the document
    @property pageX
    @type Number
  */
  pageX: Ember.computed('graphX', 'graphOffset', 'graphContentX', function(){
    var offset = this.get('graphOffset');
    if(offset) {
      var graphX = this.get('graphX') || 0;
      var graphContentX = this.get('graphContentX') || 0;
      return offset.left + graphX + graphContentX;
    }
  }),

  /**
    The y position relative to the document
    @property pageY
    @type Number
  */
  pageY: Ember.computed('graphY', 'graphOffset', 'graphContentY', function(){
    var offset = this.get('graphOffset');
    if(offset) {
      var graphY = this.get('graphY') || 0;
      var graphContentY = this.get('graphContentY') || 0;
      return offset.top + graphY + graphContentY;
    }
  }),

  /**
    The x scale from either the source or graph used to calculate positions
    @property xScale
    @type d3.scale
    @readonly
  */
  xScale: Ember.computed('graph.xScale', 'source.xScale', function(){
    return this.get('source.xScale') || this.get('graph.xScale');
  }),

  /**
    The y scale from either the source or graph used to calculate positions
    @property yScale
    @type d3.scale
    @readonly
  */
  yScale: Ember.computed('graph.yScale', 'source.yScale', function(){
    return this.get('source.yScale') || this.get('graph.yScale');
  }),

  /**
    The JQuery offset of the graph element
    @property graphOffset
    @type Object
    @readonly
  */
  graphOffset: Ember.computed('graph', function(){
    var graph = this.get('graph');
    if(graph) {
      var content = graph.$('.nf-graph-content');
      return content ? content.offset() : undefined;
    }
  }),

  /**
    The center point at x. Use in case of requiring a center point 
    and using ordinal scale.
    @property centerX
    @type Number
  */
  centerX: Ember.computed('xScale', 'graphX', function(){
    var scale = this.get('xScale');
    var graphX = this.get('graphX');
    if(scale && scale.rangeBand) {
      var rangeBand = scale.rangeBand();
      return graphX + (rangeBand / 2);
    }
    return graphX;
  }),

  /**
    The center point at y. Use in case of requiring a center point 
    and using ordinal scale.
    @property centerY
    @type Number
  */
  centerY: Ember.computed('yScale', 'graphY', function(){
    var scale = this.get('yScale');
    var graphY = this.get('graphY');
    if(scale && scale.rangeBand) {
      var rangeBand = scale.rangeBand();
      return graphY + (rangeBand / 2);
    }
    return graphY;
  }),

  /**
    The x position of the nf-graph-content within the nf-graph
    @property _graphContentX
    @type Number
    @private
  */
  graphContentX: Ember.computed.oneWay('graph.graphX'),

  /**
    The y position of the nf-graph-content within the nf-graph
    @property _graphContentY
    @type Number
    @private
  */
  graphContentY: Ember.computed.oneWay('graph.graphY'),
});