import Ember from 'ember';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';

/**
  Draws a vertical line on a graph at a given x domain value
  @namespace components
  @class nf-vertical-line
  @extends Ember.Component
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(RequireScaleSource, {
  tagName: 'line',

  classNames: ['nf-vertical-line'],

  attributeBindings: ['lineX:x1', 'lineX:x2', 'y1', 'y2'],

  /**
    The parent graph for a component.
    @property graph
    @type components.nf-graph
    @default null
    */
  graph: null,

  /**
    The top y coordinate of the line
    @property y1
    @type Number
    @default 0
    @private
  */
  y1: 0,

  /**
    The bottom y coordinate of the line
    @property y2
    @type Number
    @private
    @readonly
  */
  y2: Ember.computed.alias('graph.graphHeight'),

  /**
    The x domain value at which to draw the vertical line on the graph
    @property x
    @type Number
    @default null
  */
  x: null,

  /**
    The calculated x coordinate of the vertical line
    @property lineX
    @type Number
    @private
    @readonly
  */
  lineX: Ember.computed('xScale', 'x', function(){
    let xScale = this.get('xScale');
    let x = this.get('x');
    let px = xScale ? xScale(x) : -1;
    return px && px > 0 ? px : 0;
  }),
});
