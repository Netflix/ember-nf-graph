import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { observer, property } from '../utils/computed-property-helpers';

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

  _x: -1,
  _y: -1,

  x: Ember.computed.alias('_x'),
  y: Ember.computed.alias('_y'),

  xVisible: property('y', 'graph.graphHeight', function(y, graphHeight) {
    return 0 <= y && y <= graphHeight;
  }),

  yVisible: property('x', 'graph.graphWidth', function(x, graphWidth) {
    return 0 <= x && x <= graphWidth;
  }),

  xLink: function(keyName, value){
    var xScale = this.get('graph.xScale');
    if(xScale) {
      if(arguments.length > 1) {
        this.set('x', xScale(value));
      }
      return xScale.invert(this.get('x'));
    } else {
      return 0;
    }
  }.property('x', 'graph.xScale'),

  yLink: function(keyName, value){
    var yScale = this.get('graph.yScale');
    if(yScale) {
      if(arguments.length > 1) {
        this.set('y', yScale(value));
      }
      return yScale.invert(this.get('y'));
    } else {
      return 0;
    }
  }.property('y', 'graph.yScale'),


  _hasGraph: observer('graph', function(graph){
    var self = this;
    graph.hoverChange(function(e, data){
      self.set('x', data.x);
      self.set('y', data.y);
    });
    graph.hoverEnd(function(){
      self.set('x', -1);
      self.set('y', -1);
    });
  })
});