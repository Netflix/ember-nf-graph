import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';

/**
 * A component that adds a "crosshair" to an `nf-graph` that follows the mouse
 * while it's hovering over the graph content.
 *
 *
 * @namespace components
 * @class nf-crosshair
 */
export default Ember.Component.extend(HasGraphParent, {
  tagName: 'g',

  classNames: ['nf-crosshair'],

  height: Ember.computed.alias('graph.graphHeight'),

  width: Ember.computed.alias('graph.graphWidth'),

  x: Ember.computed.alias('graph.xHover'),
  y: Ember.computed.alias('graph.yHover'),

  xVisible: property('y', 'graph.graphHeight', function(y, graphHeight) {
    return 0 <= y && y <= graphHeight;
  }),

  yVisible: property('x', 'graph.graphWidth', function(x, graphWidth) {
    return 0 <= x && x <= graphWidth;
  }),
});