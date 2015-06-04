import Ember from 'ember';
import computed from 'ember-new-computed';

const { reads } = Ember.computed;

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
  graphX: computed('x', 'xScale', {
    get() {
      var scale = this.get('xScale');
      if(scale) {
        var x = this.get('x');
        this._graphX = scale(x);
      }
      return this._graphX || NaN;
    },
    set(key, value) {
      return this._graphX = value || NaN;
    }
  }),

  /**
    The y position relative to graph
    @property graphY
    @type Number
  */
  graphY: computed('y', 'yScale', {
    get() {
      var scale = this.get('yScale');
      if(scale) {
        var y = this.get('y');
        this._graphY = scale(y);
      }
      return this._graphY || NaN;
    },
    set(key, value) {
      return this._graphY = value || NaN;
    }
  }),

  /**
    The x domain value
    @property x
    @type Number
  */
  x: computed('graphX', 'xScale', {
    get() {
      var scale = this.get('xScale');
      if (scale && scale.invert){
        var graphX = this.get('graphX');
        this._x = scale.invert(graphX);
      }
      return this._x || 0;
    },
    set(key, value) {
      return this._x = value;
    }
  }),

  /**
    The y domain value
    @property y
    @type Number
  */
  y: computed('graphY', 'yScale', {
    get() {
      var scale = this.get('yScale');
      if (scale && scale.invert){
        var graphY = this.get('graphY');
        this._y = scale.invert(graphY);
      }
      return this._y || 0;
    },
    set(key, value) {
      return this._y = value;
    }
  }),

  /**
    The x position relative to the document
    @property pageX
    @type Number
  */
  pageX: computed('graphX', 'graphOffset', 'graphContentX', {
    get() {
      var offset = this.get('graphOffset');
      if(offset) {
        var graphX = this.get('graphX') || 0;
        var graphContentX = this.get('graphContentX') || 0;
        return offset.left + graphX + graphContentX;
      }
    }
  }),

  /**
    The y position relative to the document
    @property pageY
    @type Number
  */
  pageY: computed('graphY', 'graphOffset', 'graphContentY', {
    get() {
      var offset = this.get('graphOffset');
      if(offset) {
        var graphY = this.get('graphY') || 0;
        var graphContentY = this.get('graphContentY') || 0;
        return offset.top + graphY + graphContentY;
      }
    }
  }),

  /**
    The x scale from either the source or graph used to calculate positions
    @property xScale
    @type d3.scale
    @readonly
  */
  xScale: computed('graph.xScale', 'source.xScale', {
    get() {
      return this.get('source.xScale') || this.get('graph.xScale');
    }
  }),

  /**
    The y scale from either the source or graph used to calculate positions
    @property yScale
    @type d3.scale
    @readonly
  */
  yScale: computed('graph.yScale', 'source.yScale', {
    get() {
      return this.get('source.yScale') || this.get('graph.yScale');
    }
  }),

  /**
    The JQuery offset of the graph element
    @property graphOffset
    @type Object
    @readonly
  */
  graphOffset: computed('graph', {
    get() {
      var graph = this.get('graph');
      if(graph) {
        var content = graph.$('.nf-graph-content');
        return content ? content.offset() : undefined;
      }
    }
  }),

  /**
    The center point at x. Use in case of requiring a center point 
    and using ordinal scale.
    @property centerX
    @type Number
  */
  centerX: computed('xScale', 'graphX', {
    get() {
      var scale = this.get('xScale');
      var graphX = this.get('graphX');
      if(scale && scale.rangeBand) {
        var rangeBand = scale.rangeBand();
        return graphX + (rangeBand / 2);
      }
      return graphX;
    }
  }),

  /**
    The center point at y. Use in case of requiring a center point 
    and using ordinal scale.
    @property centerY
    @type Number
  */
  centerY: computed('yScale', 'graphY', {
    get() {
      var scale = this.get('yScale');
      var graphY = this.get('graphY');
      if(scale && scale.rangeBand) {
        var rangeBand = scale.rangeBand();
        return graphY + (rangeBand / 2);
      }
      return graphY;
    }
  }),

  /**
    The x position of the nf-graph-content within the nf-graph
    @property _graphContentX
    @type Number
    @private
  */
  graphContentX: reads('graph.graphX'),

  /**
    The y position of the nf-graph-content within the nf-graph
    @property _graphContentY
    @type Number
    @private
  */
  graphContentY: reads('graph.graphY'),
});