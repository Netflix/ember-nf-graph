import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import GraphMouseEvent from 'ember-cli-nf-graph/utils/nf/graph-mouse-event';

/**
  Container component for graphics to display in `nf-graph`. Represents
  the area where the graphics, such as lines will display.
  
  Exists for layout purposes.
  @namespace components
  @class nf-graph-content
  @uses mixins.graph-has-graph-parent
*/  
export default Ember.Component.extend(HasGraphParent, {
  tagName: 'g',
  
  classNames: ['nf-graph-content'],

  attributeBindings: ['transform', 'clip-path'],

  'clip-path': Ember.computed('graph.contentClipPathId', function(){
    var clipPathId = this.get('graph.contentClipPathId');
    return 'url(\'#%@\')'.fmt(clipPathId);
  }),

  /**
    The SVG transform for positioning the graph content
    @property transform
    @type String
    @readonly
  */
  transform: Ember.computed('x', 'y', function(){
    return 'translate(%@ %@)'.fmt(this.get('x'), this.get('y'));
  }),

  /**
    The x position of the graph content
    @property x
    @type Number
    @readonly
  */
  x: Ember.computed.alias('graph.graphX'),

  /**
    The calculated y position of the graph content
    @property y
    @type Number
    @readonly
  */
  y: Ember.computed.alias('graph.graphY'),

  /**
    The calculated width of the graph content
    @property width
    @type Number
    @readonly
  */
  width: Ember.computed.alias('graph.graphWidth'),

  /**
    The calculated height of the graph content.
    @property height
    @type Number
    @readonly
  */
  height: Ember.computed.alias('graph.graphHeight'),


  /**
    An array containing models to render the grid lanes
    @property gridLanes
    @type Array
    @readonly
  */
  gridLanes: Ember.computed('graph.yAxis.ticks', 'width', 'height', function () {
    var ticks = this.get('graph.yAxis.ticks');
    var width = this.get('width');
    var height = this.get('height');

    if(!ticks || ticks.length === 0) {
      return [];
    }

    var sorted = ticks.slice().sort(function(a, b) {
      return a.y - b.y;
    });

    if(sorted[0].y !== 0) {
      sorted.unshift({ y: 0 });
    }

    var lanes = sorted.reduce(function(lanes, tick, i) {
      var y = tick.y;
      var next = sorted[i+1] || { y: height };
      var h = next.y - tick.y;
      lanes.push({
        x: 0,
        y: y,
        width: width,
        height: h
      });
      return lanes;
    }, []);

    return lanes;
  }),

  /**
    The name of the hoverChange action to fire
    @property hoverChange
    @type String
    @default null
  */
  hoverChange: null,

  mouseMove: function(e) {
    var context = GraphMouseEvent.create({
      originalEvent: e,
      source: this,
      graph: this.get('graph'),
    });

    this.trigger('didHoverChange', context);

    if(this.get('hoverChange')) {
      this.sendAction('hoverChange', context);
    }
  },

  /**
    The name of the hoverEnd action to fire
    @property hoverEnd
    @type String
    @default null
  */
  hoverEnd: null,

  mouseLeave: function(e) {
    var context = GraphMouseEvent.create({
      originalEvent: e,
      source: this,
      graph: this.get('graph'),
    });
    this.trigger('didHoverEnd', context);

    if(this.get('hoverEnd')) {
      this.sendAction('hoverEnd', context);
    }
  },

  /**
    An array containing models to render fret lines
    @property frets
    @type Array
    @readonly
  */
  frets: Ember.computed.alias('graph.xAxis.ticks'),

  hasGraph: function(graph) {
    graph.set('content', this);
  },
});