import Ember from 'ember';
export default Ember.Component.extend({
  tagName: 'text',

  attributeBindings: ['x', 'y', 'fill'],

  x: 0,
  y: 0,

  layout: function() {
    return this.get('formatTemplate');
  }.property('formatTemplate')
});
