import { schedule } from '@ember/runloop';
import { A } from '@ember/array';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from 'ember-nf-graph/templates/components/nf-graph-content';
import GraphMouseEvent from 'ember-nf-graph/utils/nf/graph-mouse-event';

/**
  Container component for graphics to display in `nf-graph`. Represents
  the area where the graphics, such as lines will display.

  Exists for layout purposes.
  @namespace components
  @class nf-graph-content
*/
export default Component.extend({
  layout,
  tagName: 'g',

  classNames: ['nf-graph-content'],

  attributeBindings: ['transform', 'clip-path'],

  'clip-path': computed('graph.contentClipPathId', function(){
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
  transform: computed('x', 'y', function(){
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
  x: alias('graph.graphX'),

  /**
    The calculated y position of the graph content
    @property y
    @type Number
    @readonly
  */
  y: alias('graph.graphY'),

  /**
    The calculated width of the graph content
    @property width
    @type Number
    @readonly
  */
  width: alias('graph.graphWidth'),

  /**
    The calculated height of the graph content.
    @property height
    @type Number
    @readonly
  */
  height: alias('graph.graphHeight'),


  /**
    An array containing models to render the grid lanes
    @property gridLanes
    @type Array
    @readonly
  */
  gridLanes: computed('graph.yAxis.ticks', 'width', 'height', function () {
    let ticks = this.get('graph.yAxis.ticks');
    let width = this.get('width');
    let height = this.get('height');

    if(!ticks || ticks.length === 0) {
      return A();
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
      let h = Math.max(next.y - tick.y, 0);
      lanes.push({
        x: 0,
        y: y,
        width: width,
        height: h
      });
      return lanes;
    }, []);

    return A(lanes);
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
  frets: alias('graph.xAxis.ticks'),

  init(){
    this._super(...arguments);

    schedule('afterRender', () => {
      this.set('graph.content', this);
    });
  },
});
