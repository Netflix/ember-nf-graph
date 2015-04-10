import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'g',

  attributeBindings: ['transform'],

  transform: Ember.computed('x', 'y', function(){
    return 'translate(%@ %@)'.fmt(this.get('x'), this.get('y'));
  }),

  className: 'nf-tick-label'
});