import Ember from 'ember';
import GraphMouseEvent from 'ember-nf-graph/utils/nf/graph-mouse-event';

/**
  Container component for graphics to display in `nf-graph`. Represents
  the area where the graphics, such as lines will display.

  Exists for layout purposes.
  @namespace components
  @class nf-graph-content
*/
export default Ember.Component.extend({
  tagName: 'g',

  classNames: ['nf-graph-content'],

  attributeBindings: ['transform', 'clip-path'],

  'clip-path': Ember.computed('graph.contentClipPathId', function(){
    let clipPathId = this.get('graph.contentClipPathId');
    return  `url('#${clipPathId}')`;
  }),

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The SVG transform for positioning the graph content
    @property transform
    @type String
    @readonly
  */
  transform: Ember.computed('x', 'y', function(){
    let x = this.get('x');
    let y = this.get('y');
    return `translate(${x} ${y})`;
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
    let ticks = this.get('graph.yAxis.ticks');
    let width = this.get('width');
    let height = this.get('height');

    if(!ticks || ticks.length === 0) {
      return Ember.A();
    }

    let sorted = ticks.slice().sort(function(a, b) {
      return a.y - b.y;
    });

    if(sorted[0].y !== 0) {
      sorted.unshift({ y: 0 });
    }

    let lanes = sorted.reduce(function(lanes, tick, i) {
      let y = tick.y;
      let next = sorted[i+1] || { y: height };
      let h = next.y - tick.y;
      lanes.push({
        x: 0,
        y: y,
        width: width,
        height: h
      });
      return lanes;
    }, []);

    return Ember.A(lanes);
  }),

  /**
    The name of the hoverChange action to fire
    @property hoverChange
    @type String
    @default null
  */
  hoverChange: null,

  mouseMove: function(e) {
    let context = GraphMouseEvent.create({
      originalEvent: e,
      source: this,
      graphContentElement: this.element,
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
    let context = GraphMouseEvent.create({
      originalEvent: e,
      source: this,
      graphContentElement: this.element
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

  init(){
    this._super(...arguments);

    Ember.run.schedule('afterRender', () => {
      this.set('graph.content', this);
    });
  },
});
