import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { observer } from '../utils/computed-property-helpers';

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
  
  isVisible: false,

  classNames: ['nf-crosshair'],

  height: Ember.computed.alias('graph.graphHeight'),

  width: Ember.computed.alias('graph.graphWidth'),


  _hasGraph: observer('graph', function(graph){
    var self = this;
    graph.hoverChange(function(e, data){
      self.set('x', data.x);
      self.set('y', data.y);
      self.set('isVisible', true);
    });
    graph.hoverEnd(function(){
      self.set('isVisible', false);
    });
  })
});