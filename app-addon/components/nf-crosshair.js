import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';

/**
  A component that adds a "crosshair" to an `nf-graph` that follows the mouse
  while it's hovering over the graph content.
  @namespace components
  @class nf-crosshair
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend(HasGraphParent, {
  tagName: 'g',

  classNames: ['nf-crosshair'],

  /**
    The height of the crosshair in pixels
    @property height
    @type Number
    @readonly
  */
  height: Ember.computed.alias('graph.graphHeight'),

  /**
    The width of the crosshair in pixels
    @property width
    @type Number
    @readonly
  */
  width: Ember.computed.alias('graph.graphWidth'),

  /**
    The x position, in pixels, of the crosshair center
    @property x
    @type Number
    @readonly
  */
  x: Ember.computed.alias('graph.xHover'),

  /**
    The y position, in pixels, of the crosshair center
    @property y
    @type Number
    @readonly
  */
  y: Ember.computed.alias('graph.yHover'),

  /**
    Determines visibility of horizontal "x" line.
    @property xVisible
    @type Boolean
    @readonly
  */
  xVisible: property('y', 'graph.graphHeight', function(y, graphHeight) {
    return 0 <= y && y <= graphHeight;
  }),

  /**
    Determines visibility of vertical "y" line.
    @property yVisible
    @type Boolean
    @readonly
  */
  yVisible: property('x', 'graph.graphWidth', function(x, graphWidth) {
    return 0 <= x && x <= graphWidth;
  }),
});