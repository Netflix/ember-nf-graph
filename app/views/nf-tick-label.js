import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'g',

  attributeBindings: ['transform'],

  transform: function(){
    return 'translate(%@ %@)'.fmt(this.get('x'), this.get('y'));
  }.property('x', 'y'),

  className: 'nf-tick-label'
});