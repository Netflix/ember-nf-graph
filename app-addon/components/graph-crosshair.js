import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
  tagName: 'g',
  // templateName: 'ember-cli-ember-dvc/components/graph-crosshair',
  
  isVisible: false,

  classNameBindings: ['class'],

  height: function (){
    return this.get('graph.graphHeight');
  }.property('graph.graphHeight'),

  width: function(){
    return this.get('graph.graphWidth');
  }.property('graph.graphWidth'),

  class: 'graph-crosshair',

  didGraphHoverChange: function(e, data){
    this.set('x', data.x);
    this.set('y', data.y);
    this.set('isVisible', true);
  },

  didGraphHoverEnd: function(){
    this.set('isVisible', false);
  }
});