import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'g',

  attributeBindings: ['transform'],

  transform: Ember.computed('x', 'y', function(){
    var x = this.get('x');
    var y = this.get('y');
    return `translate(${x} ${y})`;
  }),

  className: 'nf-tick-label'
});